/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Grid,
  PanelRightClose,
  PanelRightOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function ControlPanel({
  layer,
  setLayer,
  row,
  setRow,
  col,
  setCol,
}: any) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 flex items-center justify-center rounded-full p-3 
        bg-gradient-to-r from-primary to-primary/80 text-background shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isOpen ? (
          <PanelRightClose className="w-5 h-5" />
        ) : (
          <PanelRightOpen className="w-5 h-5" />
        )}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card/95 backdrop-blur-md border-l border-border transition-transform duration-500 ease-in-out z-40 rounded-l-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="text-primary w-5 h-5" />
              <h2 className="font-bold text-lg">Capa {layer}</h2>
            </div>
            <Badge variant="outline">Mars Tiles</Badge>
          </div>

          {/* Control de capa */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Capa
            </h3>
            <Slider
              value={[layer]}
              onValueChange={(v) => setLayer(v[0])}
              min={0}
              max={7}
              step={1}
            />
          </div>

          {/* Fila y columna */}
          <div className="space-y-4">
            <Card className="p-3 flex flex-col items-center gap-2">
              <Grid className="text-primary" />
              <div className="flex flex-col gap-2 items-center">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setRow((r: number) => Math.max(0, r - 1))}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCol((c: number) => Math.max(0, c - 1))}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-mono text-muted-foreground">
                    F:{row} | C:{col}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCol((c: number) => c + 1)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setRow((r: number) => r + 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
