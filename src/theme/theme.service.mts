import fs from 'fs';
import { MultipartFile } from '@fastify/multipart';
import cache from '../shared/cache/index.mjs';
import database from '../shared/database/index.mjs';
import { logger } from '../shared/logger/index.mjs';
import { Utils } from '../shared/utils/index.mjs';
import path from 'path';
import { hostProtocol } from '../shared/constants/index.mjs';

export class ThemeService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async getThemes() {
    try {
      const themes = await this.db.theme.findMany({
        select: { id: true, name: true, status: true, createdAt: true, meta: true },
        orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
      });

      const { __dirname } = Utils.fileDirPath(import.meta);
      const data = themes.map((theme) => {
        const uploadPath = path.join(__dirname, '..', 'tools', 'themes', theme.id);
        return { ...theme, exist: fs.existsSync(uploadPath) };
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

  async uploadTheme(host: string, file?: MultipartFile) {
    const themeId = Utils.uniqueId(15);
    const { __dirname } = Utils.fileDirPath(import.meta);
    const uploadPath = path.join(__dirname, '..', 'tools', 'themes', themeId);
    try {
      if (file?.filename && file.filename.endsWith('.zip') && file.mimetype === 'application/zip') {
        const bufferFile = await file.toBuffer();
        const theme = await Utils.unZipFile(bufferFile, uploadPath);

        const previewUrl = hostProtocol + path.join(host, '/', 'themes', themeId, theme.preview);
        await this.db.theme.create({
          data: {
            id: themeId,
            name: theme.name,
            status: false,
            meta: { version: theme.version, url: theme.url, creator: theme.creator, preview: previewUrl },
          },
        });

        return { data: 'theme uploaded', error: null };
      }
      return { data: null, error: 'unable to upload theme' };
    } catch (err) {
      const error = err as Error;
      if (error?.message?.includes('Unique constraint')) {
        Utils.removeDirectory(uploadPath);
        return { data: null, error: 'theme with same name already exist' };
      }

      logger.error(err, 'error while uploading theme theme');
      return { data: null, error: 'unable to upload theme' };
    }
  }

  async removeTheme(id: string) {
    try {
      const theme = await this.db.theme.findUniqueOrThrow({
        where: { id },
        select: { id: true, status: true },
      });

      if (theme.status) throw new Error('can not remove active template');

      const { __dirname } = Utils.fileDirPath(import.meta);
      const uploadPath = path.join(__dirname, '..', 'tools', 'themes', theme.id);

      await this.db.theme.delete({ where: { id } });
      Utils.removeDirectory(uploadPath);

      return { data: 'theme removed', error: null };
    } catch (err) {
      logger.error(err, 'error while removing theme');
      return { data: null, error: 'error' };
    }
  }
}
