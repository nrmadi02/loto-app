import { EnergyType, MachineStatus } from "@prisma/client";
import { PROCEDURES } from "@/app/api/[[...route]]/const/procedures.const";
import prisma from "@/lib/prisma";

export const machineSeed = async () => {
  await prisma.machine.upsert({
    where: { code: "MCH-001" },
    update: {},
    create: {
      code: "MCH-001",
      name: "Pompa Hidrolik #1",
      location: "Area A",
      status: MachineStatus.OPERASIONAL,
      procedures: PROCEDURES,
      description: "Pompa hidrolik untuk mengalirkan fluida",
      lastActivity: new Date(),
      points: {
        create: [
          { label: "Main Breaker QF1", energyType: EnergyType.ELECTRICAL },
          { label: "Valve H1 (Bleed)", energyType: EnergyType.HYDRAULIC },
        ],
      },
    },
  });

  // Mesin #2
  await prisma.machine.upsert({
    where: { code: "MCH-002" },
    update: {},
    create: {
      code: "MCH-002",
      name: "Conveyor #2",
      location: "Area B",
      status: MachineStatus.OPERASIONAL,
      procedures: PROCEDURES,
      description: "Conveyor untuk mengalirkan bahan baku",
      lastActivity: new Date(),
      points: {
        create: [
          { label: "Panel MCC-12", energyType: EnergyType.ELECTRICAL },
          { label: "Pneumatic Supply P2", energyType: EnergyType.PNEUMATIC },
        ],
      },
    },
  });

  await prisma.machine.upsert({
    where: { code: "MCH-003" },
    update: {},
    create: {
      code: "MCH-003",
      name: "Boiler Uap #1",
      location: "Utility",
      status: MachineStatus.OPERASIONAL,
      procedures: PROCEDURES,
      description: "Boiler uap untuk menghasilkan uap",
      lastActivity: new Date(),
      points: {
        create: [
          { label: "Main Switch 400V", energyType: EnergyType.ELECTRICAL },
          { label: "Steam Isolation V1", energyType: EnergyType.OTHER },
          { label: "Feedwater Valve F1", energyType: EnergyType.MECHANICAL },
        ],
      },
    },
  });

  console.log("Machine seed selesai ✅");
};
