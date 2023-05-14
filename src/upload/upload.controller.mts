import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from './upload.service.mjs';
import { subDirectoryPath } from '@shared/constants/index.mjs';

export class UploadController {
  private readonly uploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  async uploadContentImage(req: FastifyRequest, reply: FastifyReply) {
    const host = `${req.hostname}${subDirectoryPath}`;
    const file = await req.file();

    const { data, error } = await this.uploadService.uploadContentImage(host, file);
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
      data: null,
      success: 1,
      file: {
        url: data,
      },
    });
  }

  async uploadContentFile(req: FastifyRequest, reply: FastifyReply) {
    const host = `${req.hostname}${subDirectoryPath}`;
    const file = await req.file();

    const { data, error } = await this.uploadService.uploadContentFile(host, file);
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
      data: null,
      success: 1,
      file: {
        url: data,
      },
    });
  }
}
