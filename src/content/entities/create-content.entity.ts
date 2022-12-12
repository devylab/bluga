export type StatusType = 'DRAFT' | 'PRIVATE' | 'PUBLIC';
export type CreateContent = {
  title: string;
  status: StatusType;
  rawContent: string;
  thumbnail: string;
  description: string;
};
