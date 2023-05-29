import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import { env } from '../shared/constants/env.mjs';
import minifier from 'html-minifier';
import { subDirectoryPath, minifierOpts } from '../shared/constants/index.mjs';
import { Utils } from '../shared/utils/index.mjs';
import { authGuard } from '../shared/guards/authGuard.mjs';
import { ThemeService } from '../theme/theme.service.mjs';
import { ContentService } from '../content/content.service.mjs';
import { GlobalUtils } from '../shared/utils/global.mjs';
import { SettingsService } from '../settings/settings.service.mjs';

const { __dirname } = Utils.fileDirPath(import.meta);

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
            req.auth_guard_type = 'inner';
            const authUser = await authGuard(req, reply);
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
              session: req.session.get,
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
