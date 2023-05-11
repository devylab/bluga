import { authGuard } from '@shared/guards/authGuard';
import { FastifyInstance } from 'fastify';
import { ThemeController } from './theme.controller';

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
  }
}
