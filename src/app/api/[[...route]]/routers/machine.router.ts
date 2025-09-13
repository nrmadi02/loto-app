import z from "zod";
import { protectedProcedure } from "../lib/orpc";
import { MachineService } from "../services/machine.service";

export const machineRouter = {
  listMachines: protectedProcedure.handler(async ({ context }) => {
    const service = new MachineService(context);
    const result = await service.listMachines();
    return result;
  }),
  getDetailMachine: protectedProcedure
    .input(z.string())
    .handler(async ({ input, context }) => {
      const service = new MachineService(context);
      const result = await service.getDetailMachine(input);
      return result;
    }),
};
