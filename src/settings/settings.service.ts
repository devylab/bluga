import cache from '@shared/cache';
import { settingsId } from '@shared/constants';
import database from '@shared/database';
import { logger } from '@shared/logger';
import { SettingsEntity } from './entities/settings.entities';
import { cloudinary } from '@shared/cloudinary';

export class SettingsService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async saveSettings(body: SettingsEntity, filePath: string | null) {
    try {
      await cache.remove('settings');
      const data = { name: body.blogName.value?.trim(), description: body.blogDescription.value?.trim(), favicon: '/' };
      if (filePath) {
        const faviconUrl = await cloudinary.uploadImage(filePath, 'favicon.png');
        data.favicon = faviconUrl;
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
