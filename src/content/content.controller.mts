import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { ContentService } from './content.service.mjs';
import { CreateContent, getKeyValue } from './entities/create-content.entity.mjs';
import { SearchContent } from './entities/search-content.entity.mjs';

export class ContentController {
  private readonly contentService;

  constructor() {
    this.contentService = new ContentService();
  }

  async createContent(req: FastifyRequest, reply: FastifyReply) {
    const host = req.hostname;
    const query = req.query as { content: string };
    let body = req.body as CreateContent;
    let file = undefined;

    if (req.isMultipart()) {
      file = await req.file();
      body = file?.fields as unknown as CreateContent;
    }

    const { data, error } = await this.contentService.saveContent(body, req.user_id, query?.content, host, file);
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
      data: {
        title: getKeyValue(body.title),
        status: data?.status,
        to: path.join('/admin/contents/edit/', data.id),
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
    const query = req.query as SearchContent;
    const { data, error } = await this.contentService.getAdminContents(query);
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
    const { data, error } = await this.contentService.getContents();
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

  async removeContents(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as { ids: string[] };
    const { data, error } = await this.contentService.removeContents(body.ids);
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
