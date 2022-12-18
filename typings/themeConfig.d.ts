import { ContentService } from 'src/content/content.service';

type QueryOptions = {
  content: ContentService;
};

export type ThemeConfig = {
  route: string;
  path: string;
  title: string;
  queries: {
    name: string;
    query: (queryOptions: QueryOptions) => unknown;
  }[];
}[];
