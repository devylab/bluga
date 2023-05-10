import path from 'path';
import { env } from './env';

export const SomethingWentWrong = 'something went wrong';
export const InvalidToken = 'Please use a valid token';
export const accessTokenKey = 'dawn';
export const refreshTokenKey = 'drawn';
export const secretTokenKey = 'down';
export const fiveMinutesInSeconds = 44444;
export const sixMonthsInSeconds = 44444;
export const minifierOpts = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};
export const settingsId = '09UsZLX3kSXS';
export const subDirectoryPath = path.join('/', env.subDirectory, '/');
export const hostProtocol = `${env.environment.isProduction ? 'https' : 'http'}://`;
