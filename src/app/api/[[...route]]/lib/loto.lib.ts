/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { z } from "zod";

/**
 * Zod validation for super-simple LOTO flow (no supervisor).
 *
 * Covers ALL transition keys:
 *  - OPERASIONAL -> LOCKED_OUT (Start LOTO)
 *  - LOCKED_OUT  -> ZERO_OK    (Verify Zero Energy)
 *  - ZERO_OK     -> REPAIR     (Start/Daily Repair)
 *  - REPAIR      -> OPERASIONAL (Release)
 *  - LOCKED_OUT  -> OPERASIONAL (Cancel before zero)
 *
 * Notes on file handling:
 *  - Because file upload is done in the SERVICE layer, we accept a "FileLike"
 *    value here:
 *      * string (a URI or temporary local path)
 *      * object with basic meta: { name, size?, type? }
 *    The service can detect those and upload to object storage, then replace with
 *    permanent URLs.
 */

// ---------------------------------
// Basic enums/types
// ---------------------------------

export const MachineStatusSchema = z.enum([
  "OPERASIONAL",
  "LOCKED_OUT",
  "ZERO_OK",
  "REPAIR",
]);
export type MachineStatus = z.infer<typeof MachineStatusSchema>;

export type TransitionKey =
  | "OPERASIONAL->LOCKED_OUT"
  | "LOCKED_OUT->ZERO_OK"
  | "ZERO_OK->REPAIR"
  | "REPAIR->OPERASIONAL"
  | "LOCKED_OUT->OPERASIONAL";

export const AllowedTransitions: Record<MachineStatus, MachineStatus[]> = {
  OPERASIONAL: ["LOCKED_OUT"],
  LOCKED_OUT: ["ZERO_OK", "OPERASIONAL"], // cancel allowed
  ZERO_OK: ["REPAIR", "LOCKED_OUT"],
  REPAIR: ["OPERASIONAL"],
};

// ---------------------------------
// File-like schema & helpers
// ---------------------------------

/**
 * Minimal File-like schema accepted by server BEFORE upload occurs.
 * - string: can be a temporary path or data URL or already-uploaded URL
 * - object: simple metadata from client (name/size/type)
 */
export const zFileLike = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    size: z.number().optional(),
    type: z.string().optional(),
    // optional data URL when client sends inline file content
    dataUrl: z.string().optional(),
  }),
]);
export type FileLike = z.infer<typeof zFileLike>;

// ---------------------------------
// Transition payload schemas
// ---------------------------------

export const StartLotoSchema = z.object({
  technicianName: z.string().min(1, "Nama Petugas wajib"),
  reason: z.string().min(1, "Alasan LOTO wajib"),
  isolationPoints: z.array(z.string().min(1)).min(1, "Pilih minimal 1 titik"),
  // { [pointId]: FileLike }
  lockEvidence: z
    .record(z.string(), zFileLike)
    .refine((r) => Object.keys(r).length > 0, "Bukti lock per titik wajib"),
  tagIds: z.array(z.string()).optional(),
  storedEnergyReleased: z.literal(true, {
    error: "Energi tersimpan harus dilepas",
  }),
  notes: z.string().optional(),
});
export type StartLotoInput = z.infer<typeof StartLotoSchema>;

export const VerifyZeroSchema = z.object({
  technicianName: z.string().min(1),
  tryStartNegative: z.literal(true, {
    error: "Try-start negatif wajib",
  }),
  tryStartEvidence: zFileLike, // photo/video proof
  measurements: z
    .array(
      z.object({
        pointId: z.string().min(1),
        parameter: z.enum(["Voltage", "Pressure", "Temperature", "Other"]),
        value: z.number().optional(),
        unit: z.enum(["V", "bar", "°C", "N", "Other"]).optional(),
        gaugePhoto: zFileLike.optional(),
      }),
    )
    .optional(),
});
export type VerifyZeroInput = z.infer<typeof VerifyZeroSchema>;

export const StartRepairSchema = z.object({
  technicianName: z.string().min(1),
  dailyLockCheck: z.literal(true, {
    error: "Pastikan lock & tag masih terpasang",
  }),
  lockCheckPhoto: zFileLike.optional(),
  hazards: z
    .array(
      z.enum([
        "Listrik",
        "Mekanik/Rotasi",
        "Hidrolik/Pneumatik",
        "Panas",
        "Bahan kimia",
        "Ruang terbatas",
        "Ketinggian",
        "Lainnya",
      ]),
    )
    .optional(),
  ppe: z
    .array(
      z.enum([
        "Helm",
        "Kacamata",
        "Sarung tangan",
        "Sepatu safety",
        "Pelindung pendengaran",
        "Apron",
        "Harness",
      ]),
    )
    .optional(),
  workSummary: z.string().optional(),
});
export type StartRepairInput = z.infer<typeof StartRepairSchema>;

