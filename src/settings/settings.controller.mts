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
    // const file = await req.file({ limits: { fileSize: 500000 } });
    // console.log('\n\n FILE', file, '\n\n');
    // console.log('\n\n Body', req.body, '\n\n');
    // TODO: validate file size
    const files = await req.saveRequestFiles();
    const body = req.body as SettingsEntity;
    const filePath = Array.isArray(files) && files.length ? files[0].filepath : null;
    const { error } = await this.settingsService.saveSettings(body, filePath);
    if (error) {
      return reply.redirect(`${subDirectoryPath}admin/settings/general?error=${error}`);
    }

    return reply.redirect(subDirectoryPath + 'admin/settings/general');
  }
}
