import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  FormFieldBase,
  SAMPLE_MACHINE,
  TableColumn,
} from "../types/machine.type";

export function useOptions(
  field: FormFieldBase | TableColumn,
  machine: typeof SAMPLE_MACHINE,
) {
  return useMemo(() => {
    if (field.optionsSource === "machine.points") {
      return machine.points.map((p) => ({ value: p.id, label: p.label }));
    }
    return (field.options || []).map((o) => ({ value: o, label: o }));
  }, [field, machine]);
}

export function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-sm font-medium mb-1",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
      )}
    >
      {children}
    </div>
  );
}

export function Chips({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value?.map((c, i) => (
          <Badge key={`${c}`} variant="secondary" className="gap-1">
            {c}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => onChange(value.filter((_, ix) => ix !== i))}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder={placeholder || "Ketik lalu Enter"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            e.preventDefault();
            onChange([...(value || []), text.trim()]);
            setText("");
          }
        }}
      />
    </div>
  );
}

export function FilePicker({
  accept,
  onChange,
}: {
  accept?: string[];
  onChange: (f: File | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept={accept?.join(",")}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
