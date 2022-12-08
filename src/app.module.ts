import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import EJS from 'ejs';
import path from 'path';
import minifier from 'html-minifier';
import { UserRoute } from './users/user.route';
import { env } from '@shared/constants/env';
import { Utils } from '@shared/utils';
import { formatAdminRoutes } from '@shared/constants/adminRoutes';
import { ContentRoute } from './content/content.route';
import { ContentService } from './content/content.service';

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
  private readonly contentRoutes;

  // eslint-disable-next-line max-lines-per-function
  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: [path.join(__dirname, '..', 'public')],
      prefix: '/public/',
    });

    this.app.register(fastifyStatic, {
      root: path.join(__dirname, 'tools'),
      decorateReply: false,
    });

    this.app.register(fastifyView, {
      engine: { ejs: EJS },
      root: path.join(__dirname, 'tools', 'themes'),
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
    this.contentRoutes = new ContentRoute(this.app);
  }

  private loadAdmin() {
    const { adminRoutes, adminMenus } = Utils.renderAdminRoutes();
    adminRoutes.subscribe((routes) => {
      const formattedRoutes = formatAdminRoutes(routes);
      formattedRoutes.forEach((route) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.get(route.to, async (req, reply: any) => {
          // We are awaiting a function result
          // const t = await something();
          return reply.admin(route.path, {
            async: true,
            page: route.name,
            sidebarLinks: adminMenus,
            currentPage: req.url,
          });
        });
      });
    });
  }

  private loadIndex() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.app.get('/', async (req, reply: any) => {
      const theme = '/avail' + '/pages/index.ejs';
      const conServ = new ContentService();
      // We are awaiting a functioon result
      const contents = await conServ.getPublicContents('DRAFT');

      const options = {
        themePath: () => '/themes/avail',
      };

      // Note the return statement
      return reply.themes(theme, { contents: contents.data, ...options });
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

  private loadApi() {
    this.userRoutes.loadRoutes();
    this.contentRoutes.loadRoutes();
  }

  loadRoutes() {
    this.loadApi();
    this.loadAdmin();
    this.loadIndex();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
