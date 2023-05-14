import { MultipartFile } from '@fastify/multipart';

type SettingsType = {
  value: string;
};
export type SettingsEntity = {
  blogName: SettingsType;
  blogDescription: SettingsType;
  blogFavicon: MultipartFile;
};
