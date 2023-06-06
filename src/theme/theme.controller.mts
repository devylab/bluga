import { subDirectoryPath } from '../shared/constants/index.mjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ThemeService } from './theme.service.mjs';

export class ThemeController {
  private readonly themeService;

  constructor() {
    this.themeService = new ThemeService();
  }

  async getThemes(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.themeService.getThemes();
    if (error) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data,
    });
  }

  async getActiveTheme(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.themeService.getActiveTheme();
    if (error) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(200).send({
      status: 'success',
      code: 200,
      data,
    });
  }

  async setActive(req: FastifyRequest, reply: FastifyReply, app: FastifyInstance) {
    const body = req.body as { theme: string };

    const { error } = await this.themeService.setActive(body.theme);
    if (error) {
      return reply.redirect(`${subDirectoryPath}admin/themes?error=${error}`);
    }

    app.restart();
    return reply.redirect(subDirectoryPath + 'admin/themes');
  }

  async uploadTheme(req: FastifyRequest, reply: FastifyReply) {
    const host = `${req.hostname}${subDirectoryPath}`;
    const file = await req.file();

    const { data, error } = await this.themeService.uploadTheme(host, file);
    if (error) {
      req.session.set('theme', { type: 'error', message: error });
      return reply.redirect(`${subDirectoryPath}admin/themes/upload`);
    }

    req.session.set('theme', { type: 'success', message: data });
    return reply.redirect(`${subDirectoryPath}admin/themes/upload`);
  }

  async removeTheme(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as { theme: string };

    const { error } = await this.themeService.removeTheme(body.theme);
    if (error) {
      return reply.redirect(`${subDirectoryPath}admin/themes?error=${error}`);
    }

    return reply.redirect(subDirectoryPath + 'admin/themes');
  }
}
