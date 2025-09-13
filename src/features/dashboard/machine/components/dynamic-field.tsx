/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  FormFieldBase,
  SAMPLE_MACHINE,
  TableField,
} from "../types/machine.type";
import { Chips, FilePicker, Label, useOptions } from "./helpers";

export default function DynamicField({
  field,
  value,
  onChange,
  ctx,
}: {
  field: FormFieldBase | TableField;
  value: any;
  onChange: (v: any) => void;
  ctx: { machine: typeof SAMPLE_MACHINE; allValues: Record<string, any> };
}) {
  const options = useOptions(field as any, ctx.machine);

  // repeatFor handling (e.g., lockEvidence per isolationPoints)
  if (field.repeatFor) {
    const selected: string[] = ctx.allValues[field.repeatFor] || [];
    return (
      <div className="space-y-2">
        <Label required={field.required}>{field.label}</Label>
        {selected.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Pilih {field.repeatFor} terlebih dahulu.
          </p>
        ) : (
          <div className="space-y-2">
            {selected.map((id) => {
              const point = ctx.machine.points.find((p) => p.id === id);
              return (
                <div
                  key={id}
                  className="flex flex-col w-full gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {point?.label || id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {field.placeholder || "Unggah bukti lock/tag"}
                    </div>
                  </div>
                  {(field.type === "photo" || field.type === "video") && (
                    <FilePicker
                      accept={field.accept}
                      onChange={(f) => onChange({ ...(value || {}), [id]: f })}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  switch (field.type) {
    case "text":
    case "number":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <Input
            type={field.type === "number" ? "number" : "text"}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) =>
              onChange(
                field.type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center gap-2 py-2">
          <Checkbox
            id={field.id}
            checked={!!value}
            onCheckedChange={(v) => onChange(!!v)}
          />
          <label htmlFor={field.id} className="text-sm select-none">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
        </div>
      );
    case "select":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <Select onValueChange={(v) => onChange(v)} value={value || undefined}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Pilih…"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "multiselect":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const checked = (value || []).includes(o.value);
              return (
                <Button
                  type="button"
                  key={o.value}
                  variant={checked ? "default" : "outline"}
                  className={cn(
                    "h-8 rounded-full px-3",
                    checked && "bg-emerald-600 hover:bg-emerald-600",
                  )}
                  onClick={() => {
                    const set = new Set(value || []);
                    if (checked) set.delete(o.value);
                    else set.add(o.value);
                    onChange(Array.from(set));
                  }}
                >
                  {o.label}
                </Button>
              );
            })}
          </div>
        </div>
      );
    case "chips":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <Chips
            value={value || []}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        </div>
      );
    case "photo":
    case "video":
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <FilePicker accept={field.accept} onChange={(f) => onChange(f)} />
        </div>
      );
    case "table": {
      const tf = field as TableField;
      const rows: any[] = value || [];
      const addRow = () => onChange([...(rows || []), {}]);
      const removeRow = (i: number) =>
        onChange(rows.filter((_: any, idx: number) => idx !== i));
      const setCell = (i: number, key: string, v: any) => {
        const next = [...rows];
        next[i] = { ...next[i], [key]: v };
        onChange(next);
      };
      return (
        <div>
          <Label required={field.required}>{field.label}</Label>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  {tf.columns.map((c) => (
                    <TableHead key={c.id} className="text-xs">
                      {c.label}
                    </TableHead>
                  ))}
                  <TableHead className="w-[1%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).map((row, idx) => (
                  <TableRow key={`${idx}-${row.id}`}>
                    {tf.columns.map((c) => {
                      // biome-ignore lint/correctness/useHookAtTopLevel: <>
                      const colOptions = useOptions(c, ctx.machine);
                      return (
                        <TableCell key={c.id}>
                          {c.type === "text" || c.type === "number" ? (
                            <Input
                              type={c.type === "number" ? "number" : "text"}
                              placeholder={(c as any).placeholder}
                              value={row[c.id] || ""}
                              onChange={(e) =>
                                setCell(
                                  idx,
                                  c.id,
                                  c.type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value,
                                )
                              }
                            />
                          ) : c.type === "select" ? (
                            <Select
                              value={row[c.id] || undefined}
                              onValueChange={(v) => setCell(idx, c.id, v)}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    (c as any).placeholder || "Pilih…"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {colOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : c.type === "photo" || c.type === "video" ? (
                            <FilePicker
                              onChange={(f) => setCell(idx, c.id, f)}
                            />
                          ) : (
                            <Input
                              value={row[c.id] || ""}
                              onChange={(e) =>
                                setCell(idx, c.id, e.target.value)
                              }
                            />
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removeRow(idx)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={addRow}
          >
            <Layers className="h-4 w-4 mr-2" /> Tambah Baris
          </Button>
        </div>
      );
    }
    default:
      return null;
  }
}
