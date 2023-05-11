import { env } from '@shared/constants/env';
import { logger } from '@shared/logger';
import Cloudinary from 'cloudinary';

const cloud = Cloudinary.v2;
cloud.config({
  cloud_name: env.cloudinary.name,
  api_key: env.cloudinary.key,
  api_secret: env.cloudinary.secret,
});

export const cloudinary = {
  // TODO: Image optimazition
  uploadImage: async (path: string, filename: string, directory?: string) => {
    try {
      const res = await cloud.uploader.upload(path, {
        public_id: filename,
        resource_type: 'image',
        folder: directory ? `bluga/${directory}` : 'bluga',
      });
      return env.environment.isDevelopment ? res.url : res.secure_url;
    } catch (err) {
      logger.error(err, 'error while uploading image');
      return 'could not upload image';
    }
  },

  uploadFile: async (path: string, filename: string, directory?: string) => {
    try {
      const res = await cloud.uploader.upload(path, {
        public_id: filename,
        folder: directory ? `bluga/${directory}` : 'bluga',
      });
      return env.environment.isDevelopment ? res.url : res.secure_url;
    } catch (err) {
      logger.error(err, 'error while uploading file');
      return 'could not upload file';
    }
  },
};
