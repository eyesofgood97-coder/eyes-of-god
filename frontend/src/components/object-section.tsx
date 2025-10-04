"use client";

export default function ObjectSection() {
  return (
    <section
      id="object"
      className="relative py-24 px-6 bg-background text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center space-y-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          Project Objectives
        </h2>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The{" "}
          <span className="font-semibold text-primary transition-colors duration-300">
            Eyes of God
          </span>{" "}
          project seeks to merge{" "}
          <span className="text-primary/90 group-hover:text-primary transition duration-300">
            cutting-edge visualization
          </span>{" "}
          with{" "}
          <span className="text-primary/90 group-hover:text-primary transition duration-300">
            scientific exploration
          </span>
          , offering a web-based experience that lets anyone explore NASA’s vast
          collection of{" "}
          <span className="text-primary/90 group-hover:text-primary transition duration-300">
            ultra-high-resolution imagery
          </span>{" "}
          with elegance and precision — accessible from any device, anywhere.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-left mt-14">
          {[
            {
              icon: "🌍",
              title: "Responsive Design",
              desc: (
                <>
                  A fully responsive architecture that adapts seamlessly to{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    every device and resolution
                  </span>
                  , ensuring users experience the same clarity whether on a
                  smartphone or a 4K monitor while maintaining{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    visual integrity
                  </span>{" "}
                  across all screens.
                </>
              ),
            },
            {
              icon: "🎨",
              title: "Visual Appeal",
              desc: (
                <>
                  Designed with{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    balanced colors
                  </span>{" "}
                  and refined typography inspired by NASA’s aesthetic, creating
                  a{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    futuristic and immersive interface
                  </span>{" "}
                  that reflects the grandeur of space exploration.
                </>
              ),
            },
            {
              icon: "🖼️",
              title: "High-Quality Graphics",
              desc: (
                <>
                  Integrates{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    lossless imagery rendering
                  </span>{" "}
                  and smooth zoom transitions, preserving detail on every
                  planetary surface for{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    scientific clarity and realism
                  </span>
                  .
                </>
              ),
            },
            {
              icon: "⚙️",
              title: "Scalable Performance",
              desc: (
                <>
                  Uses efficient data handling and{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    progressive loading
                  </span>{" "}
                  to handle gigabytes of imagery without losing speed or
                  smoothness, powered by{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    optimized caching
                  </span>
                  .
                </>
              ),
            },
            {
              icon: "🧭",
              title: "Intuitive Navigation",
              desc: (
                <>
                  A navigation model inspired by{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    orbital motion
                  </span>
                  , guiding users smoothly through celestial datasets for{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    effortless exploration
                  </span>{" "}
                  of planets, moons, and stars.
                </>
              ),
            },
            {
              icon: "💡",
              title: "Innovation & Accessibility",
              desc: (
                <>
                  Combines{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    Next.js, FastAPI, PostgREST, and TailwindCSS
                  </span>{" "}
                  to create a platform that’s both{" "}
                  <span className="text-primary/90 group-hover:text-primary transition duration-300">
                    scalable and inclusive
                  </span>{" "}
                  — accessible for everyone, regardless of device performance or
                  connection speed.
                </>
              ),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-border bg-card/40 
                         hover:bg-card/80 hover:shadow-[0_0_25px_var(--color-primary)] 
                         transition-all duration-500 ease-out overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2 transition-colors group-hover:text-primary/80">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground/90 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
