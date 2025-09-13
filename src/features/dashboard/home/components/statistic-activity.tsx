import { Activity, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StatisticActivity() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>
                Aktivitas LOTO terbaru dari semua mesin
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ringkasan Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Operasional</span>
            <span className="font-medium">18</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Terkunci</span>
            <span className="font-medium">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nol Energi</span>
            <span className="font-medium">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Perbaikan</span>
            <span className="font-medium">2</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
