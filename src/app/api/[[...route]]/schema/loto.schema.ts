import { z } from "zod";

const zPhotoOrVideo = z.string().min(1);

export const StartLotoSchema = z.object({
  technicianName: z.string().min(1, "Wajib diisi"),
  reason: z.string().min(1, "Wajib diisi"),
  isolationPoints: z
    .array(z.string().min(1))
    .min(1, "Pilih minimal 1 titik isolasi"),
  lockEvidence: z
    .record(z.string(), zPhotoOrVideo)
    .refine((r) => Object.keys(r).length > 0, "Bukti lock wajib"),
  tagIds: z.array(z.string()).optional(),
  storedEnergyReleased: z.literal(true, {
    error: "Energi tersimpan harus dilepas",
  }),
  notes: z.string().optional(),
});
export type StartLotoInput = z.infer<typeof StartLotoSchema>;

// 2) LOCKED_OUT -> ZERO_OK
export const VerifyZeroSchema = z.object({
  technicianName: z.string().min(1, "Wajib diisi"),
  tryStartNegative: z.literal(true, {
    error: "Try-start negatif wajib",
  }),
  tryStartEvidence: zPhotoOrVideo,
  measurements: z
    .array(
      z.object({
        pointId: z.string().min(1),
        parameter: z.enum(["Voltage", "Pressure", "Temperature", "Other"]),
        value: z.number().optional(),
        unit: z.enum(["V", "bar", "°C", "N", "Other"]).optional(),
        gaugePhoto: zPhotoOrVideo.optional(),
      }),
    )
    .optional(),
});
export type VerifyZeroInput = z.infer<typeof VerifyZeroSchema>;

// 3) ZERO_OK -> REPAIR (daily check / start repair)
export const StartRepairSchema = z.object({
  technicianName: z.string().min(1),
  dailyLockCheck: z.literal(true, {
    error: "Pastikan lock & tag masih terpasang",
  }),
  lockCheckPhoto: zPhotoOrVideo.optional(),
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

// 4) REPAIR -> OPERASIONAL (release)
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
  panelPhoto: zPhotoOrVideo.optional(),
  notifyOperator: z.literal(true, {
    error: "Operator harus diberi tahu",
  }),
  notes: z.string().optional(),
});
export type ReleaseInput = z.infer<typeof ReleaseSchema>;

// 5) LOCKED_OUT -> OPERASIONAL (cancel)
export const CancelLotoSchema = z.object({
  technicianName: z.string().min(1),
  reasonCancel: z.string().min(1),
  allLocksRemoved: z.literal(true, {
    error: "Semua lock harus dilepas",
  }),
});
export type CancelLotoInput = z.infer<typeof CancelLotoSchema>;

export const FormSchemas = {
  "OPERASIONAL->LOCKED_OUT": StartLotoSchema,
  "LOCKED_OUT->ZERO_OK": VerifyZeroSchema,
  "ZERO_OK->REPAIR": StartRepairSchema,
  "REPAIR->OPERASIONAL": ReleaseSchema,
  "LOCKED_OUT->OPERASIONAL": CancelLotoSchema,
} as const;

export type TransitionKey = keyof typeof FormSchemas;

export const AllowedTransitions: Record<string, string[]> = {
  OPERASIONAL: ["LOCKED_OUT"],
  LOCKED_OUT: ["ZERO_OK", "OPERASIONAL"],
  ZERO_OK: ["REPAIR", "LOCKED_OUT"],
  REPAIR: ["OPERASIONAL"],
};
