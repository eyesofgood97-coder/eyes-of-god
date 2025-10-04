"use client";

import type React from "react";
import { BentoCard } from "./ui/bento-card";

export function AnimatedFeaturesSection() {
  return (
    <section id="technology" className="relative py-20 px-4 bg-black overflow-hidden">
      {/* SVG noise background filter */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency="0.4"
              numOctaves="2"
              result="noise"
              seed="2"
              type="fractalNoise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0.02 0.04 0.06" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Technology Stack
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Built with a modern, high-performance architecture that seamlessly combines backend power,
            real-time APIs, and elegant frontend design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="md:col-span-2">
            <BentoCard
              title="FastAPI Framework"
              value="High Performance"
              subtitle="A modern Python framework designed for speed, reliability, and scalability in API development."
              colors={["#111", "#1b1b1b", "#0d0d0d"]}
              delay={0.2}
            />
          </div>
          <BentoCard
            title="PostgREST Engine"
            value="RESTful Power"
            subtitle="Automated API layer over PostgreSQL, enabling efficient, secure, and dynamic data access."
            colors={["#141414", "#202020", "#191919"]}
            delay={0.4}
          />
          <BentoCard
            title="Next.js Frontend"
            value="Interactive & SSR"
            subtitle="Cutting-edge React framework for hybrid rendering, optimized routing, and smooth UX."
            colors={["#121212", "#1f1f1f", "#181818"]}
            delay={0.6}
          />
          <div className="md:col-span-2">
            <BentoCard
              title="TailwindCSS Styling"
              value="Elegant & Adaptive"
              subtitle="Utility-first design system delivering consistent, responsive, and maintainable UI components."
              colors={["#151515", "#232323", "#1b1b1b"]}
              delay={0.8}
            />
          </div>
          <div className="md:col-span-3">
            <BentoCard
              title="Integrated Architecture"
              value="Full-Stack Synergy"
              subtitle="From backend APIs to dynamic interfaces — designed for performance, scalability, and visual harmony."
              colors={["#101010", "#202020", "#181818"]}
              delay={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
