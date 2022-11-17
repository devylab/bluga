import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const clean = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: num(),
  DATABASE_URL: str(),
});

export const env = {
  environment: {
    isProduction: clean.isProduction,
    isDevelopment: clean.isDev,
    isTest: clean.isTest,
  },
  port: clean.PORT,
};
