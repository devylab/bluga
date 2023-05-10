import fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';
import { logger } from '@shared/logger';
import { MultipartFile } from '@fastify/multipart';
import path from 'path';
import { env } from '@shared/constants/env';
import { hostProtocol } from '@shared/constants';

const pump = util.promisify(pipeline);

export class UploadService {
  private readonly uploadPath;
  private readonly rootUploadPath;

  constructor() {
    this.uploadPath = path.join('public', 'uploads');
    this.rootUploadPath = env.environment.isDevelopment ? 'src' : 'build';
  }

  async uploadContentImage(host: string, file?: MultipartFile) {
    try {
      // TODO: image compression
      if (!file) {
        throw new Error('empty file');
      }

      const fileUrl = `${hostProtocol}${path.join(host, this.uploadPath, file.filename)}`;
      const storedPath = fs.createWriteStream(`./${this.rootUploadPath}/${this.uploadPath}/${file.filename}`);
      await pump(file.file, storedPath);
      return { data: fileUrl, error: null };
    } catch (err) {
      logger.error(err, 'error while uploading content image');
      return { data: null, error: 'error' };
    }
  }

  async uploadContentFile(host: string, file?: MultipartFile) {
    try {
      if (!file) {
        throw new Error('empty file');
      }

      const fileUrl = `${hostProtocol}${path.join(host, this.uploadPath, file.filename)}`;
      const storedPath = fs.createWriteStream(`./${this.rootUploadPath}/${this.uploadPath}/${file.filename}`);
      await pump(file.file, storedPath);
      return { data: fileUrl, error: null };
    } catch (err) {
      logger.error(err, 'error while uploading content file');
      return { data: null, error: 'error' };
    }
  }
}
