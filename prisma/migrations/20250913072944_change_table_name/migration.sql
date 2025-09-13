/*
  Warnings:

  - You are about to drop the `ActionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IsolationPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Machine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ActionLog" DROP CONSTRAINT "ActionLog_machineId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IsolationPoint" DROP CONSTRAINT "IsolationPoint_machineId_fkey";

-- DropTable
DROP TABLE "public"."ActionLog";

-- DropTable
DROP TABLE "public"."IsolationPoint";

-- DropTable
DROP TABLE "public"."Machine";

-- CreateTable
CREATE TABLE "public"."machine" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" "public"."MachineStatus" NOT NULL DEFAULT 'OPERASIONAL',
    "procedures" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."isolation_point" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "energyType" "public"."EnergyType" NOT NULL,
    "details" TEXT,

    CONSTRAINT "isolation_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."action_log" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "fromStatus" "public"."MachineStatus" NOT NULL,
    "toStatus" "public"."MachineStatus" NOT NULL,
    "byName" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "photoUri" TEXT,
    "payload" JSONB,

    CONSTRAINT "action_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machine_code_key" ON "public"."machine"("code");

-- CreateIndex
CREATE INDEX "machine_status_idx" ON "public"."machine"("status");

-- CreateIndex
CREATE INDEX "isolation_point_machineId_idx" ON "public"."isolation_point"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "isolation_point_machineId_label_key" ON "public"."isolation_point"("machineId", "label");

-- CreateIndex
CREATE INDEX "action_log_machineId_at_idx" ON "public"."action_log"("machineId", "at");

-- CreateIndex
CREATE INDEX "action_log_toStatus_idx" ON "public"."action_log"("toStatus");

-- AddForeignKey
ALTER TABLE "public"."isolation_point" ADD CONSTRAINT "isolation_point_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "public"."machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_log" ADD CONSTRAINT "action_log_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "public"."machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
