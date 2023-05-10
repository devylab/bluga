import edjsHTML from 'editorjs-html';
import sanitizeHtml from 'sanitize-html';
import database from '@shared/database';
import { logger } from '@shared/logger';
import { Utils } from '@shared/utils';
import { CreateContent, StatusType } from './entities/create-content.entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customParser(block: any) {
  return `<attaches> ${block.data.text} </attaches>`;
}

export class ContentService {
  private readonly db;
  private edjsParser;

  constructor() {
    this.db = database.instance();
    this.edjsParser = edjsHTML({ custom: customParser });
  }

  // eslint-disable-next-line max-lines-per-function
  async saveContent(
    { rawContent, title, thumbnail, description, ...rest }: CreateContent,
    authorId: string,
    contentID = '',
  ) {
    try {
      let contentTitle = title;
      // TODO: proper validation handler
      if (!title || title.trim() === '') {
        contentTitle = Utils.defaultTitle();
      }

      const html = this.edjsParser.parse(rawContent);
      // const validate = this.edjsParser.validate(rawContent);
      // console.log('\n\n\n validate', validate, '\n\n\n\n');
      // console.log('\n\n\n rawContent', JSON.stringify(rawContent, null, 2), '\n\n\n\n');
      // console.log('\n\n\n HTML', html, '\n\n\n\n');
      const stringHtml = html?.reduce((a: string, b: string) => a + b, '');
      const content = sanitizeHtml(stringHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      const slug = contentTitle.toLowerCase().replaceAll(' ', '-');
      const payload = {
        content,
        rawContent,
        title: contentTitle,
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
        orderBy: { createdAt: 'desc' },
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
          author: {
            select: { username: true },
          },
        },
        where: { status: status || 'PUBLIC' },
        orderBy: { createdAt: 'desc' },
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
        select: {
          content: true,
          title: true,
          createdAt: true,
          author: {
            select: { username: true },
          },
        },
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
      logger.error(err, 'error while updating views');
      return { data: null, error: 'error' };
    }
  }

  async contentAnalytics() {
    try {
      const data = await this.db.$transaction(async (tx) => {
        const totalContents = await tx.content.count();
        const publicContents = await tx.content.count({ where: { status: 'PUBLIC' } });
        const draftContents = await tx.content.count({ where: { status: 'DRAFT' } });
        const highestViews = await tx.contentMeta.findFirst({
          select: { views: true },
          take: 1,
          orderBy: { views: 'desc' },
        });
        return { totalContents, publicContents, draftContents, highestViews: highestViews?.views || 0 };
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while content analytics');
      return { data: null, error: 'error' };
    }
  }

  async mostViewedContents() {
    try {
      const data = await this.db.content.findMany({
        select: {
          slug: true,
          ContentMeta: {
            select: { views: true },
          },
        },
        where: { status: 'PUBLIC' },
        take: 5,
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while most viewed content');
      return { data: null, error: 'error' };
    }
  }

  async removeContents(ids: string[]) {
    try {
      await this.db.content.deleteMany({
        where: { id: { in: ids } },
      });
      return { data: 'removed', error: null };
    } catch (err) {
      logger.error(err, 'error while removing contents');
      return { data: null, error: 'error' };
    }
  }
}
