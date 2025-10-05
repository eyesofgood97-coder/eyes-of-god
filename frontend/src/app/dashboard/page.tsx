"use client";
import { useState } from "react";
import MainVisualization from "./main-visualization";
import ControlPanel from "./control-panel";

export default function DashboardPage() {
  const [layer, setLayer] = useState(3);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      <MainVisualization layer={layer} />
      <ControlPanel layer={layer} setLayer={setLayer} />
    </div>
  );
}