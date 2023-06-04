import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryService } from './category.service.mjs';
import { CreateCategory } from './entities/create-category.entity.mjs';

export class CategoryController {
  private readonly categoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as CreateCategory;

    const { data, error } = await this.categoryService.createCategory(body);
    if (error || !data) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data,
    });
  }

  async allCategories(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.categoryService.allCategories();
    if (error || !data) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data,
    });
  }

  async removeCategory(req: FastifyRequest, reply: FastifyReply) {
    const params = req.params as { id: string };

    const { data, error } = await this.categoryService.removeCategory(params.id);
    if (error || !data) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data,
    });
  }
}
