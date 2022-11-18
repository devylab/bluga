import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import Handlebars from 'handlebars';
import path from 'path';
import { UserRoute } from './users/user.route';

export class AppModule {
  private readonly userRoutes;
  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyView, {
      engine: {
        handlebars: Handlebars,
      },
      root: path.join(__dirname, 'contents', 'themes'),
    });

    this.userRoutes = new UserRoute(this.app);
  }

  private loadIndex() {
    this.app.get('/', async (req, reply) => {
      const theme = '/home-coming' + '/pages/index.hbs';
      // We are awaiting a functioon result
      // const t = await something();

      // Note the return statement
      return reply.view(theme, { text: 'text' });
    });
  }

  private noRoute() {
    this.app.setNotFoundHandler(async () => {
      // const theme = 'second' + '/index.html';
      return { data: 'nothing to show' };
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
