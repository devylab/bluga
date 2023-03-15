import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import { env } from '@shared/constants/env';
import minifier from 'html-minifier';
import { minifierOpts } from '@shared/constants';
import { Utils } from '@shared/utils';
import { authGuard } from '@shared/guards/authGuard';

export class AdminView {
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
  }

  loadAdminView() {
    const { adminRoutes, adminMenus } = Utils.renderAdminRoutes();
    adminRoutes.subscribe((routes) => {
      const formattedRoutes = Utils.formatAdminRoutes(routes);
      formattedRoutes.forEach((route) => {
        this.app.get(route.to, async (req, reply) => {
          const notProtected = ['/admin/login'];
          const isNotProtected = notProtected.includes(req.routerPath);

          let user;
          if (!isNotProtected) {
            const authUser = await authGuard(req, reply);
            if (!authUser) return reply.redirect('/admin/login');
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
            },
            { layout: isNotProtected ? undefined : '/layouts/dashboard.ejs' },
          );
        });
      });
    });
  }
}
