import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

export const themeSeed = async (prisma: PrismaClient) => {
  await prisma.theme.createMany({
    data: [
      {
        id: nanoid(10),
        name: 'bluga',
        status: true,
      },
      {
        id: nanoid(10),
        name: 'avail',
        status: false,
      },
    ],
  });
};
