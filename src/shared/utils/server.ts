import { nanoid } from 'nanoid';
import argon2 from 'argon2';

export class ServerUtils {
  static uniqueId(size = 10) {
    return nanoid(size);
  }

  static async hashPassword(password: string) {
    return argon2.hash(password);
  }

  static async comparePassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}
