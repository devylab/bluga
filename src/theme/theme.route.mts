import { authGuard } from '../shared/guards/authGuard.mjs';
import { FastifyInstance } from 'fastify';
import { ThemeController } from './theme.controller.mjs';

export class ThemeRoute {
  private readonly themeController;
  constructor(private readonly server: FastifyInstance) {
    this.themeController = new ThemeController();
  }

  loadRoutes() {
    this.server.get('/api/themes', { preHandler: [authGuard] }, (req, reply) =>
      this.themeController.getThemes(req, reply),
    );
    this.server.post('/api/theme/active', { preHandler: [authGuard] }, (req, reply) =>
      this.themeController.setActive(req, reply),
    );
    this.server.post('/api/theme/upload', { preHandler: [authGuard] }, (req, reply) =>
      this.themeController.uploadTheme(req, reply),
    );
    this.server.post('/api/theme/remove', { preHandler: [authGuard] }, (req, reply) =>
      this.themeController.removeTheme(req, reply),
    );
  }
}
