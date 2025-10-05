/* eslint-disable @next/next/no-img-element */
"use client";

export default function MainVisualization({ layer }: { layer: number }) {
  // cantidad de tiles por lado = 2^layer
  const size = Math.pow(2, layer);

  // construir matriz de URLs
  const tiles: string[][] = [];
  for (let r = 0; r < size; r++) {
    const row: string[] = [];
    for (let c = 0; c < size; c++) {
      row.push(
        `https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0//default/default028mm/${layer}/${r}/${c}.jpg`
      );
    }
    tiles.push(row);
  }

  return (
    <div className="relative flex-1 overflow-auto h-screen bg-black">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-slate-900" />

      {/* Mosaico completo */}
      <div
        className="relative grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: "fit-content",
        }}
      >
        {tiles.map((row, r) =>
          row.map((url, c) => (
            <img
              key={`${r}-${c}`}
              src={url}
              alt={`L${layer} R${r} C${c}`}
              loading="lazy"
              className="object-cover w-32 h-32 border border-black/50"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
              }}
            />
          ))
        )}
      </div>

      {/* Info */}
      <div className="fixed bottom-4 right-4 bg-black/60 text-white text-sm p-2 rounded-md font-mono">
        Capa {layer} — {size} × {size} tiles ({size * size} total)
      </div>
    </div>
  );
}
