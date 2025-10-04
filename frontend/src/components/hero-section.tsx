import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ParticleTextEffect } from "./particle-text-effect";
import { ProgressiveBlur } from "./ui/progressive-blur";

export function HeroSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex items-start justify-center pt-20">
        <ParticleTextEffect
          words={[
            "EYES OF GOD",
            "NASA SPACE CHALLENGE",
            "TEAM EYES",
            "EYES OF GOD TEAM",
          ]}
        />
      </div>

      <div className="container mx-auto text-center relative z-10 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-balance">
            Empowering discovery through{" "}
            <span className="text-gray-300">ultra-high-resolution</span> space
            imaging.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-200 text-black group"
            >
              <p className="text-lg animate-pulse">Start</p>
            </Button>
          </div>

          <div className="mt-16 mb-8">
            <div className="group relative m-auto max-w-6xl">
              <div className="flex flex-col items-center md:flex-row">
                <div className="relative py-6 md:w-[calc(100%-11rem)]">

                  <ProgressiveBlur
                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                    direction="left"
                    blurIntensity={1}
                  />
                  <ProgressiveBlur
                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                    direction="right"
                    blurIntensity={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
