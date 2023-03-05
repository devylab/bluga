import { sixMonthsInSeconds } from '@shared/constants';
import { env } from '@shared/constants/env';
import database from '@shared/database';
import { generateAuthToken } from '@shared/jwt';
import { logger } from '@shared/logger';
import { Utils } from '@shared/utils';
import { CreateUser } from './entities/create-user.entity';

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
      const accessToken = generateAuthToken(tokenData, sixMonthsInSeconds, env.encryptionSecret);
      const refreshToken = generateAuthToken(tokenData, sixMonthsInSeconds, env.reEncryptionSecret);

      return { data: { accessToken, secret, refreshToken }, error: null };
    } catch (err) {
      logger.error(err, 'error while creating user');
      return { data: null, error: 'error' };
    }
  }
}
