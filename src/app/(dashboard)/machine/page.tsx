import type { Metadata } from "next";
import MachineContainer from "@/features/dashboard/machine/machine.container";

export const metadata: Metadata = {
  title: "Daftar Mesin",
};

export default function MachinePage() {
  return <MachineContainer />;
}
