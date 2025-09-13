import { Separator } from "@/components/ui/separator";
import ProcessForm from "./components/process-form";

export default function MachineProcessContainer() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Proses LOTO Mesin
          </h1>
          <p className="text-muted-foreground">Proses LOTO mesin</p>
        </div>
      </div>
      <Separator className="my-2" />
      <ProcessForm />
    </div>
  );
}
