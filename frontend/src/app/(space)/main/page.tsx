'use client'

import SpaceExplorer from "@/components/space/space-explorer"

export default function App() {
  return (
    <div className="w-screen h-screen">
      <SpaceExplorer isAdmin={false} />
    </div>
  )
}