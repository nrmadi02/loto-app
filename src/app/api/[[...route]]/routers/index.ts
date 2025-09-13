import type { RouterClient } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { UTApi, UTFile } from "uploadthing/server";
import z from "zod";
import { publicProcedure } from "../lib/orpc";
import { authRouter } from "./auth.router";
import { lotoRouter } from "./loto.router";
import { machineRouter } from "./machine.router";

const utapi = new UTApi();

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return {
      status: "ok",
    };
  }),
  auth: authRouter,
  machine: machineRouter,
  loto: lotoRouter,
  upload: publicProcedure
    .input(
      z.object({
        file: z.object({
          name: z.string().min(1),
          dataUrl: z.string().min(1),
        }),
      }),
    )
    .handler(async ({ input }) => {
      try {
        // Expect data URL: data:<mime>;base64,<data>
        const { name, dataUrl } = input.file;
        const match = /^data:([^;]+);base64,/.exec(dataUrl);
        const mime = match?.[1] || "application/octet-stream";
        const commaIdx = dataUrl.indexOf(",");
        const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
        const buffer = Buffer.from(base64, "base64");
        const file = new UTFile([buffer], name, { type: mime });
        const result = await utapi.uploadFiles(file);

        console.log(result);
        return {
          status: "success",
          data: result,
        };
      } catch (error) {
        console.error(error);
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Gagal mengunggah file",
        });
      }
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
