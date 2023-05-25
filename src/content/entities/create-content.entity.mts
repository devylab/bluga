export type StatusType = 'DRAFT' | 'PRIVATE' | 'PUBLIC';

type CreateContentType = {
  value: string;
};

type StatusContentType = {
  value: StatusType;
};

export type CreateContent = {
  title: string | CreateContentType;
  status: StatusType | StatusContentType;
  rawContent: string | CreateContentType;
  description: string | CreateContentType;
  categoryId: string | CreateContentType;
  tags: string | CreateContentType;
};

export const getKeyValue = (data: string | CreateContentType) => {
  return typeof data === 'string' ? data : data.value;
};

export const getStatusValue = (data: StatusType | StatusContentType) => {
  return typeof data === 'string' ? data : data.value;
};
