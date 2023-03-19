import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCompress from '@fastify/compress';
import fastifyCSRF from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import formBody from '@fastify/formbody';
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
      pluginTimeout: env.environment.isDevelopment ? 120_000 : undefined,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  async startApp() {
    await database.connect();

    // register fastify plugin
    await this.server.register(fastifyHelmet, {
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    });
    await this.server.register(fastifyRateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });
    await this.server.register(fastifyCompress);
    await this.server.register(fastifyCookie, { secret: env.cookieSecret });
    await this.server.register(fastifyCSRF, { cookieOpts: { signed: true } });
    await this.server.register(formBody);
    await this.server.register(fastifyMultipart, { attachFieldsToBody: true });

    this.server.register(
      (fasti, _, done) => {
        const appModule = new AppModule(fasti);
        appModule.loadRoutes();
        done();
      },
      { prefix: `/${env.subDirectory}` },
    );

    this.server.setErrorHandler(function (error, request, reply) {
      if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error);
        // Send error response
        reply.status(500).send({ ok: false });
      }
    });

    this.server.listen({ port: env.port, host: env.host }, (err, address) => {
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
  process.on(event, async () => {
    await app.stopApp();
    logger.info(`app stopped because this event: ${event} was triggere`);
  });
});
