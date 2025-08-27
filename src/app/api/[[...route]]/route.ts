import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import { handle } from "hono/vercel";
import validationErrorInterceptor from "./commons/interceptors/error-validation.interceptor";
// import { createContext } from "./lib/context";
import { appRouter } from "./routers";

export const runtime = "nodejs";

const BODY_PARSER_METHODS = new Set([
  "arrayBuffer",
  "blob",
  "formData",
  "json",
  "text",
] as const);

type BodyParserMethod = typeof BODY_PARSER_METHODS extends Set<infer T>
  ? T
  : never;

const handlerOrcp = new RPCHandler(appRouter, {
  interceptors: [onError(validationErrorInterceptor)],
});

const app = new Hono().basePath("/api");

app.use(logger());
app.use("*", cors());
app.use("*", csrf());
app.use("*", prettyJSON());
app.use("*", secureHeaders());
app.use("*", timing());

app.use("/rpc/*", async (c, next) => {
  const request = new Proxy(c.req.raw, {
    get(target, prop) {
      if (BODY_PARSER_METHODS.has(prop as BodyParserMethod)) {
        return () => c.req[prop as BodyParserMethod]();
      }
      return Reflect.get(target, prop, target);
    },
  });

  // const context = await createContext({ context: c });
  const { matched, response } = await handlerOrcp.handle(request, {
    prefix: "/api/rpc",
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

const handler = handle(app);

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
