import cache from '@shared/cache';
import database from '@shared/database';
import { logger } from '@shared/logger';

export class ThemeService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async getThemes() {
    try {
      const data = await this.db.theme.findMany({
        select: { id: true, name: true, status: true, createdAt: true },
      });

      return { data, error: null };
    } catch (err) {
      logger.error(err, 'error while getting themes');
      return { data: null, error: 'error' };
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
}
