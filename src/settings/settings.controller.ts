import { FastifyReply, FastifyRequest } from 'fastify';
import { SettingsEntity } from './entities/settings.entities';
import { SettingsService } from './settings.service';

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
    const body = req.body as SettingsEntity;
    const { error } = await this.settingsService.saveSettings(body);
    if (error) {
      return reply.redirect(`/admin/settings/general?error=${error}`);
    }

    return reply.redirect('/admin/settings/general');
  }
}
