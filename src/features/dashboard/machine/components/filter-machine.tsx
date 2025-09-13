import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FilterMachine() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1 bg-white rounded-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan kode atau nama mesin..."
          className="pl-10"
        />
      </div>
    </div>
  );
}
