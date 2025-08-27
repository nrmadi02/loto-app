import { AlertTriangle, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Icons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 bg-secondary/10 rounded-full">
              <Lock className="h-8 w-8 text-secondary" />
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Sistem LOTO
            <span className="block text-primary">PT Pertamina</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Keselamatan Kerja Terdepan dengan Sistem Lockout Tagout yang
            Terintegrasi dan Terpercaya
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Lindungi pekerja dan aset perusahaan dengan sistem LOTO digital yang
            memastikan prosedur keselamatan dilaksanakan dengan benar dan
            terdokumentasi secara real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="#features">Pelajari Lebih Lanjut</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent"
              asChild
            >
              <Link href="/signup">Mulai Sekarang</Link>
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Dipercaya oleh</p>
            <div className="flex justify-center items-center">
              <div className="text-2xl font-bold text-primary">
                PT PERTAMINA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
