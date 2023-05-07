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
  uploadImage: async (path: string, filename: string) => {
    try {
      const res = await cloud.uploader.upload(path, { public_id: filename, resource_type: 'image', folder: 'bluga' });
      return env.environment.isDevelopment ? res.url : res.secure_url;
    } catch (err) {
      logger.error(err, 'error while uploading file');
      return 'could not upload file';
    }
  },
};
