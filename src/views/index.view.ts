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

  constructor(private readonly app: FastifyInstance) {
    this.contentService = new ContentService();

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

  loadIndexView() {
    const currentTheme = '/bluga'; // TODO: GET THEME FROM DB
    const themeConfigPath = path.join(rootPath, 'themes', currentTheme, 'config.js');
    const themeConfig = eval(fs.readFileSync(themeConfigPath, 'utf-8')) as ThemeConfig[];
    for (const current of themeConfig) {
      this.app.get(current.route, async (req, reply) => {
        const options = {
          themePath: () => `/themes/${currentTheme}`,
          page: 'Cavdy', // TODO: GET PAGE FROM DB
          app: 'Cavdy',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as { [name: string]: any };

        // TODO: handle not found page
        for (const query of current.queries) {
          const queryOptions = { content: this.contentService, params: req.params };
          const { data } = await query.query(queryOptions);
          options[query.name] = data || {};
        }

        const pageTitle = options?.content?.title ? options?.content?.title + ' - ' : '';
        options.page = pageTitle + options.app;
        return reply.themes(currentTheme + current.path, options);
      });
    }

    this.app.get('/robots.txt', async (_req, reply) => {
      return reply.sendFile('/robots.txt');
    });
  }
}
