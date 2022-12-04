import { FastifyInstance } from 'fastify';
import { ContentController } from './content.controller';

export class ContentRoute {
  private readonly contentController;
  constructor(private readonly server: FastifyInstance) {
    this.contentController = new ContentController();
  }

  loadRoutes() {
    this.server.post('/api/create-content', (req, reply) => this.contentController.createContent(req, reply));
  }
}
