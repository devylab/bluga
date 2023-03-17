import { accessTokenKey, refreshTokenKey, secretTokenKey } from '@shared/constants';
import { env } from '@shared/constants/env';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUser } from './entities/create-user.entity';
import { UserService } from './user.service';

export class UserController {
  private readonly userService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as CreateUser;

    const { data, error } = await this.userService.createUser(body);
    if (error) {
      return reply.code(400).send({
        status: 'error',
        code: 400,
        error,
      });
    }

    return reply.code(201).send({
      status: 'success',
      code: 201,
      data,
    });
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as CreateUser;
    const secret = reply.generateCsrf();

    const { data, error } = await this.userService.login(body, secret);
    if (error) {
      return reply.redirect(`/admin/login?error=${error}`);
    }

    const options = {
      path: '/',
      signed: true,
      httpOnly: true,
      secure: env.environment.isProduction,
      sameSite: true,
    };
    reply
      .setCookie(accessTokenKey, data.accessToken, options)
      .cookie(secretTokenKey, data.secret, options)
      .setCookie(refreshTokenKey, data.refreshToken, options)
      .redirect('/admin');
  }
}
