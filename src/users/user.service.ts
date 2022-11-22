import database from '@shared/database';
import { logger } from '@shared/logger';
import { ServerUtils } from '@shared/utils/server';
import { CreateUser } from './entities/create-user.entity';

type returnType = {
  data: unknown;
  error: unknown;
};

export class UserService {
  private readonly db;

  constructor() {
    this.db = database.instance();
  }

  async createUser({ email, password, username }: CreateUser): Promise<returnType> {
    try {
      const hash = await ServerUtils.hashPassword(password);
      await this.db.user.create({
        data: { id: ServerUtils.uniqueId(), email, username, password: hash },
      });

      return { data: 'user created', error: null };
    } catch (err) {
      logger.error(err, 'error while creating user');
      return { data: null, error: 'error' };
    }
  }
}
