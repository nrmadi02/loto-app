import z from "zod";
import { protectedProcedure } from "../lib/orpc";
import { LotoService } from "../services/loto.service";

export const lotoRouter = {
  transition: protectedProcedure
    .input(
      z.object({
        machineId: z.string(),
        to: z.enum(["OPERASIONAL", "LOCKED_OUT", "ZERO_OK", "REPAIR"]),
        byName: z.string(),
        payload: z.any(),
        note: z.string().optional(),
        photoUri: z.string().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const service = new LotoService(context);
      const result = await service.transitionMachine(input);

      console.log(result);
      return {
        status: "success",
        data: result,
      };
    }),
};
