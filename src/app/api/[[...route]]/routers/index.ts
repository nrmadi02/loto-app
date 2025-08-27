import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../lib/orpc";
import { authRouter } from "./auth.router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return {
      status: "ok",
    };
  }),
  auth: authRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
