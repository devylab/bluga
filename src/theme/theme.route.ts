import { authGuard } from '@shared/guards/authGuard';
import { FastifyInstance } from 'fastify';
import { ThemeController } from './theme.controller';

export class ThemeRoute {
  private readonly themeController;
  constructor(private readonly server: FastifyInstance) {
    this.themeController = new ThemeController();
  }

  loadRoutes() {
    this.server.post('/api/themes', { preHandler: [authGuard] }, (req, reply) =>
      this.themeController.getThemes(req, reply),
    );
  }
}
