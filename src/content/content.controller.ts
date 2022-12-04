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

    const { data, error } = await this.contentService.createContent(body);
    if (error) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(201).send({
      status: 'success',
      code: 201,
      data: {
        title: body.title,
        status: body.status,
        to: `/admin/contents/edit/${data?.id}`,
      },
    });
  }
}
