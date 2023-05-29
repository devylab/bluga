import { MultipartFile } from '@fastify/multipart';
import cache from '../shared/cache/index.mjs';
import database from '../shared/database/index.mjs';
import { logger } from '../shared/logger/index.mjs';
import { Utils } from '../shared/utils/index.mjs';
import path from 'path';

export class ThemeService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async getThemes() {
    try {
      const data = await this.db.theme.findMany({
        select: { id: true, name: true, status: true, createdAt: true },
        orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
      });

      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting themes');
      return { data: [], error: 'error' };
    }
  }

  async getActiveTheme() {
    try {
      const cacheTheme = await cache.get('active-theme');
      if (cacheTheme) {
        return { data: JSON.parse(cacheTheme), error: null };
      }

      const data = await this.db.theme.findFirst({
        where: { status: true },
        select: { id: true, name: true },
      });
      await cache.set('active-theme', JSON.stringify(data));

      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting active theme');
      return { data: null, error: 'error' };
    }
  }

  async setActive(id: string) {
    try {
      await this.db.$transaction(async (tx) => {
        await tx.theme.updateMany({ where: { status: true }, data: { status: false } });
        await tx.theme.update({ where: { id }, data: { status: true } });
      });

      await cache.remove('active-theme');
      return { data: 'updated', error: null };
    } catch (err) {
      logger.error(err, 'error while setting active theme');
      return { data: null, error: 'error' };
    }
  }

  async uploadTheme(file?: MultipartFile) {
    try {
      if (file?.filename && file.filename.endsWith('.zip') && file.mimetype === 'application/zip') {
        const bufferFile = await file.toBuffer();
        const { __dirname } = Utils.fileDirPath(import.meta);
        const uploadPath = path.join(__dirname, '..', 'tools', 'themes', file.filename.replace('.zip', ''));
        const theme = await Utils.unZipFile(bufferFile, uploadPath);

        await this.db.theme.create({
          data: {
            id: Utils.uniqueId(10),
            name: theme.name,
            status: false,
            meta: {
              version: theme.version,
              url: theme.url,
              creator: theme.creator,
              preview: theme.preview,
            },
          },
        });

        return { data: 'theme uploaded', error: null };
      }
      return { data: null, error: 'unable to upload theme' };
    } catch (err) {
      const error = err as Error;
      if (error?.message?.includes('Unique constraint')) {
        return { data: null, error: 'theme with same name already exist' };
      }

      logger.error(err, 'error while uploading theme theme');
      return { data: null, error: 'unable to upload theme' };
    }
  }
}
