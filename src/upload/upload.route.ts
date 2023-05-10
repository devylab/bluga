import { FastifyInstance } from 'fastify';
import { UploadController } from './upload.controller';

export class UploadRoute {
  private readonly uploadController;
  constructor(private readonly server: FastifyInstance) {
    this.uploadController = new UploadController();
  }

  loadRoutes() {
    this.server.post('/api/upload/content-image', (req, reply) => this.uploadController.uploadContentImage(req, reply));
    this.server.post('/api/upload/content-file', (req, reply) => this.uploadController.uploadContentFile(req, reply));
  }
}
