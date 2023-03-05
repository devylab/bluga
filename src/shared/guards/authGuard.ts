import { FastifyRequest } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { accessTokenKey, secretTokenKey } from '@shared/constants';
import { env } from '@shared/constants/env';
import { verifyAuthToken } from '@shared/jwt';
import { logger } from '@shared/logger';

export const authGuard = async (request: FastifyRequest) => {
  try {
    const accessToken = request.cookies[accessTokenKey];
    const secretToken = request.cookies[secretTokenKey];
    if (!accessToken || !secretToken) return null;

    const unsignedAccessToken = fastifyCookie.unsign(accessToken, env.cookieSecret);
    const unsignedSecretToken = fastifyCookie.unsign(secretToken, env.cookieSecret);
    const decryptCookie = await verifyAuthToken(unsignedAccessToken.value || '', env.encryptionSecret);
    if (typeof decryptCookie === 'string') return null;
    if (unsignedSecretToken.value !== decryptCookie.secret) return null;

    return decryptCookie.id;
  } catch (err) {
    const error = err as Error;
    logger.error(error, error.message);
    return null;
  }
};
