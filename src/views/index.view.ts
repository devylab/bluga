import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import EJS from 'ejs';
import minifier from 'html-minifier';
import { env } from '@shared/constants/env';
import { minifierOpts } from '@shared/constants';
import { ContentService } from '../content/content.service';
import { ThemeService } from 'src/theme/theme.service';

type ThemeConfig = {
  route: string;
  path: string;
  queries: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: (self: unknown) => any;
  }[];
};

const rootPath = path.join(__dirname, '..', 'tools');

export class IndexView {
  private readonly contentService;
  private readonly themeService;

  constructor(private readonly app: FastifyInstance) {
    this.contentService = new ContentService();
    this.themeService = new ThemeService();

    this.app.register(fastifyStatic, {
      root: rootPath,
    });
    this.app.register(fastifyView, {
      engine: { ejs: EJS },
      root: path.join(rootPath, 'themes'),
      propertyName: 'themes',
      viewExt: 'ejs',
      production: env.environment.isProduction,
      options: {
        useHtmlMinifier: minifier,
        htmlMinifierOptions: minifierOpts,
      },
    });
  }

  async loadTheme(routeUrl: string, params: unknown) {
    const { data: activeTheme } = await this.themeService.getActiveTheme();
    const currentTheme = `/${activeTheme.name || 'bluga'}`;
    const options = {
      themePath: () => path.join('themes', currentTheme),
      page: 'Cavdy', // TODO: GET PAGE FROM DB
      app: 'Cavdy',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as { [name: string]: any };

    const themeConfigPath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    const themeConfig = eval(fs.readFileSync(themeConfigPath, 'utf-8')) as ThemeConfig[];
    const currentPage = themeConfig.find((config) => config.route === routeUrl);

    // TODO: handle not found page
    if (currentPage) {
      for (const query of currentPage.queries) {
        const queryOptions = { content: this.contentService, params };
        const { data } = await query.query(queryOptions);
        options[query.name] = data || {};
      }
      const pageTitle = options?.content?.title ? options?.content?.title + ' - ' : '';
      options.page = pageTitle + options.app;
      return { page: currentTheme + currentPage.path, options };
    }
  }

  // eslint-disable-next-line max-lines-per-function
  async loadIndexView() {
    this.app.get('/', async (req, reply) => {
      const currentTheme = await this.loadTheme(req.url, req.params);

      // TODO: handle not found page
      if (currentTheme) return reply.themes(currentTheme.page, currentTheme.options);

      return reply.send({ not: 'found' });
    });

    this.app.get('/:slug', async (req, reply) => {
      const currentTheme = await this.loadTheme('/:slug', req.params);

      // TODO: handle not found page
      if (currentTheme) return reply.themes(currentTheme.page, currentTheme.options);

      return reply.send({ not: 'found' });
    });

    this.app.get('/robots.txt', async (_req, reply) => {
      return reply.sendFile('/robots.txt');
    });
  }
}
