import { twentyFourHoursInSeconds, sixMonthsInSeconds } from '../shared/constants/index.mjs';
import { env } from '../shared/constants/env.mjs';
import database from '../shared/database/index.mjs';
import { generateAuthToken, verifyAuthToken } from '../shared/jwt/index.mjs';
import { logger } from '../shared/logger/index.mjs';
import { Utils } from '../shared/utils/index.mjs';
import { CreateUser } from './entities/create-user.entity.mjs';

type returnType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: unknown;
};

export class UserService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async createUser({ email, password, username }: CreateUser): Promise<returnType> {
    try {
      const hash = await Utils.hashPassword(password);
      await this.db.user.create({
        data: { id: Utils.uniqueId(), email, username, password: hash },
      });

      return { data: 'user created', error: null };
    } catch (err) {
      logger.error(err, 'error while creating user');
      return { data: null, error: 'error' };
    }
  }

  async login({ email, password }: CreateUser, secret: string): Promise<returnType> {
    try {
      const user = await this.db.user.findFirst({
        select: { password: true, id: true },
        where: { email },
      });

      if (!user) return { data: null, error: 'incorrect email/password' };

      const isPassword = await Utils.comparePassword(user.password, password);
      if (!isPassword) return { data: null, error: 'incorrect email/password' };

      const tokenData = { id: user.id, secret };
      // TODO: change access token duration time
      const accessToken = generateAuthToken(tokenData, twentyFourHoursInSeconds, env.encryptionSecret);
      const refreshToken = generateAuthToken(tokenData, sixMonthsInSeconds, env.reEncryptionSecret);

      return { data: { accessToken, secret, refreshToken }, error: null };
    } catch (err) {
      logger.error(err, 'error while creating user');
      return { data: null, error: 'error' };
    }
  }

  async getUserById(id: string): Promise<returnType> {
    try {
      const user = await this.db.user.findFirstOrThrow({
        select: { avatar: true, id: true, firstName: true, lastName: true, username: true, email: true },
        where: { id },
      });

      return { data: user, error: null };
    } catch (err) {
      logger.error(err, 'error while creating user');
      return { data: null, error: 'error' };
    }
  }

  async refreshToken(secret: string, oldSecret: string, oldRefreshToken: string): Promise<returnType> {
    try {
      const decryptToken = await verifyAuthToken(oldRefreshToken || '', env.reEncryptionSecret);
      if (typeof decryptToken === 'string') return { data: null, error: 'error' };
      if (oldSecret !== decryptToken.secret) return { data: null, error: 'error' };

      const tokenData = { id: decryptToken.id, secret };
      const accessToken = generateAuthToken(tokenData, twentyFourHoursInSeconds, env.encryptionSecret);
      const refreshToken = generateAuthToken(tokenData, sixMonthsInSeconds, env.reEncryptionSecret);

      return { data: { accessToken, secret, refreshToken }, error: null };
    } catch (err) {
      logger.error(err, 'error while refreshing token');
      return { data: null, error: 'error' };
    }
  }
}
