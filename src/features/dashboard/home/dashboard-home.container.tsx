import StatisticActivity from "./components/statistic-activity";
import StatisticCount from "./components/statistic-count";

export default function DashboardHomeContainer() {
  return (
    <div className="space-y-8 container mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Selamat Datang di Dashboard LOTO
          </h1>
          <p className="text-muted-foreground">
            Pantau status mesin dan aktivitas LOTO secara real-time di PT
            Pertamina
          </p>
        </div>
      </div>
      <StatisticCount />
      <StatisticActivity />
    </div>
  );
}
