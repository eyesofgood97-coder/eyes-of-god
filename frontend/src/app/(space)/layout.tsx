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
    <SpaceRender>
      {children}
    </SpaceRender>
  );
}
