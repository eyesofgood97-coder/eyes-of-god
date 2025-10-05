"use client";

export default function DescriptionSection() {
  return (
    <section
      id="description"
      className="relative py-20 px-6 bg-gradient-to-b from-[#000014] via-gray-900 to-background text-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          Eyes of God
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Eyes of God</strong> is a{" "}
          <span className="text-primary font-medium">
            visualization platform
          </span>{" "}
          that brings{" "}
          <span className="text-primary/90">
            NASA’s ultra-high-resolution satellite imagery
          </span>{" "}
          closer to everyone. Each capture reveals the vastness and hidden
          beauty of our Solar System — from the swirling storms of Jupiter to
          the dynamic patterns of our own Earth.
        </p>

        <p className="text-base md:text-lg text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
          The challenge lies in managing massive datasets: gigabytes of rich
          planetary imagery that cannot be rendered easily on standard devices.{" "}
          <br />
          Our solution is a{" "}
          <span className="text-primary font-medium">
            web-based interactive viewer
          </span>
          , optimized for{" "}
          <span className="text-primary/90 font-medium">
            performance, accessibility, and scientific exploration
          </span>
          — allowing anyone to explore NASA’s visual data in real time, from any
          device.
        </p>

        <p className="text-sm tracking-wider text-muted-foreground/70 mt-6">
          Powered by <span className="text-primary">Next.js</span> •{" "}
          <span className="text-primary">FastApi</span> •{" "}
          <span className="text-primary">Tailwindcss</span> •{" "}
          <span className="text-primary">PostgresQL</span>
        </p>
      </div>
    </section>
  );
}
