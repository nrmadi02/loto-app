import type { Context as HonoContext } from "hono";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    headers: context.req.raw.headers,
    session,
    prisma: prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
