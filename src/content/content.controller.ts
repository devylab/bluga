import { FastifyReply, FastifyRequest } from 'fastify';
import { ContentService } from './content.service';
import { CreateContent } from './entities/create-content.entity';

export class ContentController {
  private readonly contentService;

  constructor() {
    this.contentService = new ContentService();
  }

  async createContent(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as CreateContent;
    const query = req.query as { content: string };

    const { data, error } = await this.contentService.saveContent(body, query?.content);
    if (error) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data: {
        title: body.title,
        status: data?.status,
        to: `/admin/contents/edit/${data?.id}`,
      },
    });
  }

  async getContentById(req: FastifyRequest, reply: FastifyReply) {
    const params = req.params as { id: string };

    const { data, error } = await this.contentService.getContentById(params.id);
    if (error) {
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

  async getAdminContents(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.contentService.getAdminContents();
    if (error) {
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

  async getContents(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.contentService.getContents('PUBLIC');
    if (error) {
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
