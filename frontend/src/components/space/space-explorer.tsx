'use client'

import { useState } from 'react'
import SpaceRender from '@/components/space/space-render'

interface TileMetadata {
  path: string
  size: number
  hash: string
  position: {
    col: number
    row: number
    x: number
    y: number
  }
  dimensions: {
    width: number
    height: number
  }
  content: {
    avg_brightness: number
    is_empty: boolean
    has_content: boolean
    original_coords: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  url: string
}

export default function SpaceExplorer() {
  const [selectedTile, setSelectedTile] = useState<TileMetadata | null>(null)

  return (
    <SpaceRender
      tilesBasePath="/tiles/andromeda"
      initialZoom={2}
      showDebugInfo={true}
      onTileClick={(tileMetadata, zoomLevel) => {
        console.log('Tile clicked:', tileMetadata)
        console.log('Zoom level:', zoomLevel)
        setSelectedTile(tileMetadata)
      }}
      onTileHover={(tileMetadata, zoomLevel) => {
        if (tileMetadata) {
          console.log('Hovering tile at:', tileMetadata.position)
        }
      }}
    >
      {/* Panel lateral de información cuando se selecciona un tile */}
      {selectedTile && (
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-cyan-400/50 text-white z-50 max-w-md">
          <button
            onClick={() => setSelectedTile(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Detalle del Tile</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Posición en Grid:</span>
              <div className="font-mono mt-1">
                Columna: {selectedTile.position.col} | Fila: {selectedTile.position.row}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Coordenadas en Imagen Original:</span>
              <div className="font-mono mt-1">
                X: {selectedTile.content.original_coords.x}px
                <br />
                Y: {selectedTile.content.original_coords.y}px
                <br />
                Tamaño: {selectedTile.content.original_coords.width}x{selectedTile.content.original_coords.height}px
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Análisis de Contenido:</span>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: selectedTile.content.is_empty ? '#ef4444' : '#10b981' 
                    }}
                  />
                  <span>{selectedTile.content.is_empty ? 'Tile vacío' : 'Contiene datos'}</span>
                </div>
                <div className="mt-2">
                  Brillo promedio: {selectedTile.content.avg_brightness.toFixed(2)}/255
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${(selectedTile.content.avg_brightness / 255) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Información del Archivo:</span>
              <div className="font-mono mt-1 text-xs">
                Tamaño: {(selectedTile.size / 1024).toFixed(2)} KB
                <br />
                Hash: {selectedTile.hash}
                <br />
                Ruta: {selectedTile.path}
              </div>
            </div>
          </div>
        </div>
      )}
    </SpaceRender>
  )
}