export type ThemeConfig = {
  name: string;
  url: string;
  version: string;
  creator: string;
  preview: string;
  headers: string[];
  footers: string[];
  routes: { route: string; path: string; headers: string[]; footers: string[] }[];
};
