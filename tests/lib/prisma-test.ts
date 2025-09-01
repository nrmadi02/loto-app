import { PrismaClient } from "@prisma/client";

const prismaTest = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default prismaTest;
