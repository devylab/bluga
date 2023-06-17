import { restartable, Fastify } from '@fastify/restartable';
import { FastifyServerOptions } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCompress from '@fastify/compress';
import fastifyCSRF from '@fastify/csrf-protection';
import fastifySession from '@fastify/secure-session';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
// import fastifyRateLimit from '@fastify/rate-limit';
import formBody from '@fastify/formbody';
import { env } from './shared/constants/env.mjs';
import { logger } from './shared/logger/index.mjs';
import database from './shared/database/index.mjs';
import cache from './shared/cache/index.mjs';
import { AppModule } from './app.module.mjs';
import { Utils } from './shared/utils/index.mjs';

// eslint-disable-next-line max-lines-per-function
const createApp = async (fastify: Fastify, opts: FastifyServerOptions) => {
  const app = fastify(opts);

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  });
  // await app.register(fastifyRateLimit, {
  //   max: 100,
  //   timeWindow: '1 minute',
  // });
  await app.register(fastifyCompress);
  await app.register(fastifyCookie, { secret: env.cookieSecret });
  await app.register(fastifyCSRF, { cookieOpts: { signed: true } });
  await app.register(fastifySession, {
    sessionName: 'session',
    cookieName: 'pmdqrs',
    key: Utils.getSessionSecret(),
    cookie: {
      path: '/',
      signed: false,
      httpOnly: true,
      secure: env.environment.isProduction,
      sameSite: true,
      // expires: new Date(new Date().getTime() + 1000 * 5),
    },
  });
  await app.register(formBody);
  await app.register(fastifyMultipart, { limits: { fileSize: 3145728 } }); // 3mb

  await app.register(
    async (fasti, _, done) => {
      const appModule = new AppModule(fasti);
      await appModule.loadRoutes();
      done();
    },
    { prefix: `/` },
  );

  app.setErrorHandler(function (error, request, reply) {
    logger.error(error, 'GLOBAL ERROR HANDLER');
    const toSend = {
      message: 'internal server error',
      error: 'server error',
      statusCode: 500,
    };
    reply.code(toSend.statusCode).send(toSend);
  });

  return app;
};

// await database.connect();
const app = await restartable(createApp, {
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
  logger: true,
  // pluginTimeout: env.environment.isDevelopment ? 120_000 : undefined,
});
const host = await app.listen({ port: env.port, host: env.host });
logger.info(`Server listening at ${host}`);

process.on('SIGUSR1', () => {
  app.restart();
});

process.once('SIGINT', async () => {
  logger.info('Stopping the server');
  await database.disconnect();
  await cache.close();
  await app.close();
});
