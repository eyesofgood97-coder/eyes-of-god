import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Eyes of God",
  description:
    "A web application that allows users to explore and visualize high-resolution images captured by NASA’s observatories — Project Eye of God.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
