import { MultipartFile } from '@fastify/multipart';
import edjsHTML from 'editorjs-html';
import database from '@shared/database/index.mjs';
import { logger } from '@shared/logger/index.mjs';
import { Utils } from '@shared/utils/index.mjs';
import { CreateContent, StatusType, getKeyValue, getStatusValue } from './entities/create-content.entity.mjs';
import parsers from '@shared/editorjs/parsers.mjs';
import { UploadService } from '../upload/upload.service.mjs';

export class ContentService {
  private readonly db;
  private readonly edjsParser;
  private readonly uploadService;

  constructor() {
    this.db = database.instance();
    this.edjsParser = edjsHTML(parsers);
    this.uploadService = new UploadService();
  }

  // eslint-disable-next-line max-lines-per-function
  async saveContent(
    { rawContent, title, description, status, categoryId, tags }: CreateContent,
    authorId: string,
    contentID = '',
    host: string,
    file?: MultipartFile,
  ) {
    try {
      let contentTitle = getKeyValue(title);
      // TODO: proper validation handler
      if (!contentTitle || contentTitle.trim() === '') {
        contentTitle = Utils.defaultTitle();
      }

      const rawData = getKeyValue(rawContent);
      const html = this.edjsParser.parse(JSON.parse(rawData));
      const stringHtml = html?.reduce((a: string, b: string) => a + b, '');
      const content = Utils.htmlSanitizer(stringHtml);
      const slug = contentTitle.toLowerCase().replaceAll(' ', '-');
      const payload = {
        content,
        rawContent: rawData,
        title: contentTitle,
        slug,
        thumbnail: '',
        description: getKeyValue(description) || '',
        status: getStatusValue(status),
        authorId,
        categoryId: getKeyValue(categoryId) || '',
        tags: getKeyValue(tags) || '',
      };

      if (file) {
        const { data: thumbnailUrl, error } = await this.uploadService.uploadContentImage(host, file);
        if (error) return { data: null, error: 'error' };

        payload.thumbnail = thumbnailUrl || '';
      }

      const data = await this.db.$transaction(async (tx) => {
        const contentData = await tx.content.upsert({
          create: { id: Utils.uniqueId(), ...payload },
          update: { ...payload, thumbnail: payload.thumbnail ? payload.thumbnail : undefined },
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
        select: {
          rawContent: true,
          title: true,
          thumbnail: true,
          status: true,
          categoryId: true,
          description: true,
          tags: true,
        },
        where: { id },
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting content by id');
      return { data: null, error: 'error' };
    }
  }

  // eslint-disable-next-line max-lines-per-function
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
          key: 'category',
          value: 'Category',
        },
        {
          key: 'createdAt',
          value: 'CreatedAt',
        },
      ];
      const contents = await this.db.content.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          category: {
            select: { name: true },
          },
        },
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
          thumbnail: true,
          tags: true,
          ContentMeta: {
            select: { views: true, time: true },
          },
          author: {
            select: { username: true },
          },
          category: {
            select: { name: true },
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
          thumbnail: true,
          tags: true,
          author: {
            select: { username: true },
          },
          category: {
            select: { name: true },
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

  async getContentMetaBySlug(slug: string) {
    try {
      const data = await this.db.content.findUniqueOrThrow({
        select: {
          title: true,
          thumbnail: true,
          description: true,
          slug: true,
        },
        where: { slug },
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting content meta by slug');
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
