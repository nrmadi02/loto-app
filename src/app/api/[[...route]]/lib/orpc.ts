import type { AnyContractRouter } from "@orpc/contract";
import { implement, os } from "@orpc/server";

import type { Context } from "./context";

export const implementRouter = <T extends AnyContractRouter>(contract: T) =>
  implement(contract).$context<Context>();
export const o = os.$context<Context>();

// export const requireAuth = o.middleware(async ({ context, next }) => {
//   if (!context.session?.user) {
//     throw new ORPCError("UNAUTHORIZED");
//   }
//   return next({
//     context: {
//       session: context.session,
//     },
//   });
// });

export const publicProcedure = o;
export const protectedProcedure = publicProcedure;
