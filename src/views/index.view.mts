import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import minifier from 'html-minifier';
import { env } from '@shared/constants/env.mjs';
import { subDirectoryPath, minifierOpts, hostProtocol } from '@shared/constants/index.mjs';
import { ContentService } from '../content/content.service.mjs';
import { ThemeService } from '../theme/theme.service.mjs';
import { SettingsService } from '../settings/settings.service.mjs';
import { Utils } from '@shared/utils/index.mjs';

type ThemeConfig = {
  headers: string[];
  footers: string[];
  routes: { route: string; path: string; headers: string[]; footers: string[] }[];
};

const { __dirname } = Utils.fileDirPath(import.meta);
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

  // eslint-disable-next-line max-lines-per-function
  async loadIndexView() {
    const { data: activeTheme } = await this.themeService.getActiveTheme();
    const { data: settings } = await this.settingsService.getSettings();
    const currentTheme = `/${activeTheme.name || 'bluga'}`;
    const themePath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    const require = Utils.fileRequire();
    const themeConfig = require(themePath) as ThemeConfig;

    this.app.get('/favicon.ico', async (_req, reply) => reply.code(204).send());
    this.app.get('/robots.txt', async (_req, reply) => reply.sendFile('/robots.txt'));

    for (const route of themeConfig.routes) {
      this.app.get(route.route, async (req, reply) => {
        const schema = `${req.hostname}${subDirectoryPath}`;
        const headers = themeConfig.headers.concat(route.headers);
        const footers = themeConfig.footers.concat(route.footers);
        const options = {
          themePath: () => hostProtocol + path.join(schema, '/', 'themes', currentTheme),
          app: settings?.name, // TODO: GET PAGE FROM DB
          description: settings?.description,
          appLink: hostProtocol + schema,
          appFavicon: settings?.favicon,
          currentPage: '',
          service: {
            content: this.contentService,
          },
          params: req.params,
          headers,
          footers,
        };

        const page = currentTheme + '/pages/' + route.path;
        return reply.themes(page, options, {
          layout: '/themeConfig/layout.ejs',
        });
      });
    }
  }
}
