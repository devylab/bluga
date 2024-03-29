import { PrismaClient } from '@prisma/client';
import { themeSeed } from './theme.seed';
import { categorySeed } from './category.seed';
const prisma = new PrismaClient();

const seedAll = async () => {
  try {
    await themeSeed(prisma);
    await categorySeed(prisma);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err, 'Error seeding');
  } finally {
    await prisma.$disconnect();
  }
};

seedAll();
