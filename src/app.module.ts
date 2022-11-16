import { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

export class AppModule {
  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: path.join(__dirname, 'contents/themes'),
    });
  }

  private loadIndex() {
    this.app.get('/', async (req, reply) => {
      const theme = 'second' + '/index.html';
      return reply.sendFile(theme);
    });
  }

  private noRoute() {
    this.app.setNotFoundHandler(async (req, reply) => {
      const theme = 'second' + '/index.html';
      return reply.sendFile(theme);
    });
  }

  loadRoutes() {
    this.loadIndex();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
