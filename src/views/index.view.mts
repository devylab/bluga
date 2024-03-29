import { FastifyInstance } from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import path from 'path';
import EJS from 'ejs';
import minifier from 'html-minifier';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { env } from '../shared/constants/env.mjs';
import { minifierOpts, hostProtocol } from '../shared/constants/index.mjs';
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
  private sitemap: Buffer | undefined;
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
    let currentTheme = `/${activeTheme?.id || 'avail'}`;
    const themePath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    const isThemeExist = Utils.isFileExist(themePath);
    currentTheme = !isThemeExist ? '/avail' : currentTheme;
    const importConfig = isThemeExist
      ? await import(themePath)
      : await import(path.join(rootPath, 'themes', 'avail', 'config.js'));

    const themeConfig = importConfig?.default as ThemeConfig;

    this.app.get('/favicon.ico', async (_req, reply) => reply.code(204).send());
    this.app.get('/robots.txt', async (_req, reply) => reply.sendFile('/robots.txt'));
    this.app.get('/sitemap.xml', async (req, reply) => {
      const replyHead = reply.headers({ 'Content-Encoding': 'gzip', 'Content-Type': 'application/xml' });
      if (this.sitemap) {
        return replyHead.send(this.sitemap);
      }

      const { data } = await this.contentService.getContentSitemap();
      const smStream = new SitemapStream({ hostname: hostProtocol + req.hostname });
      const pipeline = smStream.pipe(createGzip());
      smStream.write({ url: '/', changefreq: 'weekly', priority: 0.6 });
      data.forEach((content) => {
        smStream.write({ url: `/${content.slug}`, changefreq: 'daily', priority: 0.8 });
      });

      streamToPromise(pipeline).then((sm) => (this.sitemap = sm));
      smStream.end();

      reply.raw.writeHead(200, { 'Content-Encoding': 'gzip', 'Content-Type': 'application/xml' });
      pipeline.pipe(reply.raw).on('error', (e: Error) => {
        throw e; // TODO: handle this
      });
    });

    for (const route of themeConfig.routes) {
      // eslint-disable-next-line max-lines-per-function
      this.app.get(route.route, async (req, reply) => {
        const { data: settings } = await this.settingsService.getSettings();
        const params = req.params as { slug: string };
        const schema = req.hostname;
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
        const layout = '../../views/themeConfig/layout.ejs';
        if (metaError) {
          return reply.themes(currentTheme + '/pages/404.ejs', options, { layout });
        }

        return reply.themes(page, options, { layout });
      });
    }
  }
}
