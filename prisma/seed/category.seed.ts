import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

export const categorySeed = async (prisma: PrismaClient) => {
  await prisma.category.createMany({
    data: [
      {
        id: nanoid(10),
        name: 'general',
      },
    ],
  });
};