export const ReleaseSchema = z.object({
  technicianName: z.string().min(1),
  areaClear: z.literal(true, {
    error: "Area harus bersih",
  }),
  guardsInstalled: z.literal(true, {
    error: "Guard harus terpasang",
  }),
  allLocksRemoved: z.literal(true, {
    error: "Semua lock harus dilepas",
  }),
  panelPhoto: zFileLike.optional(),
  notifyOperator: z.literal(true, {
    error: "Operator harus diberi tahu",
  }),
  notes: z.string().optional(),
});
export type ReleaseInput = z.infer<typeof ReleaseSchema>;

export const CancelLotoSchema = z.object({
  technicianName: z.string().min(1),
  reasonCancel: z.string().min(1),
  allLocksRemoved: z.literal(true, {
    error: "Semua lock harus dilepas",
  }),
});
export type CancelLotoInput = z.infer<typeof CancelLotoSchema>;

export const TransitionSchemas: Record<TransitionKey, z.ZodTypeAny> = {
  "OPERASIONAL->LOCKED_OUT": StartLotoSchema,
  "LOCKED_OUT->ZERO_OK": VerifyZeroSchema,
  "ZERO_OK->REPAIR": StartRepairSchema,
  "REPAIR->OPERASIONAL": ReleaseSchema,
  "LOCKED_OUT->OPERASIONAL": CancelLotoSchema,
};

export function schemaForTransition(from: MachineStatus, to: MachineStatus) {
  return TransitionSchemas[`${from}->${to}` as TransitionKey];
}

export function assertTransitionAllowed(
  from: MachineStatus,
  to: MachineStatus,
) {
  const allowed = AllowedTransitions[from] || [];
  if (!allowed.includes(to)) {
    throw new Error(`Transisi tidak diizinkan: ${from} -> ${to}`);
  }
}

export function validatePayload(
  from: MachineStatus,
  to: MachineStatus,
  payload: unknown,
) {
  assertTransitionAllowed(from, to);
  const schema = schemaForTransition(from, to);
  if (!schema)
    throw new Error(`Schema transisi ${from}->${to} tidak ditemukan`);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
      .join("; ");
    throw new Error(`Payload tidak valid: ${msg}`);
  }
  return parsed.data;
}

// ---------------------------------
// File extraction helpers (for service uploads)
// ---------------------------------

type FileEntry = { path: string; value: FileLike };

/**
 * Recursively collect FileLike values in payload, with JSON-path style path.
 * Useful for uploading files in service and replacing them with URIs.
 */
export function collectFiles(payload: any, basePath = ""): FileEntry[] {
  const files: FileEntry[] = [];
  const isFileLike = (v: any) =>
    typeof v === "string"
      ? false
      : v && typeof v === "object" && typeof v.name === "string";

  const visit = (val: any, p: string) => {
    if (val == null) return;
    if (isFileLike(val)) {
      files.push({ path: p, value: val });
      return;
    }
    if (Array.isArray(val)) {
      // biome-ignore lint/suspicious/useIterableCallbackReturn: <>
      val.forEach((item, i) => visit(item, `${p}[${i}]`));
      return;
    }
    if (typeof val === "object") {
      for (const [k, v] of Object.entries(val)) visit(v, p ? `${p}.${k}` : k);
    }
  };

  visit(payload, basePath);
  return files;
}

/**
 * Replace file-like values with URIs using a mapper function (async-capable).
 * Example usage inside a service:
 *   const files = collectFiles(parsed);
 *   const uriMap = new Map<string,string>();
 *   for (const f of files) uriMap.set(f.path, await uploader(f.value));
 *   const sanitized = replaceFilesWithUris(parsed, (path) => uriMap.get(path)!);
 */
export function replaceFilesWithUris<T>(
  payload: T,
  getUri: (jsonPath: string) => string,
): T {
  const clone = structuredClone(payload as any);
  const assignAt = (obj: any, path: string, value: any) => {
    const segs = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let cur = obj;
    for (let i = 0; i < segs.length - 1; i++) {
      const s = segs[i];
      if (!(s in cur)) cur[s] = {};
      cur = cur[s];
    }
    cur[segs[segs.length - 1]] = value;
  };

  const files = collectFiles(clone);
  for (const f of files) assignAt(clone, f.path, getUri(f.path));
  return clone as T;
}
