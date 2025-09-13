import {
  AlertTriangle,
  BatteryWarning,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Mesin",
    value: "24",
    description: "+2 dari bulan lalu",
    icon: Wrench,
    color: "text-primary",
    trend: "+8.2%",
  },
  {
    title: "Operasional",
    value: "18",
    description: "Mesin beroperasi normal",
    icon: CheckCircle,
    color: "text-green-600",
    trend: "75%",
  },
  {
    title: "Terkunci",
    value: "4",
    description: "Mesin terkunci",
    icon: Clock,
    color: "text-yellow-600",
    trend: "16.7%",
  },
  {
    title: "Nol Energi",
    value: "2",
    description: "Mesin tidak memiliki sumber daya",
    icon: BatteryWarning,
    color: "text-grey-600",
    trend: "8.3%",
  },
  {
    title: "Perbaikan",
    value: "2",
    description: "Memerlukan perbaikan",
    icon: AlertTriangle,
    color: "text-red-600",
    trend: "8.3%",
  },
];

export default function StatisticCount() {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
