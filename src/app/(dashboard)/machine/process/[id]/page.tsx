import type { Metadata } from "next";
import MachineProcessContainer from "@/features/dashboard/machine/machine-process.container";

export const metadata: Metadata = {
  title: "Proses LOTO Mesin",
  description: "Proses LOTO Mesin",
};

export default function MachineProcessPage() {
  return <MachineProcessContainer />;
}
