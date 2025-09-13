import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../lib/orpc";
import { authRouter } from "./auth.router";

import { machineRouter } from "./machine.router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return {
      status: "ok",
    };
  }),
  auth: authRouter,
  machine: machineRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;