import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const clean = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: num(),
  DATABASE_URL: str(),
  COOKIE_SECRET: str(),
  ENCRYPTION_SECRET: str(),
  RE_ENCRYPTION_SECRET: str(),
});

export const env = {
  environment: {
    isProduction: clean.isProduction,
    isDevelopment: clean.isDev,
    isTest: clean.isTest,
  },
  port: clean.PORT,
  host: clean.isDev ? '127.0.0.1' : '0.0.0.0',
  cookieSecret: clean.COOKIE_SECRET,
  encryptionSecret: clean.ENCRYPTION_SECRET,
  reEncryptionSecret: clean.RE_ENCRYPTION_SECRET,
};
