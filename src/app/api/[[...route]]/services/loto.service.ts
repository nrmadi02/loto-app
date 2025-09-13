/** biome-ignore-all lint/style/useImportType: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { ORPCError } from "@orpc/client";
import { MachineStatus, Prisma } from "@prisma/client";
import { orpc } from "@/lib/orpc";
import type { Context } from "../lib/context";
import {
  collectFiles,
  replaceFilesWithUris,
  MachineStatus as S,
  TransitionKey,
  validatePayload,
} from "../lib/loto.lib";

/**
 * LotoService — versi lengkap (super-sederhana, tanpa supervisor)
 *
 * Prasyarat Context:
 *  - ctx.prisma   : PrismaClient
 *  - ctx.uploader : { upload(fileLike: any, opts?: { path?: string }): Promise<string> }
 *    (opsional, tapi disarankan; jika tidak ada maka file-like akan disimpan sebagai metadata saja)
 *
 * Skema Prisma yang diasumsikan (ringkasan):
 *  - Machine { id, code, name, location, status, procedures Json?, points IsolationPoint[], actions ActionLog[] }
 *  - IsolationPoint { id, machineId, label, energyType }
 *  - ActionLog { id, machineId, fromStatus, toStatus, byName, at, note?, photoUri?, payload? Json }
 *  - enum MachineStatus { OPERASIONAL, LOCKED_OUT, ZERO_OK, REPAIR }
 */

export type TransitionInput = {
  machineId: string;
  to: MachineStatus;
  byName: string; // nama petugas
  payload: unknown; // sesuai schema zod
  note?: string | null;
  photoUri?: string | null; // bukti utama opsional (di luar payload)
};

export type TransitionResult = {
  log: {
    id: string;
    machineId: string;
    fromStatus: MachineStatus;
    toStatus: MachineStatus;
  };
  machine: {
    id: string;
    status: MachineStatus;
    updatedAt: Date;
  };
};

export class LotoService {
  constructor(public ctx: Context) {}

  // -------------------------
  // Queries (helper)
  // -------------------------

