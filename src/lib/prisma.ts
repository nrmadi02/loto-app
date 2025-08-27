import { PrismaClient } from "@prisma/client";

declare global {
  var globalprisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.globalprisma) {
    global.globalprisma = new PrismaClient();
  }
  prisma = global.globalprisma;
}

export { prisma };
