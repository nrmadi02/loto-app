import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import { auth } from "@/lib/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data?.session || !data?.user) {
    console.log("User not logged in");
    return redirect("/login");
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}
