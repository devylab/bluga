import { PrismaClient } from '@prisma/client';

class Database {
  private readonly prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  instance() {
    return this.prisma;
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

const database = new Database();
export default database;
