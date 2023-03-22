import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import { env } from '@shared/constants/env';
import minifier from 'html-minifier';
import { subDirectoryPath, minifierOpts } from '@shared/constants';
import { Utils } from '@shared/utils';
import { authGuard } from '@shared/guards/authGuard';
import { ThemeService } from '../theme/theme.service';
import { ContentService } from '../content/content.service';
import { GlobalUtils } from '@shared/utils/global';
import { SettingsService } from '../settings/settings.service';

export class AdminView {
  private readonly db;

  constructor(private readonly app: FastifyInstance) {
    this.app.register(fastifyStatic, {
      root: path.join(__dirname, '..', 'public'),
      prefix: '/public/',
      decorateReply: false,
    });

    this.app.register(fastifyView, {
      engine: { ejs: EJS },
      root: path.join(__dirname, '..', 'admin'),
      propertyName: 'admin',
      viewExt: 'ejs',
      production: env.environment.isProduction,
      options: {
        useHtmlMinifier: minifier,
        htmlMinifierOptions: minifierOpts,
        async: true,
      },
    });

    this.db = {
      themeService: new ThemeService(),
      contentService: new ContentService(),
      settingsService: new SettingsService(),
    };
  }

  // eslint-disable-next-line max-lines-per-function
  loadAdminView() {
    const { adminRoutes, adminMenus } = Utils.renderAdminRoutes();
    adminRoutes.subscribe((routes) => {
      const formattedRoutes = Utils.formatAdminRoutes(routes);
      formattedRoutes.forEach((route) => {
        this.app.get(route.to, async (req, reply) => {
          const schema = `${env.environment.isProduction ? 'https' : 'http'}://${req.hostname}${subDirectoryPath}`;
          const notProtected = [path.join(subDirectoryPath, 'admin/', 'login')];
          const isNotProtected = notProtected.includes(req.routerPath);

          let user;
          if (!isNotProtected) {
            const authUser = await authGuard(req);
            if (!authUser) return reply.redirect(`${subDirectoryPath}admin/login`);
            user = authUser;
          }

          return reply.admin(
            route.path || '',
            {
              page: route.name,
              sidebarLinks: adminMenus,
              currentPage: req.url,
              header: route.header || [],
              footer: route.footer || [],
              user,
              db: this.db,
              appLink: schema,
              tools: { utils: GlobalUtils, subDirectory: schema },
            },
            { layout: isNotProtected ? undefined : '/layouts/dashboard.ejs' },
          );
        });
      });
    });
  }
}
