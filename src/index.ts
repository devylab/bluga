import fastify, { FastifyInstance } from 'fastify';
import { env } from '@shared/constants/env';
import { logger } from '@shared/logger';
import { AppModule } from './app.module';

export class AppInstance {
  private readonly server: FastifyInstance;

  constructor() {
    this.server = fastify({
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
      logger: env.environment.isDevelopment,
    });
  }

  async startApp() {
    const appModule = new AppModule(this.server);
    appModule.loadRoutes();

    this.server.listen({ port: env.port }, (err, address) => {
      if (err) {
        logger.error(err, 'unable to start app');
        process.exit(1);
      }

      logger.info(`Server listening at ${address}`);
    });
  }

  async stopApp() {
    await this.server.close();
    logger.info('app stopped successfully');
  }
}

const app = new AppInstance();
app.startApp();

const events = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM', 'uncaughtException'];
events.forEach((event) => {
  process.on(event, () => app.stopApp());
});
