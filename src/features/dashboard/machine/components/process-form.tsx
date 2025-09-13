"use client";

import type { MachineStatus } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  ListChecks,
  Lock,
  Wrench,
} from "lucide-react";
import { type JSX, useState } from "react";
import type { TransitionKey } from "@/app/api/[[...route]]/schema/loto.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ALLOWED, PROCEDURES, SAMPLE_MACHINE } from "../types/machine.type";
import DynamicForm from "./dynamic-form";

const STATUS_ICON: Record<MachineStatus, JSX.Element> = {
  OPERASIONAL: <BadgeCheck className="text-emerald-600" />,
  LOCKED_OUT: <Lock className="text-red-600" />,
  ZERO_OK: <Check className="text-emerald-600" />,
  REPAIR: <Wrench className="text-amber-600" />,
};

const STATUS_LABEL: Record<MachineStatus, string> = {
  OPERASIONAL: "Operasional",
  LOCKED_OUT: "Terkunci (LOTO)",
  ZERO_OK: "Nol Energi (Terverifikasi)",
  REPAIR: "Perbaikan",
};

function TransitionPicker({
  from,
  onPick,
}: {
  from: MachineStatus;
  onPick: (k: TransitionKey) => void;
}) {
  const targets = ALLOWED[from];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {targets.map((to) => (
        <Button
          key={to}
          variant="outline"
          size="lg"
          className="justify-between h-[60px]"
          onClick={() => onPick(`${from}->${to}` as TransitionKey)}
        >
          <span className="text-left">
            <span className="block text-xs text-muted-foreground">Menuju</span>
            <span className="font-medium">{STATUS_LABEL[to]}</span>
          </span>
          <ArrowRight className="h-4 w-4 opacity-70" />
        </Button>
      ))}
    </div>
  );
}

export default function ProcessForm() {
  const [machine, setMachine] = useState(SAMPLE_MACHINE);
  const [transition, setTransition] = useState<TransitionKey>(
    "OPERASIONAL->LOCKED_OUT",
  );
  const spec = PROCEDURES[transition];
  const [last, setLast] = useState<any | null>(null);

  const doSubmit = (payload: Record<string, any>) => {
    setLast({ transition, outputStatus: spec.outputStatus, payload });
    setMachine((m) => ({ ...m, status: spec.outputStatus as MachineStatus }));
    const next = ALLOWED[spec.outputStatus as MachineStatus]?.[0];
    if (next) setTransition(`${spec.outputStatus}->${next}` as TransitionKey);
  };

  return (
    <div className="py-8 pt-3">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded-2xl border grid place-items-center">
              {STATUS_ICON[machine.status]}
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase">
                Mesin
              </div>
              <div className="text-xl font-semibold">
                {machine.code} — {machine.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {machine.location}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Status: {STATUS_LABEL[machine.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Points + Transition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Titik Isolasi
              </CardTitle>
              <CardDescription>
                Panduan ringkas titik energi pada mesin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-64 pr-2">
                <div className="space-y-2">
                  {machine.points.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border rounded-xl px-3 py-2"
                    >
                      <div>
                        <div className="text-sm font-medium">{p.label}</div>
                        <div className="text-xs text-muted-foreground">
                          Energi: {p.energyType}
                        </div>
                      </div>
                      <Lock className="h-4 w-4 opacity-50" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <Separator className="my-2" />
            <CardFooter className="flex-col items-stretch gap-2">
              <div className="text-sm font-medium mb-1">Pilih Transisi</div>
              <TransitionPicker
                from={machine.status}
                onPick={(k) => setTransition(k)}
              />
            </CardFooter>
          </Card>

          {/* Right column: Form + Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" /> {spec.title}
                </CardTitle>
                <CardDescription>
                  Isi form sesuai prosedur untuk menerapkan status berikutnya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm
                  spec={spec}
                  machine={machine}
                  onSubmit={doSubmit}
                />
              </CardContent>
            </Card>

            {last && (
              <Card>
                <CardHeader>
                  <CardTitle>Payload Terakhir (simulasi)</CardTitle>
                  <CardDescription>
                    Ini contoh data yang akan dikirim ke API
                    /machines/:id/transition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs rounded-lg bg-neutral-950 text-neutral-100 p-4 overflow-auto">
                    {JSON.stringify(last, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
