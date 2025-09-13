/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { ClipboardCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type {
  FormFieldBase,
  FormSpec,
  SAMPLE_MACHINE,
  TableField,
} from "../types/machine.type";
import DynamicField from "./dynamic-field";

function validateRequired(
  fields: (FormFieldBase | TableField)[],
  values: Record<string, any>,
) {
  const errs: string[] = [];
  for (const f of fields) {
    if (f.repeatFor) {
      const arr = values[f.repeatFor] || [];
      if (f.required) {
        const map = values[f.id] || {};
        if (!arr.every((id: string) => map[id]))
          errs.push(`${f.label}: bukti untuk semua titik wajib.`);
      }
      continue;
    }
    const v = values[f.id];
    if (f.required) {
      if (f.type === "boolean" && v !== true)
        errs.push(`${f.label} harus dicentang.`);
      if (f.type !== "boolean") {
        const empty =
          v === undefined ||
          v === null ||
          v === "" ||
          (Array.isArray(v) && v.length === 0);
        if (empty) errs.push(`${f.label} wajib diisi.`);
      }
    }
  }
  return errs;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function serializeFiles(values: Record<string, any>) {
  // Convert File objects to { name, type, size, dataUrl }
  const out: Record<string, any> = {};
  const entries = Object.entries(values);
  for (const [k, v] of entries) {
    if (v instanceof File) {
      out[k] = {
        name: v.name,
        size: v.size,
        type: v.type,
        dataUrl: await fileToDataUrl(v),
      };
    } else if (typeof v === "object" && v && !Array.isArray(v)) {
      const obj: Record<string, any> = {};
      for (const [kk, vv] of Object.entries(v as any)) {
        if (vv instanceof File) {
          obj[kk] = {
            name: vv.name,
            size: vv.size,
            type: vv.type,
            dataUrl: await fileToDataUrl(vv),
          };
        } else obj[kk] = vv;
      }
      out[k] = obj;
    } else if (Array.isArray(v)) {
      out[k] = await Promise.all(
        v.map(async (it) =>
          it instanceof File
            ? {
                name: it.name,
                size: it.size,
                type: it.type,
                dataUrl: await fileToDataUrl(it),
              }
            : it,
        ),
      );
    } else out[k] = v;
  }
  return out;
}

export default function DynamicForm({
  spec,
  machine,
  onSubmit,
}: {
  spec: FormSpec;
  machine: typeof SAMPLE_MACHINE;
  onSubmit: (payload: Record<string, any>) => void;
}) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const setField = (id: string, v: any) =>
    setValues((s) => ({ ...s, [id]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRequired(spec.fields, values);
    setErrors(errs);
    if (errs.length === 0) {
      const payload = await serializeFiles(values);
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {spec.preconditions?.length ? (
        <Alert>
          <AlertTitle>Prasyarat</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-5 text-sm space-y-1 mt-1">
              {spec.preconditions.map((p) => (
                <li key={`${p}`}>{p}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {spec.fields.map((f) => (
          <DynamicField
            key={f.id}
            field={f as any}
            value={values[f.id]}
            onChange={(v) => setField(f.id, v)}
            ctx={{ machine, allValues: values }}
          />
        ))}
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Alert variant="destructive">
              <AlertTitle>Periksa isian berikut</AlertTitle>
              <AlertDescription>
                <ul className="list-disc ml-5 text-sm space-y-1 mt-1">
                  {errors.map((e) => (
                    <li key={`${e}`}>{e}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          <ClipboardCheck className="h-4 w-4" /> Simpan & Terapkan Status
        </Button>
      </div>
    </form>
  );
}
