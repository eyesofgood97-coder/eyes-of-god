import { AnimatedFeaturesSection } from "@/components/animated-features-section";
import DescriptionSection from "@/components/description-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import ObjectSection from "@/components/object-section";
import TeamSection from "@/components/team-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection />
      <DescriptionSection />
      <ObjectSection />
      <AnimatedFeaturesSection />
      <TeamSection />

      <Footer />
    </div>
  );
}
