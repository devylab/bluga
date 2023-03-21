import edjsHTML from 'editorjs-html';
import sanitizeHtml from 'sanitize-html';
import database from '@shared/database';
import { logger } from '@shared/logger';
import { Utils } from '@shared/utils';
import { CreateContent, StatusType } from './entities/create-content.entity';

export class ContentService {
  private readonly db;
  private edjsParser;

  constructor() {
    this.db = database.instance();
    this.edjsParser = edjsHTML();
  }

  // eslint-disable-next-line max-lines-per-function
  async saveContent(
    { rawContent, title, thumbnail, description, ...rest }: CreateContent,
    authorId: string,
    contentID = '',
  ) {
    try {
      // TODO: proper validation handler
      if (!title || title.trim() === '') {
        return { data: null, error: 'error' };
      }

      const html = this.edjsParser.parse(rawContent);
      const stringHtml = html?.reduce((a: string, b: string) => a + b, '');
      const content = sanitizeHtml(stringHtml);
      const slug = title.toLowerCase().replaceAll(' ', '-');
      const payload = {
        content,
        rawContent,
        title,
        slug,
        thumbnail: thumbnail || '',
        description: description || '',
        ...rest,
        authorId,
      };
      const data = await this.db.$transaction(async (tx) => {
        const contentData = await tx.content.upsert({
          create: { id: Utils.uniqueId(), ...payload },
          update: { ...payload },
          select: { id: true, status: true },
          where: { id: contentID },
        });
        await tx.contentMeta.upsert({
          create: {
            id: Utils.uniqueId(),
            contentId: contentData.id,
            time: Utils.readingTime(payload.content),
            views: 0,
          },
          update: { time: Utils.readingTime(payload.content) },
          where: { contentId: contentData.id },
        });
        return contentData;
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while creating content');
      return { data: null, error: 'error' };
    }
  }

  async getContentById(id: string) {
    try {
      const data = await this.db.content.findUnique({
        select: { rawContent: true, title: true },
        where: { id },
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting content by id');
      return { data: null, error: 'error' };
    }
  }

  async getAdminContents() {
    try {
      const headings = [
        {
          key: 'title',
          value: 'Title',
        },
        {
          key: 'status',
          value: 'Status',
        },
        {
          key: 'createdAt',
          value: 'CreatedAt',
        },
      ];
      const contents = await this.db.content.findMany({
        select: { id: true, title: true, status: true, createdAt: true },
      });
      return { data: { contents, headings }, error: null };
    } catch (err) {
      logger.error(err, 'error while getting contents');
      return { data: { contents: [], headings: [] }, error: 'error' };
    }
  }

  async getContents(status?: StatusType) {
    try {
      const contents = await this.db.content.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          slug: true,
          ContentMeta: {
            select: { views: true, time: true },
          },
        },
        where: { status: status || 'PUBLIC' },
      });
      return { data: contents, error: null };
    } catch (err) {
      logger.error(err, 'error while getting contents');
      return { data: [], error: 'error' };
    }
  }

  async getContentBySlug(slug: string) {
    try {
      const data = await this.db.content.findUnique({
        select: { content: true, title: true, createdAt: true },
        where: { slug },
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting content by slug');
      return { data: null, error: 'error' };
    }
  }

  async updateContentViews(slug: string) {
    try {
      await this.db.$transaction(async (tx) => {
        const content = await tx.content.findUniqueOrThrow({
          select: { id: true },
          where: { slug },
        });
        await tx.$queryRaw`UPDATE "ContentMeta" SET views = views + 1 WHERE "contentId" = ${content.id};`;
      });
      return { data: 'updated views', error: null };
    } catch (err) {
      logger.error(err, 'error while getting content by slug');
      return { data: null, error: 'error' };
    }
  }
}
