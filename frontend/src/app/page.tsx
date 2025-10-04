import { AnimatedFeaturesSection } from "@/components/animated-features-section";
import DescriptionSection from "@/components/description-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import ObjectSection from "@/components/object-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <DescriptionSection />
        <ObjectSection />
        <AnimatedFeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
