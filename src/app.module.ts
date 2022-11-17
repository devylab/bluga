import { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { UserRoute } from './users/user.route';

export class AppModule {
  private readonly userRoutes;
  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: path.join(__dirname, 'contents/themes'),
    });

    this.userRoutes = new UserRoute(this.app);
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
    this.userRoutes.loadRoutes();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
