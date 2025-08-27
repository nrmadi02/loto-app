import type { Metadata } from "next";
import { BenefitsSection } from "@/features/landing-page/components/benefits-section";
import { FeaturesSection } from "@/features/landing-page/components/feature-section";
import { Footer } from "@/features/landing-page/components/footer";
import { HeroSection } from "@/features/landing-page/components/hero-section";
import { Navigation } from "@/features/landing-page/components/navigation";

export const metadata: Metadata = {
  title: "Sistem LOTO - PT Pertamina",
  description:
    "Sistem LOTO digital untuk meningkatkan keselamatan kerja di PT Pertamina",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
