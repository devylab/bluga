import { authGuard } from '../shared/guards/authGuard.mjs';
import { FastifyInstance } from 'fastify';
import { CategoryController } from './category.controller.mjs';

export class CategoryRoute {
  private readonly categoryController;
  constructor(private readonly server: FastifyInstance) {
    this.categoryController = new CategoryController();
  }

  loadRoutes() {
    this.server.post('/api/category', { preHandler: [authGuard] }, (req, reply) =>
      this.categoryController.createCategory(req, reply),
    );
    this.server.get('/api/categories', { preHandler: [authGuard] }, (req, reply) =>
      this.categoryController.allCategories(req, reply),
    );
    this.server.delete('/api/category/:id', { preHandler: [authGuard] }, (req, reply) =>
      this.categoryController.removeCategory(req, reply),
    );
  }
}
