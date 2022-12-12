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

type ChangeLater = {
  route: string;
  path: string;
  queries: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: (self: unknown) => any;
  }[];
};

export class AppModule {
  private readonly userRoutes;
  private readonly contentRoutes;
  private readonly contentService;

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
    this.contentService = new ContentService();
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
    const currentTheme = '/avail';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const themeConfig = require(path.join(__dirname, 'tools', 'themes', currentTheme, 'config.js')) as ChangeLater[];
    for (const current of themeConfig) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.app.get(current.route, async (req, reply: any) => {
        const options = {
          themePath: () => '/themes/avail',
        } as { [name: string]: unknown };

        for (const query of current.queries) {
          const queryOptions = {
            content: this.contentService,
            params: req.params,
          };
          const { data } = await query.query(queryOptions);
          options[query.name] = data;
        }

        // Note the return statement
        return reply.themes(currentTheme + current.path, options);
      });
    }

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
