import { ORPCError } from "@orpc/client";
import type { Context } from "../lib/context";

export class MachineService {
  constructor(public ctx: Context) {}

  listMachines() {
    try {
      return this.ctx.prisma.machine.findMany({
        include: { points: true },
      });
    } catch (error) {
      console.error(error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Gagal mengambil daftar mesin",
      });
    }
  }

  getDetailMachine(machineId: string) {
    try {
      return this.ctx.prisma.machine.findUnique({
        where: { id: machineId },
        include: { points: true },
      });
    } catch (error) {
      console.error(error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Gagal mengambil detail mesin",
      });
    }
  }
}
