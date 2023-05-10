/* eslint-disable @typescript-eslint/no-explicit-any */

const attachesParser = (block: any) => {
  return `<a href="${block.data?.file?.url}" download>${block.data.title}</a>`;
};

export default { attaches: attachesParser };
