/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "photo"
  | "video"
  | "datetime"
  | "chips"
  | "table";

export interface FormFieldBase {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  optionsSource?: string; // e.g., "machine.points"
  accept?: string[];
  unit?: string;
  min?: number;
  max?: number;
  optional?: boolean;
  repeatFor?: string; // render one sub-block per selected value of another field
}

export interface TableColumn
  extends Omit<FormFieldBase, "required" | "repeatFor"> {}

export interface TableField extends FormFieldBase {
  type: "table";
  columns: TableColumn[];
}

export interface FormSpec {
  title: string;
  preconditions?: string[];
  fields: (FormFieldBase | TableField)[];
  validations?: any[];
  outputStatus: string;
}

type MachineStatus = "OPERASIONAL" | "LOCKED_OUT" | "ZERO_OK" | "REPAIR";

type TransitionKey =
  | "OPERASIONAL->LOCKED_OUT"
  | "LOCKED_OUT->ZERO_OK"
  | "ZERO_OK->REPAIR"
  | "REPAIR->OPERASIONAL"
  | "LOCKED_OUT->OPERASIONAL";

// ------------------------------
// Sample Data (replace with API/DB)
// ------------------------------

export const SAMPLE_MACHINE = {
  id: "machine-001",
  code: "MCH-001",
  name: "Pompa Hidrolik #1",
  location: "Area A",
  status: "OPERASIONAL" as MachineStatus,
  points: [
    { id: "p1", label: "Main Breaker QF1", energyType: "ELECTRICAL" },
    { id: "p2", label: "Valve H1 (Bleed)", energyType: "HYDRAULIC" },
  ],
};

