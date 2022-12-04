export type CreateContent = {
  title: string;
  status: 'DRAFT' | 'PRIVATE' | 'PUBLIC';
  rawContent: string;
};
