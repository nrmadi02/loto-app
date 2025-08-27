import {
  BarChart3,
  Clock,
  FileCheck,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description:
      "Sistem enkripsi tingkat enterprise dengan protokol keamanan berlapis untuk melindungi data sensitif perusahaan.",
  },
  {
    icon: Smartphone,
    title: "Akses Mobile",
    description:
      "Aplikasi mobile yang memungkinkan akses sistem LOTO dari mana saja, kapan saja dengan interface yang user-friendly.",
  },
  {
    icon: BarChart3,
    title: "Analitik Real-time",
    description:
      "Dashboard analitik komprehensif untuk monitoring dan evaluasi kinerja keselamatan kerja secara real-time.",
  },
  {
    icon: Users,
    title: "Manajemen Tim",
    description:
      "Kelola tim keselamatan dengan sistem role-based access dan tracking aktivitas setiap anggota tim.",
  },
  {
    icon: Clock,
    title: "Riwayat Lengkap",
    description:
      "Pencatatan dan pelacakan riwayat semua aktivitas LOTO dengan timestamp dan dokumentasi lengkap.",
  },
  {
    icon: FileCheck,
    title: "Compliance Ready",
    description:
      "Memenuhi standar keselamatan internasional dan regulasi pemerintah Indonesia untuk industri migas.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Fitur Unggulan Sistem LOTO
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Dilengkapi dengan teknologi terdepan untuk memastikan keselamatan
            kerja yang optimal di seluruh fasilitas PT Pertamina
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={`${index}-${feature.title}`}
              className="border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
