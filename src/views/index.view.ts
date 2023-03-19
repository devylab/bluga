import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import minifier from 'html-minifier';
import { env } from '@shared/constants/env';
import { minifierOpts } from '@shared/constants';
import { ContentService } from '../content/content.service';
import { ThemeService } from '../theme/theme.service';
import { SettingsService } from '../settings/settings.service';

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
  private readonly settingsService;

  constructor(private readonly app: FastifyInstance) {
    this.contentService = new ContentService();
    this.themeService = new ThemeService();
    this.settingsService = new SettingsService();

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
        async: true,
      },
    });
  }

  async loadTheme(routeUrl: string, params: unknown) {
    const { data: activeTheme } = await this.themeService.getActiveTheme();
    const { data: settings } = await this.settingsService.getSettings();
    const currentTheme = `/${activeTheme.name || 'bluga'}`;
    const options = {
      themePath: () => path.join('themes', currentTheme),
      app: settings?.name, // TODO: GET PAGE FROM DB
      description: settings?.description,
      currentPage: '',
      service: {
        content: this.contentService,
      },
      params,
    };

    const themeConfigPath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const themeConfig = require(themeConfigPath) as ThemeConfig[];
    const currentPage = themeConfig.find((config) => config.route === routeUrl);

    // TODO: handle not found page
    if (currentPage) {
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
