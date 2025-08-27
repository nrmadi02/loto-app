import { Award, Clock, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: TrendingUp,
    title: "Peningkatan Produktivitas",
    description:
      "Mengurangi waktu downtime hingga 40% dengan prosedur LOTO yang lebih efisien dan terotomatisasi.",
    metric: "40%",
  },
  {
    icon: Shield,
    title: "Zero Accident Goal",
    description:
      "Mendukung target zero accident dengan sistem monitoring dan alert yang komprehensif.",
    metric: "0",
  },
  {
    icon: Clock,
    title: "Penghematan Waktu",
    description:
      "Mempercepat proses dokumentasi dan reporting keselamatan hingga 60% lebih cepat.",
    metric: "60%",
  },
  {
    icon: Award,
    title: "Compliance Rate",
    description:
      "Mencapai tingkat kepatuhan 99% terhadap standar keselamatan internasional.",
    metric: "99%",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Manfaat Nyata untuk Perusahaan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Hasil terukur yang telah dirasakan oleh berbagai unit kerja PT
            Pertamina dalam implementasi sistem LOTO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={`${index}-${benefit.title}`}
              className="text-center border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="pt-8 pb-6">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {benefit.metric}
                  {benefit.metric !== "0" && benefit.metric !== "99%"
                    ? ""
                    : benefit.metric === "0"
                    ? " Kecelakaan"
                    : ""}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto border border-border">
            <CardContent className="pt-8 pb-6 text-center">
              <blockquote className="text-xl italic text-muted-foreground mb-6 text-pretty">
                "Implementasi sistem LOTO digital telah mengubah cara kami
                mengelola keselamatan kerja. Prosedur yang sebelumnya memakan
                waktu berjam-jam, kini dapat diselesaikan dalam hitungan menit
                dengan akurasi yang lebih tinggi."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <div className="font-semibold text-foreground">
                    Budi Santoso
                  </div>
                  <div className="text-sm text-muted-foreground">
                    HSE Manager, PT Pertamina RU IV Cilacap
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
