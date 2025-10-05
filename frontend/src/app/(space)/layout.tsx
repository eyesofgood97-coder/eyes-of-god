import type React from "react"
import type { Metadata } from "next"
import SpaceRender from "@/components/space/space-render";

export const metadata: Metadata = {
  title: "Eyes of God - Space App",
  description:
    "A web application that allows users to explore and visualize high-resolution images captured by NASA’s observatories — Project Eye of God.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-screen h-screen">
      <SpaceRender
        tilesBasePath="/tiles/andromeda"
        initialZoom={2}
        showDebugInfo={true}
      >
        <div className="absolute top-20 right-6 z-50">
          {children}
        </div>
      </SpaceRender>
    </div>
  );
}
