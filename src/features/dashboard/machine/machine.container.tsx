import ListMachine from "./components/list-machine";

export default function MachineContainer() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daftar Mesin</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau status semua mesin di fasilitas
          </p>
        </div>
      </div>
      <ListMachine />
    </div>
  );
}
