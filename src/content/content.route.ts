import { FastifyInstance } from 'fastify';
import { ContentController } from './content.controller';

export class ContentRoute {
  private readonly contentController;
  constructor(private readonly server: FastifyInstance) {
    this.contentController = new ContentController();
  }

  loadRoutes() {
    this.server.post('/api/save-content', (req, reply) => this.contentController.createContent(req, reply));
    this.server.get('/api/content/:id', (req, reply) => this.contentController.getContentById(req, reply));
    this.server.get('/api/contents', (req, reply) => this.contentController.getAdminContents(req, reply));
  }
}
