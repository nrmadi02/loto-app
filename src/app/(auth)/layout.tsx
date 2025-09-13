import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data?.session && data?.user) {
    console.log("User already logged in");
    return redirect("/dashboard");
  }

  return children;
}
