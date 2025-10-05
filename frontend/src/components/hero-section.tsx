import { Button } from "./ui/button";
import { ParticleTextEffect } from "./particle-text-effect";
import { StartButton } from "./gradient-wave-button";

export function HeroSection() {
  return (
    <section
      id="home"
      className="py-20 px-4 relative overflow-hidden min-h-screen flex flex-col justify-between"
    >
      <div className="flex-1 flex items-start justify-center pt-20">
        <ParticleTextEffect words={["EYES OF GOD"]} />
      </div>

      <div className="container mx-auto text-center relative z-10 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
            High-Performance{" "}
            <span className="text-muted-foreground">Rendering System</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-12">
            <StartButton label="Start system" />
          </div>
        </div>
      </div>
    </section>
  );
}
