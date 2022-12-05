import edjsHTML from 'editorjs-html';
import sanitizeHtml from 'sanitize-html';
import database from '@shared/database';
import { logger } from '@shared/logger';
import { Utils } from '@shared/utils';
import { CreateContent } from './entities/create-content.entity';

const edjsParser = edjsHTML();

export class ContentService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async saveContent({ rawContent, title, status }: CreateContent, contentID = '') {
    try {
      const html = edjsParser.parse(rawContent);
      const stringHtml = html?.reduce((a: string, b: string) => a + b, '');
      const content = sanitizeHtml(stringHtml);
      const data = await this.db.content.upsert({
        create: { id: Utils.uniqueId(), content, rawContent, title, status },
        update: { content, rawContent, title, status },
        select: { id: true },
        where: { id: contentID },
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
      logger.error(err, 'error while creating content');
      return { data: null, error: 'error' };
    }
  }
}
