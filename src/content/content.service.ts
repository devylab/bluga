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

  async createContent({ rawContent, title, status }: CreateContent) {
    try {
      const html = edjsParser.parse(rawContent);
      const stringHtml = html?.reduce((a: string, b: string) => a + b, '');
      const content = sanitizeHtml(stringHtml);
      const data = await this.db.content.create({
        data: { id: Utils.uniqueId(), content, rawContent, title, status },
        select: { id: true },
      });
      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while creating content');
      return { data: null, error: 'error' };
    }
  }
}
