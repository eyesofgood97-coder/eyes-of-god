"use client";

import { LeLoLogo } from "./lelo-logo";

export function Footer() {
  return (
    <footer className="relative bg-black text-white border-t border-white/10 py-8 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <LeLoLogo className="h-10 w-auto mb-4" />
            <p className="text-white/70 max-w-md leading-relaxed">
              <span className="font-semibold text-primary">Eyes of God</span> is
              a web-based visualization platform developed during the{" "}
              <span className="text-primary font-medium hover:text-primary/80 transition-colors">
                NASA Space Apps Challenge 2025
              </span>
              . Designed to make{" "}
              <span className="text-primary/90">NASA’s satellite imagery</span>{" "}
              accessible, interactive, and awe-inspiring for everyone.
            </p>
            <p className="text-sm text-white/40 italic">
              “Exploring the universe — one pixel at a time.”
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4 uppercase tracking-wide">
              Technologies
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                "Next.js 15 (React)",
                "FastAPI (Python)",
                "PostgREST",
                "TailwindCSS",
                "Framer Motion",
              ].map((tech, i) => (
                <li key={i} className="hover:text-primary transition-colors">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4 uppercase tracking-wide">
              Project Links
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href="#description"
                  className="hover:text-primary transition-colors"
                >
                  About the Project
                </a>
              </li>
              <li>
                <a
                  href="#objectives"
                  className="hover:text-primary transition-colors"
                >
                  Objectives
                </a>
              </li>
              <li>
                <a
                  href="#technology"
                  className="hover:text-primary transition-colors"
                >
                  Technology Stack
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  NASA Space Apps Challenge →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center space-y-3 border-t border-white/10 pt-6">
          <p className="text-sm text-white/60">
            Designed and developed by the{" "}
            <span className="text-primary font-semibold">Eyes of God Team</span>{" "}
            during the{" "}
            <span className="text-primary/80">
              NASA Space Apps Challenge 2025
            </span>
            .
          </p>
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-semibold">Eyes of God</span>. All
            rights reserved.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent animate-pulse" />
    </footer>
  );
}
