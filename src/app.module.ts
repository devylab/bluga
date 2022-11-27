import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import EJS from 'ejs';
import path from 'path';
import minifier from 'html-minifier';
import { UserRoute } from './users/user.route';
import { env } from '@shared/constants/env';
import { adminMenus } from '@shared/constants/adminRoutes';
// import { Utils } from '@shared/utils';
// import { formatAdminRoutes } from '@shared/constants/adminRoutes';

const minifierOpts = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

export class AppModule {
  private readonly userRoutes;

  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: [path.join(__dirname, '..', 'public')],
      prefix: '/public/',
    });

    this.app.register(fastifyView, {
      engine: { ejs: EJS },
      root: path.join(__dirname, 'contents', 'themes'),
      propertyName: 'themes',
      viewExt: 'ejs',
      production: env.environment.isProduction,
    });

    this.app.register(fastifyView, {
      engine: { ejs: EJS },
      root: path.join(__dirname, 'admin'),
      propertyName: 'admin',
      viewExt: 'ejs',
      production: env.environment.isProduction,
      layout: '/layouts/dashboard.ejs',
      options: {
        useHtmlMinifier: minifier,
        htmlMinifierOptions: minifierOpts,
      },
    });

    // this.app.use
    this.userRoutes = new UserRoute(this.app);
  }

  private loadAdmin() {
    // const { adminRoutes } = Utils.renderAdminRoutes();
    // adminRoutes.subscribe((routes) => {
    //   const formattedRoutes = formatAdminRoutes(routes);
    //   formattedRoutes.forEach((route) => {
    //     // this.app.next(route);
    //   });
    // });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.app.get('/admin', async (req, reply: any) => {
      const theme = '/pages/overview.ejs';
      // We are awaiting a function result
      // const t = await something();
      // Note the return statement
      return reply.admin(theme, { page: 'Overview', sidebarLinks: adminMenus, currentPage: req.url });
    });
  }

  private loadIndex() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.app.get('/', async (req, reply: any) => {
      const theme = '/home-coming' + '/pages/index.hbs';
      // We are awaiting a functioon result
      // const t = await something();

      // Note the return statement
      return reply.themes(theme, { text: 'text' });
    });

    this.app.get('/robots.txt', async (req, reply) => {
      return reply.sendFile('/robots.txt');
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
