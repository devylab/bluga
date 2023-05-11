import { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { accessTokenKey, secretTokenKey } from '@shared/constants';
import { env } from '@shared/constants/env';
import { verifyAuthToken } from '@shared/jwt';
import { logger } from '@shared/logger';
import database from '@shared/database';

export const authGuard = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const accessToken = request.cookies[accessTokenKey];
    const secretToken = request.cookies[secretTokenKey];
    if (!accessToken || !secretToken) throw new Error('jwt error');

    const unsignedAccessToken = fastifyCookie.unsign(accessToken, env.cookieSecret);
    const unsignedSecretToken = fastifyCookie.unsign(secretToken, env.cookieSecret);
    const decryptCookie = await verifyAuthToken(unsignedAccessToken.value || '', env.encryptionSecret);
    if (typeof decryptCookie === 'string') throw new Error('jwt error');
    if (unsignedSecretToken.value !== decryptCookie.secret) throw new Error('jwt error');
    const user = await database.instance().user.findUniqueOrThrow({
      select: { id: true, firstName: true, lastName: true, username: true },
      where: { id: decryptCookie.id },
    });

    request.user_id = user.id;
    return user;
  } catch (err) {
    const error = err as Error;
    logger.error(error, error.message);
    if (request.auth_guard_type === 'inner') {
      if (err === 'jwt expired') return err;
      return null;
    }

    return reply.code(401).send({
      code: 401,
      status: 'error',
      data: 'unautorized',
    });
  }
};
