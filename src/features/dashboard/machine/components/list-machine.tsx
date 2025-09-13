"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  MapPin,
  Play,
  Settings,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FilterMachine from "./filter-machine";

const machines = [
  {
    id: "M001",
    code: "P-101",
    name: "Pompa Sentrifugal P-101",
    location: "Unit Produksi A",
    status: "OPERASIONAL",
    lastActivity: "2 jam yang lalu",
    operator: "Ahmad Rizki",
    isolationPoints: 3,
    description:
      "Pompa untuk transfer crude oil dari tangki storage ke unit distilasi",
  },
  {
    id: "M002",
    code: "K-201",
    name: "Kompresor K-201",
    location: "Unit Produksi B",
    status: "LOCKED_OUT",
    lastActivity: "4 jam yang lalu",
    operator: "Siti Nurhaliza",
    isolationPoints: 5,
    description: "Kompresor udara untuk sistem pneumatik unit produksi",
  },
  {
    id: "M003",
    code: "HE-301",
    name: "Heat Exchanger HE-301",
    location: "Unit Produksi C",
    status: "ZERO_OK",
    lastActivity: "6 jam yang lalu",
    operator: "Budi Santoso",
    isolationPoints: 2,
    description: "Heat exchanger untuk pendinginan produk akhir",
  },
  {
    id: "M004",
    code: "T-401",
    name: "Tangki Storage T-401",
    location: "Area Storage",
    status: "REPAIR",
    lastActivity: "1 hari yang lalu",
    operator: "Dewi Sartika",
    isolationPoints: 4,
    description: "Tangki penyimpanan bahan baku dengan kapasitas 10,000 liter",
  },
  {
    id: "M005",
    code: "R-501",
    name: "Reaktor R-501",
    location: "Unit Produksi A",
    status: "OPERASIONAL",
    lastActivity: "2 hari yang lalu",
    operator: "Eko Prasetyo",
    isolationPoints: 8,
    description: "Reaktor utama untuk proses katalitik cracking",
  },
  {
    id: "M006",
    code: "F-601",
    name: "Furnace F-601",
    location: "Unit Produksi B",
    status: "OPERASIONAL",
    lastActivity: "3 hari yang lalu",
    operator: "Maya Sari",
    isolationPoints: 6,
    description: "Furnace untuk pemanasan awal dalam proses distilasi",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "OPERASIONAL":
      return {
        badge: (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Operasional
          </Badge>
        ),
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        color: "border-green-200",
        actions: [
          { label: "Mulai LOTO", variant: "default" as const, icon: Play },
        ],
      };
    case "LOCKED_OUT":
      return {
        badge: (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Terkunci
          </Badge>
        ),
        icon: <Lock className="h-5 w-5 text-yellow-600" />,
        color: "border-yellow-200",
        actions: [
          { label: "Mulai LOTO", variant: "default" as const, icon: Play },
        ],
      };
    case "ZERO_OK":
      return {
        badge: (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Nol Energi
          </Badge>
        ),
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
        color: "border-blue-200",
        actions: [
          { label: "Mulai LOTO", variant: "default" as const, icon: Play },
        ],
      };
    case "REPAIR":
      return {
        badge: (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Perbaikan
          </Badge>
        ),
        icon: <Wrench className="h-5 w-5 text-orange-600" />,
        color: "border-orange-200",
        actions: [
          { label: "Mulai LOTO", variant: "default" as const, icon: Play },
        ],
      };
    default:
      return {
        badge: <Badge variant="secondary">{status}</Badge>,
        icon: <AlertTriangle className="h-5 w-5 text-gray-600" />,
        color: "border-gray-200",
        actions: [],
      };
  }
};

export default function ListMachine() {
  return (
    <div className="space-y-6">
      <FilterMachine />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {machines.map((machine) => {
          const statusConfig = getStatusConfig(machine.status);
          return (
            <Card
              key={machine.id}
              className={`${statusConfig.color} hover:shadow-md transition-shadow h-full flex flex-col`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {statusConfig.icon}
                    <div>
                      <CardTitle className="text-lg">{machine.code}</CardTitle>
                      <CardDescription className="font-medium text-foreground">
                        {machine.name}
                      </CardDescription>
                    </div>
                  </div>
                  {statusConfig.badge}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  {machine.description}
                </p>

                <div className="grid  grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {machine.location}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {machine.operator}
                    </span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {machine.isolationPoints} titik isolasi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {machine.lastActivity}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                  {statusConfig.actions.map((action, index) => (
                    <Button
                      key={`${action.label}-${index}`}
                      variant={action.variant}
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/machine/process/${machine.id}`}>
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
