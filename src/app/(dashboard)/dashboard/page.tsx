import type { Metadata } from "next";
import DashboardHomeContainer from "@/features/dashboard/home/dashboard-home.container";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <DashboardHomeContainer />;
}
