import prisma from "@/lib/prisma";
import { machineSeed } from "./seeds/machine.seed";

const main = async () => {
  await machineSeed();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
