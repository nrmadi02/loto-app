import { adminClient, anonymousClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [adminClient(), nextCookies(), anonymousClient()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
