import database from '../shared/database/index.mjs';
import { logger } from '../shared/logger/index.mjs';
import { CreateCategory } from './entities/create-category.entity.mjs';
import { Utils } from '../shared/utils/index.mjs';

export class CategoryService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async createCategory(body: CreateCategory) {
    try {
      await this.db.category.upsert({
        where: { id: body.id },
        create: { id: Utils.uniqueId(), name: body.name },
        update: body,
      });
      return { data: body, error: null };
    } catch (err) {
      logger.error(err, 'error while creating category');
      return { data: null, error: 'error' };
    }
  }

  async allCategories() {
    try {
      const categories = await this.db.category.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { name: 'asc' },
      });
      return { data: categories, error: null };
    } catch (err) {
      logger.error(err, 'error while getting categories');
      return { data: [], error: 'error' };
    }
  }

  async removeCategory(id: string) {
    try {
      await this.db.category.delete({
        where: { id },
      });
      return { data: 'removed', error: null };
    } catch (err) {
      const error = err as Error;
      if (error?.message?.includes('Content_categoryId_fkey')) {
        return { data: null, error: 'Category has contents' };
      }

      logger.error(err, 'error while removing categories');
      return { data: null, error: 'error' };
    }
  }
}
