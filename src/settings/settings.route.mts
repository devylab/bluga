import { authGuard } from '../shared/guards/authGuard.mjs';
import { FastifyInstance } from 'fastify';
import { SettingsController } from './settings.controller.mjs';

export class SettingsRoute {
  private readonly settingsController;
  constructor(private readonly server: FastifyInstance) {
    this.settingsController = new SettingsController();
  }

  loadRoutes() {
    this.server.post('/api/settings', { preHandler: [authGuard] }, (req, reply) =>
      this.settingsController.saveSettings(req, reply),
    );
  }
}
