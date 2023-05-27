import cache from '../shared/cache/index.mjs';
import { settingsId } from '../shared/constants/index.mjs';
import database from '../shared/database/index.mjs';
import { logger } from '../shared/logger/index.mjs';
import { SettingsEntity } from './entities/settings.entities.mjs';
import { MultipartFile } from '@fastify/multipart';
import { UploadService } from '../upload/upload.service.mjs';

export class SettingsService {
  private readonly db;
  private readonly uploadService;

  constructor() {
    this.db = database.instance();
    this.uploadService = new UploadService();
  }

  async saveSettings(body: SettingsEntity, host: string, file?: MultipartFile) {
    try {
      await cache.remove('settings');
      const data = {
        name: body.blogName.value?.trim(),
        description: body.blogDescription.value?.trim(),
      } as { name: string; description: string; favicon: string };

      if (file?.filename) {
        const { data: faviconUrl, error } = await this.uploadService.uploadContentImage(host, file);
        if (error) throw error;

        data.favicon = faviconUrl || '';
      }

      await this.db.setting.upsert({
        where: { id: settingsId },
        create: { id: settingsId, ...data },
        update: data,
      });
      return { data: 'settings saved', error: null };
    } catch (err) {
      logger.error(err, 'error while saving settings');
      return { data: null, error: 'error' };
    }
  }

  async getSettings() {
    try {
      const cacheSettings = await cache.get('settings');
      if (cacheSettings) {
        return { data: JSON.parse(cacheSettings), error: null };
      }

      const settings = await this.db.setting.findUnique({
        where: { id: settingsId },
        select: { name: true, description: true, favicon: true },
      });
      await cache.set('settings', JSON.stringify(settings));

      return { data: settings, error: null };
    } catch (err) {
      logger.error(err, 'error while getting settings');
      return { data: null, error: 'error' };
    }
  }
}
