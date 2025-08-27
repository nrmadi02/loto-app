import { Mail, MapPin, Phone, Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">
                LOTO System
              </span>
            </div>
            <p className="text-muted-foreground mb-4 text-pretty">
              Sistem Lockout Tagout digital yang dikembangkan khusus untuk PT
              Pertamina, memastikan keselamatan kerja dengan standar
              internasional dan teknologi terdepan.
            </p>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PT Pertamina. Semua hak dilindungi
              undang-undang.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Manfaat
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  loto-support@pertamina.com
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  +62 21 3815 5555
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Banjarmasin
                  <br />
                  Kalimantan Selatan 70110
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              Dikembangkan dengan komitmen terhadap keselamatan kerja terbaik
            </div>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
