import { accessTokenKey, refreshTokenKey, secretTokenKey } from '../shared/constants/index.mjs';
import { env } from '../shared/constants/env.mjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUser } from './entities/create-user.entity.mjs';
import { UserService } from './user.service.mjs';
import fastifyCookie from '@fastify/cookie';
import { EditUser } from './entities/edit-user.entity.mjs';

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

  async refreshToken(req: FastifyRequest, reply: FastifyReply) {
    const refreshToken = req.cookies[refreshTokenKey] || '';
    const secretToken = req.cookies[secretTokenKey] || '';
    const secret = reply.generateCsrf();
    const unsignedRefreshToken = fastifyCookie.unsign(refreshToken, env.cookieSecret).value || '';
    const unsignedSecretToken = fastifyCookie.unsign(secretToken, env.cookieSecret).value || '';

    const { data, error } = await this.userService.refreshToken(secret, unsignedSecretToken, unsignedRefreshToken);
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
      .send({ status: 'success', code: 200, data: 'token refreshed' });
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    req.session.delete();
    reply
      .clearCookie(accessTokenKey, { path: '/' })
      .clearCookie(secretTokenKey, { path: '/' })
      .clearCookie(refreshTokenKey, { path: '/' })
      .send({ logout: true });
  }

  async editProfile(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as EditUser;

    console.log('\n\n\n\n\n REQUEST ORIGIN', req.headers.origin);

    const { error } = await this.userService.editProfile(req.user_id, body);
    if (error) {
      return reply.redirect(`/admin/profile?error=${error}`);
    }

    return reply.redirect('/admin/profile');
  }

  async getUserById(req: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await this.userService.getUserById(req.user_id);

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
}
