import { subDirectoryPath } from '@shared/constants/index.mjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SettingsEntity } from './entities/settings.entities.mjs';
import { SettingsService } from './settings.service.mjs';

export class SettingsController {
  private readonly settingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  async saveSettings(req: FastifyRequest, reply: FastifyReply) {
    const host = `${req.hostname}${subDirectoryPath}`;
    // TODO: File size validation
    const file = await req.file();
    const body = file?.fields as unknown as SettingsEntity;
    const { error } = await this.settingsService.saveSettings(body, host, file);
    if (error) {
      return reply.redirect(`${subDirectoryPath}admin/settings/general?error=${error}`);
    }

    return reply.redirect(subDirectoryPath + 'admin/settings/general');
  }
}
