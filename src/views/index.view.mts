import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import minifier from 'html-minifier';
import { env } from '../shared/constants/env.mjs';
import { subDirectoryPath, minifierOpts, hostProtocol } from '../shared/constants/index.mjs';
import { ContentService } from '../content/content.service.mjs';
import { ThemeService } from '../theme/theme.service.mjs';
import { SettingsService } from '../settings/settings.service.mjs';
import { Utils } from '../shared/utils/index.mjs';
import { ThemeConfig } from '../shared/interfaces/themeConfig.interface.mjs';

type MetaData = {
  page: string;
  slug: string;
  sitename: string;
  description: string;
  title: string;
  image: string;
  url: string;
  currentPageTitle: string;
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

  async getMeta({ page, slug, ...rest }: MetaData) {
    let metadata = { ...rest };
    let error = null;
    if (page === '/:slug') {
      const { data, error: dataError } = await this.contentService.getContentMetaBySlug(slug);
      if (dataError) error = dataError;
      if (data) {
        metadata = {
          ...metadata,
          description: data.description,
          title: data.title,
          url: metadata.url + data.slug,
          image: data.thumbnail,
          currentPageTitle: `${data.title} - ${metadata.sitename}`,
        };
      }
    }

    return { metadata, error };
  }

  // eslint-disable-next-line max-lines-per-function
  async loadIndexView() {
    const { data: activeTheme } = await this.themeService.getActiveTheme();
    const currentTheme = `/${activeTheme?.name || 'avail'}`;
    const themePath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    let importConfig;
    try {
      importConfig = await import(themePath);
    } catch (err) {
      importConfig = await import(path.join(rootPath, 'themes', 'avail', 'config.js'));
    }

    const themeConfig = importConfig?.default as ThemeConfig;

    this.app.get('/favicon.ico', async (_req, reply) => reply.code(204).send());
    this.app.get('/robots.txt', async (_req, reply) => reply.sendFile('/robots.txt'));

    for (const route of themeConfig.routes) {
      // eslint-disable-next-line max-lines-per-function
      this.app.get(route.route, async (req, reply) => {
        const { data: settings } = await this.settingsService.getSettings();
        const params = req.params as { slug: string };
        const schema = `${req.hostname}${subDirectoryPath}`;
        const headers = themeConfig?.headers?.concat(route?.headers);
        const footers = themeConfig?.footers?.concat(route?.footers);
        const { metadata, error: metaError } = await this.getMeta({
          page: route.route,
          slug: params?.slug,
          sitename: settings?.name,
          description: settings?.description,
          title: settings?.name,
          image: settings?.favicon,
          url: hostProtocol + schema,
          currentPageTitle: settings?.name,
        });
        const options = {
          themePath: () => hostProtocol + path.join(schema, '/', 'themes', currentTheme),
          app: settings?.name, // TODO: GET PAGE FROM DB
          appLink: hostProtocol + schema,
          appFavicon: settings?.favicon,
          service: { content: this.contentService },
          params,
          headers,
          footers,
          meta: metadata,
        };

        const page = currentTheme + '/pages/' + route.path;
        if (metaError) {
          return reply.themes(currentTheme + '/pages/404.ejs', options, {
            layout: '/themeConfig/layout.ejs',
          });
        }

        return reply.themes(page, options, {
          layout: '/themeConfig/layout.ejs',
        });
      });
    }
  }
}
