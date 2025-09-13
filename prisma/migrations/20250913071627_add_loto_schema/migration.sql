-- CreateEnum
CREATE TYPE "public"."MachineStatus" AS ENUM ('OPERASIONAL', 'LOCKED_OUT', 'ZERO_OK', 'REPAIR');

-- CreateEnum
CREATE TYPE "public"."EnergyType" AS ENUM ('ELECTRICAL', 'PNEUMATIC', 'HYDRAULIC', 'MECHANICAL', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Machine" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" "public"."MachineStatus" NOT NULL DEFAULT 'OPERASIONAL',
    "procedures" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IsolationPoint" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "energyType" "public"."EnergyType" NOT NULL,
    "details" TEXT,

    CONSTRAINT "IsolationPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActionLog" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "fromStatus" "public"."MachineStatus" NOT NULL,
    "toStatus" "public"."MachineStatus" NOT NULL,
    "byName" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "photoUri" TEXT,
    "payload" JSONB,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_code_key" ON "public"."Machine"("code");

-- CreateIndex
CREATE INDEX "Machine_status_idx" ON "public"."Machine"("status");

-- CreateIndex
CREATE INDEX "IsolationPoint_machineId_idx" ON "public"."IsolationPoint"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "IsolationPoint_machineId_label_key" ON "public"."IsolationPoint"("machineId", "label");

-- CreateIndex
CREATE INDEX "ActionLog_machineId_at_idx" ON "public"."ActionLog"("machineId", "at");

-- CreateIndex
CREATE INDEX "ActionLog_toStatus_idx" ON "public"."ActionLog"("toStatus");

-- AddForeignKey
ALTER TABLE "public"."IsolationPoint" ADD CONSTRAINT "IsolationPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "public"."Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActionLog" ADD CONSTRAINT "ActionLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "public"."Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
