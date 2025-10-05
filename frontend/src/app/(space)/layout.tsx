import type React from "react"
import type { Metadata } from "next"
import SpaceExplorer from "@/components/space/space-explorer"

export const metadata: Metadata = {
  title: "Eyes of God - Space App",
  description:
    "A web application that allows users to explore and visualize high-resolution images captured by NASA's observatories — Project Eye of God.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-screen h-screen">
      <SpaceExplorer />
      
      {/* Children se pueden renderizar como overlay adicional si es necesario */}
      <div className="absolute top-20 right-6 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  )
}