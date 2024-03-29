import { authGuard } from '../shared/guards/authGuard.mjs';
import { FastifyInstance } from 'fastify';
import { ContentController } from './content.controller.mjs';

export class ContentRoute {
  private readonly contentController;
  constructor(private readonly server: FastifyInstance) {
    this.contentController = new ContentController();
  }

  loadRoutes() {
    this.server.post('/api/content/save-content', { preHandler: [authGuard] }, (req, reply) =>
      this.contentController.createContent(req, reply),
    );
    this.server.get('/api/content/:id', { preHandler: [authGuard] }, (req, reply) =>
      this.contentController.getContentById(req, reply),
    );
    this.server.get('/api/contents', { preHandler: [authGuard] }, (req, reply) =>
      this.contentController.getAdminContents(req, reply),
    );
    this.server.post('/api/content/remove-content', { preHandler: [authGuard] }, (req, reply) =>
      this.contentController.removeContents(req, reply),
    );
  }
}
