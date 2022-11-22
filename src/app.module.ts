import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import fastifyNext from '@fastify/nextjs';
import Handlebars from 'handlebars';
import path from 'path';
import { UserRoute } from './users/user.route';
import { Utils } from '@shared/utils';
import { env } from '@shared/constants/env';
import { formatAdminRoutes } from '@shared/constants/adminRoutes';

export class AppModule {
  private readonly userRoutes;

  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: path.join(__dirname, 'static'),
    });

    this.app.register(fastifyView, {
      engine: {
        handlebars: Handlebars,
      },
      root: path.join(__dirname, 'contents', 'themes'),
    });

    this.userRoutes = new UserRoute(this.app);
  }

  private loadAdmin() {
    this.app
      .register(fastifyNext, {
        dev: env.environment.isDevelopment,
      })
      .after(() => {
        const { adminRoutes } = Utils.renderAdminRoutes();

        adminRoutes.subscribe((routes) => {
          const formattedRoutes = formatAdminRoutes(routes);
          formattedRoutes.forEach((route) => {
            this.app.next(route);
          });
        });
      });
  }

  private loadIndex() {
    this.app.get('/', async (req, reply) => {
      const theme = '/home-coming' + '/pages/index.hbs';
      // We are awaiting a functioon result
      // const t = await something();

      // Note the return statement
      return reply.view(theme, { text: 'text' });
    });

    this.app.get('/robots.txt', async (req, reply) => {
      return reply.sendFile('robots.txt');
    });
  }

  private noRoute() {
    this.app.setNotFoundHandler(async () => {
      // const theme = 'second' + '/index.html';
      return { data: 'nothing to show' };
    });
  }

  loadRoutes() {
    this.loadAdmin();
    this.loadIndex();
    this.userRoutes.loadRoutes();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
