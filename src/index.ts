import fastify from 'fastify';
import { env } from '@shared/constants/env';
import { logger } from '@shared/logger';
import database from '@shared/database';
import { AppModule } from './app.module';
import cache from '@shared/cache';

export class AppInstance {
  private readonly server;

  constructor() {
    this.server = fastify({
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
      logger: env.environment.isDevelopment,
    });
  }

  async startApp() {
    await database.connect();
    const appModule = new AppModule(this.server);
    appModule.loadRoutes();

    this.server.setErrorHandler(function (error, request, reply) {
      if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error);
        // Send error response
        reply.status(500).send({ ok: false });
      }
    });

    this.server.listen({ port: env.port }, (err, address) => {
      if (err) {
        logger.error(err, 'unable to start app');
        process.exit(1);
      }

      logger.info(`Server listening at ${address}`);
    });
  }

  async stopApp() {
    await database.disconnect();
    await cache.close();
    await this.server.close();
    logger.info('app stopped successfully');
    process.exit(1);
  }
}

const app = new AppInstance();
app.startApp().catch((err) => {
  app.stopApp();
  logger.error(err, 'app crashed on start');
});

const events = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM', 'uncaughtException'];
events.forEach((event) => {
  process.on(event, () => {
    app.stopApp();
    logger.info(`app stopped because this event: ${event} was triggere`);
  });
});
