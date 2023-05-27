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
      await this.db.category.create({
        data: { id: Utils.uniqueId(), name: body.name },
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
        select: { id: true, name: true },
      });
      return { data: categories, error: null };
    } catch (err) {
      logger.error(err, 'error while getting categories');
      return { data: null, error: 'error' };
    }
  }
}
