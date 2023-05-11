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
}