  async listMachines(params?: {
    q?: string;
    status?: MachineStatus;
    take?: number;
    skip?: number;
  }) {
    const { q, status, take = 20, skip = 0 } = params || {};
    return this.ctx.prisma.machine.findMany({
      where: {
        AND: [
          status ? { status } : {},
          q
            ? {
                OR: [
                  { code: { contains: q, mode: "insensitive" } },
                  { name: { contains: q, mode: "insensitive" } },
                  { location: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      include: { points: true },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    });
  }

  async getMachine(machineId: string) {
    const m = await this.ctx.prisma.machine.findUnique({
      where: { id: machineId },
      include: { points: true },
    });
    if (!m)
      throw new ORPCError("ERROR_NOT_FOUND", {
        message: "Mesin tidak ditemukan",
      });
    return m;
  }

  async getActionLogs(machineId: string, take = 50) {
    return this.ctx.prisma.actionLog.findMany({
      where: { machineId },
      orderBy: { at: "desc" },
      take,
    });
  }

  async getProcedures(machineId: string) {
    const m = await this.ctx.prisma.machine.findUnique({
      where: { id: machineId },
      select: { procedures: true },
    });
    if (!m)
      throw new ORPCError("ERROR_NOT_FOUND", {
        message: "Mesin tidak ditemukan",
      });
    return (m.procedures || {}) as Record<string, unknown>;
  }

  // -------------------------
  // Core: transition machine
  // -------------------------

  /**
   * Apply status transition with validation + optional file uploads.
   */
  async transitionMachine(input: TransitionInput): Promise<TransitionResult> {
    try {
      const { machineId, to, byName, note, photoUri } = input;

      // 1) Ambil machine + points untuk validasi referensi titik isolasi
      const machine = await this.ctx.prisma.machine.findUnique({
        where: { id: machineId },
        include: { points: true },
      });
      if (!machine)
        throw new ORPCError("ERROR_NOT_FOUND", {
          message: "Mesin tidak ditemukan",
        });

      const from = machine.status as MachineStatus;
      const key = `${from}->${to}` as TransitionKey;

      // 2) Validasi payload via Zod (termasuk guard boolean wajib true)
      const parsed = validatePayload(
        from as unknown as S,
        to as unknown as S,
        input.payload,
      ) as any;

      if (key === "OPERASIONAL->LOCKED_OUT") {
        // 3) Extra guards berbasis data mesin (mis. Start LOTO harus valid untuk titik isolasi)
        const ids = new Set(machine.points.map((p) => p.id));
        for (const pid of parsed.isolationPoints as string[]) {
          if (!ids.has(pid))
            throw new ORPCError("ERROR_BAD_REQUEST", {
              message: `Titik isolasi tidak dikenal untuk mesin ini: ${pid}`,
            });
          if (!parsed.lockEvidence?.[pid])
            throw new ORPCError("ERROR_BAD_REQUEST", {
              message: `Bukti lock untuk titik ${pid} wajib diunggah`,
            });
        }
      }

      // 4) Upload file-like di payload (jika ctx.uploader tersedia)
      let sanitizedPayload: Prisma.InputJsonValue = parsed;
      const files = collectFiles(parsed);
      if (files.length > 0) {
        const uriMap = new Map<string, string>();
        for (const f of files) {
          const v: any = f.value as any;
          try {
            if (typeof v === "string") {
              // If already a URL/string, keep as-is
              uriMap.set(f.path, v);
              continue;
            }
            if (
              v &&
              typeof v.name === "string" &&
              typeof v.dataUrl === "string"
            ) {
              const result = await orpc.upload.call({
                file: { name: v.name, dataUrl: v.dataUrl },
              });
              const uploaded = (result as any)?.data?.data;
              const url =
                (uploaded &&
                  (uploaded.ufsUrl || uploaded.url || uploaded.appUrl)) ||
                "";
              uriMap.set(f.path, url);
            } else {
              // No data available (client sent only metadata), leave empty
              uriMap.set(f.path, "");
            }
          } catch {
            uriMap.set(f.path, "");
          }
        }
        sanitizedPayload = replaceFilesWithUris(
          parsed,
          (path) => uriMap.get(path) || "",
        );
      }

      // 5) Tulis log + update status (transaction)
      const out = await this.ctx.prisma.$transaction(async (tx) => {
        const log = await tx.actionLog.create({
          data: {
            machineId,
            fromStatus: from,
            toStatus: to,
            byName,
            note: note || undefined,
            photoUri: photoUri || undefined,
            payload: sanitizedPayload,
          },
          select: {
            id: true,
            machineId: true,
            fromStatus: true,
            toStatus: true,
          },
        });

        const updated = await tx.machine.update({
          where: { id: machineId },
          data: { status: to },
          select: { id: true, status: true, updatedAt: true },
        });

        return { log, machine: updated };
      });

      return out;
    } catch (error) {
      console.log(error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Gagal mengubah status mesin",
      });
    }
  }

  // -------------------------
  // Convenience wrappers per transition (opsional)
  // -------------------------

  startLoto(params: Omit<TransitionInput, "to">) {
    return this.transitionMachine({ ...params, to: MachineStatus.LOCKED_OUT });
  }

  verifyZero(params: Omit<TransitionInput, "to">) {
    return this.transitionMachine({ ...params, to: MachineStatus.ZERO_OK });
  }

  startRepair(params: Omit<TransitionInput, "to">) {
    return this.transitionMachine({ ...params, to: MachineStatus.REPAIR });
  }

  release(params: Omit<TransitionInput, "to">) {
    return this.transitionMachine({ ...params, to: MachineStatus.OPERASIONAL });
  }

  cancelBeforeZero(params: Omit<TransitionInput, "to">) {
    return this.transitionMachine({ ...params, to: MachineStatus.OPERASIONAL });
  }
}