export const PROCEDURES: Record<TransitionKey, FormSpec> = {
  "OPERASIONAL->LOCKED_OUT": {
    title: "Start LOTO (Kunci & Tag)",
    preconditions: ["Mesin aman untuk dimatikan"],
    fields: [
      {
        id: "technicianName",
        label: "Nama Petugas",
        type: "text",
        required: true,
        placeholder: "Nama lengkap petugas",
      },
      {
        id: "reason",
        label: "Alasan LOTO / Pekerjaan",
        type: "textarea",
        required: true,
        placeholder: "Contoh: Preventive maintenance pompa",
      },
      {
        id: "isolationPoints",
        label: "Titik Isolasi yang Dikunci",
        type: "multiselect",
        required: true,
        optionsSource: "machine.points",
      },
      {
        id: "lockEvidence",
        label: "Bukti Lock/Tag per Titik",
        type: "photo",
        required: true,
        repeatFor: "isolationPoints",
        placeholder: "Unggah foto/video bukti lock/tag",
      },
      {
        id: "tagIds",
        label: "Nomor Tag (opsional)",
        type: "chips",
        placeholder: "Ketik nomor tag lalu Enter",
      },
      {
        id: "storedEnergyReleased",
        label: "Energi tersimpan telah dilepas (bleed/drain/ground)",
        type: "boolean",
        required: true,
      },
      {
        id: "notes",
        label: "Catatan",
        type: "textarea",
        placeholder: "Catatan tambahan (opsional)",
      },
    ],
    outputStatus: "LOCKED_OUT",
  },
  "LOCKED_OUT->ZERO_OK": {
    title: "Verifikasi Nol Energi",
    fields: [
      {
        id: "technicianName",
        label: "Nama Petugas",
        type: "text",
        required: true,
        placeholder: "Nama lengkap petugas",
      },
      {
        id: "tryStartNegative",
        label: "Try-start negatif (mesin tidak menyala)",
        type: "boolean",
        required: true,
      },
      {
        id: "tryStartEvidence",
        label: "Bukti Try-start (foto/video)",
        type: "photo",
        required: true,
        accept: ["image/*", "video/*"],
      },
      {
        id: "measurements",
        label: "Pengukuran (opsional)",
        type: "table",
        columns: [
          {
            id: "pointId",
            label: "Titik",
            type: "select",
            optionsSource: "machine.points",
            placeholder: "Pilih titik",
          },
          {
            id: "parameter",
            label: "Parameter",
            type: "select",
            options: ["Voltage", "Pressure", "Temperature", "Other"],
            placeholder: "Pilih parameter",
          },
          {
            id: "value",
            label: "Nilai",
            type: "number",
            placeholder: "Nilai ukur",
          },
          {
            id: "unit",
            label: "Unit",
            type: "select",
            options: ["V", "bar", "°C", "N", "Other"],
            placeholder: "Pilih unit",
          },
          { id: "gaugePhoto", label: "Foto Alat Ukur", type: "photo" },
        ],
      } as TableField,
    ],
    outputStatus: "ZERO_OK",
  },
  "ZERO_OK->REPAIR": {
    title: "Mulai Perbaikan / Daily Check",
    fields: [
      {
        id: "technicianName",
        label: "Nama Petugas",
        type: "text",
        required: true,
        placeholder: "Nama lengkap petugas",
      },
      {
        id: "dailyLockCheck",
        label: "Lock & tag masih terpasang (cek visual)",
        type: "boolean",
        required: true,
      },
      {
        id: "lockCheckPhoto",
        label: "Foto cepat lock/tag (opsional)",
        type: "photo",
      },
      {
        id: "hazards",
        label: "Bahaya (opsional)",
        type: "multiselect",
        options: [
          "Listrik",
          "Mekanik/Rotasi",
          "Hidrolik/Pneumatik",
          "Panas",
          "Bahan kimia",
          "Ruang terbatas",
          "Ketinggian",
          "Lainnya",
        ],
      },
      {
        id: "ppe",
        label: "PPE (opsional)",
        type: "multiselect",
        options: [
          "Helm",
          "Kacamata",
          "Sarung tangan",
          "Sepatu safety",
          "Pelindung pendengaran",
          "Apron",
          "Harness",
        ],
      },
      {
        id: "workSummary",
        label: "Ringkasan pekerjaan",
        type: "textarea",
        placeholder: "Ringkas pekerjaan yang dilakukan",
      },
    ],
    outputStatus: "REPAIR",
  },
  "REPAIR->OPERASIONAL": {
    title: "Release / Kembalikan Operasi",
    fields: [
      {
        id: "technicianName",
        label: "Nama Petugas",
        type: "text",
        required: true,
        placeholder: "Nama lengkap petugas",
      },
      {
        id: "areaClear",
        label: "Area bersih & alat diangkat",
        type: "boolean",
        required: true,
      },
      {
        id: "guardsInstalled",
        label: "Guard/cover terpasang kembali",
        type: "boolean",
        required: true,
      },
      {
        id: "allLocksRemoved",
        label: "Semua lock & tag sudah dilepas",
        type: "boolean",
        required: true,
      },
      {
        id: "panelPhoto",
        label: "Foto panel/area akhir (opsional)",
        type: "photo",
      },
      {
        id: "notifyOperator",
        label: "Operator sudah diberi tahu",
        type: "boolean",
        required: true,
      },
      {
        id: "notes",
        label: "Catatan akhir",
        type: "textarea",
        placeholder: "Catatan akhir (opsional)",
      },
    ],
    outputStatus: "OPERASIONAL",
  },
  "LOCKED_OUT->OPERASIONAL": {
    title: "Batalkan LOTO (sebelum Zero)",
    fields: [
      {
        id: "technicianName",
        label: "Nama Petugas",
        type: "text",
        required: true,
        placeholder: "Nama lengkap petugas",
      },
      {
        id: "allLocksRemoved",
        label: "Semua lock & tag sudah dilepas",
        type: "boolean",
        required: true,
      },
      {
        id: "reasonCancel",
        label: "Alasan pembatalan",
        type: "textarea",
        required: true,
        placeholder: "Contoh: Pekerjaan ditunda, mesin dibutuhkan",
      },
    ],
    outputStatus: "OPERASIONAL",
  },
};

export const ALLOWED: Record<MachineStatus, MachineStatus[]> = {
  OPERASIONAL: ["LOCKED_OUT"],
  LOCKED_OUT: ["ZERO_OK", "OPERASIONAL"],
  ZERO_OK: ["REPAIR", "LOCKED_OUT"],
  REPAIR: ["OPERASIONAL"],
};
