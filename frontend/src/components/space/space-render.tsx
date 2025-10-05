/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'

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

interface Metadata {
  version: string
  generated_at: string
  source_image: string
  tile_size: number
  format: string
  quality: number
  zoom_levels: Array<{
    level: number
    width: number
    height: number
    cols: number
    rows: number
    tiles: number
    scale_factor: number
  }>
  total_tiles: number
  original_dimensions: {
    width: number
    height: number
    total_pixels: number
    megapixels: number
    gigapixels?: number
  }
  spatial_data?: any
  celestial_object?: {
    name: string
    type: string
    catalog_id?: string
    alternative_names?: string[]
    constellation?: string
    magnitude?: number
  }
  capture_info?: any
  tags?: string[]
  description?: string
  visibility?: string
  scientific_data?: any
  bounds: {
    width: number
    height: number
    center: {
      x: number
      y: number
    }
  }
  tiles: {
    [zoomLevel: string]: {
      [row: string]: {
        [col: string]: TileMetadata
      }
    }
  }
}

interface SpaceRenderProps {
  children?: React.ReactNode
  tilesBasePath: string
  metadataUrl?: string
  initialZoom?: number
  showDebugInfo?: boolean
  onTileClick?: (tileMetadata: TileMetadata, zoomLevel: number) => void
  onTileHover?: (tileMetadata: TileMetadata | null, zoomLevel: number) => void
}

const SpaceRender = ({ 
  children,
  tilesBasePath,
  metadataUrl,
  initialZoom = 0,
  showDebugInfo = false,
  onTileClick,
  onTileHover
}: SpaceRenderProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [zoom, setZoom] = useState(initialZoom)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [visibleTiles, setVisibleTiles] = useState<Set<string>>(new Set())
  const [hoveredTile, setHoveredTile] = useState<TileMetadata | null>(null)

  // Cargar metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true)
        const url = metadataUrl || `${tilesBasePath}/metadata.json`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Error al cargar metadata: ${response.statusText}`)
        }
        
        const data: Metadata = await response.json()
        setMetadata(data)
        
        setZoom(initialZoom)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setLoading(false)
        console.error('Error cargando metadata:', err)
      }
    }

    loadMetadata()
  }, [tilesBasePath, metadataUrl, initialZoom])

  // Centrar imagen cuando metadata está lista
  useEffect(() => {
    if (!metadata || !canvasRef.current) return
    
    const container = canvasRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    const zoomLevelData = metadata.zoom_levels[zoom]
    if (!zoomLevelData) return
    
    setPosition({
      x: (containerWidth - zoomLevelData.width) / 2,
      y: (containerHeight - zoomLevelData.height) / 2
    })
  }, [metadata, zoom])

  // Calcular qué tiles son visibles
  const calculateVisibleTiles = useCallback(() => {
    if (!canvasRef.current || !metadata) return new Set<string>()

    const container = canvasRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const zoomLevelData = metadata.zoom_levels[zoom]
    if (!zoomLevelData) return new Set<string>()

    const tileSize = metadata.tile_size

    const startCol = Math.max(0, Math.floor(-position.x / tileSize))
    const endCol = Math.min(zoomLevelData.cols - 1, Math.ceil((containerWidth - position.x) / tileSize))
    const startRow = Math.max(0, Math.floor(-position.y / tileSize))
    const endRow = Math.min(zoomLevelData.rows - 1, Math.ceil((containerHeight - position.y) / tileSize))

    const tiles = new Set<string>()
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        tiles.add(`${zoom}-${row}-${col}`)
      }
    }

    return tiles
  }, [zoom, position, metadata])

  useEffect(() => {
    const tiles = calculateVisibleTiles()
    setVisibleTiles(tiles)
  }, [calculateVisibleTiles])

  // Obtener metadata del tile
  const getTileMetadata = useCallback((zoomLevel: number, row: number, col: number): TileMetadata | null => {
    if (!metadata?.tiles?.[zoomLevel]?.[row]?.[col]) return null
    return metadata.tiles[zoomLevel][row][col]
  }, [metadata])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    
    if (!canvasRef.current || !metadata) return

    const container = canvasRef.current
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const delta = e.deltaY > 0 ? -1 : 1
    const maxZoom = metadata.zoom_levels.length - 1
    const newZoom = Math.max(0, Math.min(maxZoom, zoom + delta))

    if (newZoom !== zoom) {
      const oldZoomData = metadata.zoom_levels[zoom]
      const newZoomData = metadata.zoom_levels[newZoom]
      
      if (!oldZoomData || !newZoomData) return

      const scale = newZoomData.width / oldZoomData.width
      const newX = mouseX - (mouseX - position.x) * scale
      const newY = mouseY - (mouseY - position.y) * scale

      setZoom(newZoom)
      setPosition({ x: newX, y: newY })
    }
  }, [zoom, position, metadata])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }, [position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return

    e.preventDefault()
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    setPosition({ x: newX, y: newY })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    }
  }, [position])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    e.preventDefault()
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y

    setPosition({ x: newX, y: newY })
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  const getTileUrl = (zoomLevel: number, row: number, col: number): string => {
    if (!metadata) return ''
    
    const ext = metadata.format === 'JPEG' ? 'jpg' : 
                metadata.format === 'PNG' ? 'png' : 
                metadata.format === 'WEBP' ? 'webp' : 'jpg'
    
    return `${tilesBasePath}/${zoomLevel}/${row}/${col}.${ext}`
  }

  const resetView = useCallback(() => {
    if (!metadata || !canvasRef.current) return
    
    setZoom(initialZoom)
    
    const container = canvasRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    const zoomLevelData = metadata.zoom_levels[initialZoom]
    if (!zoomLevelData) return
    
    setPosition({
      x: (containerWidth - zoomLevelData.width) / 2,
      y: (containerHeight - zoomLevelData.height) / 2
    })
  }, [metadata, initialZoom])

  const handleZoomIn = useCallback(() => {
    if (!metadata) return
    const maxZoom = metadata.zoom_levels.length - 1
    if (zoom < maxZoom) {
      const newZoom = zoom + 1
      const oldZoomData = metadata.zoom_levels[zoom]
      const newZoomData = metadata.zoom_levels[newZoom]
      
      if (!oldZoomData || !newZoomData || !canvasRef.current) return

      const container = canvasRef.current
      const centerX = container.clientWidth / 2
      const centerY = container.clientHeight / 2

      const scale = newZoomData.width / oldZoomData.width
      const newX = centerX - (centerX - position.x) * scale
      const newY = centerY - (centerY - position.y) * scale

      setZoom(newZoom)
      setPosition({ x: newX, y: newY })
    }
  }, [zoom, metadata, position])

  const handleZoomOut = useCallback(() => {
    if (!metadata) return
    if (zoom > 0) {
      const newZoom = zoom - 1
      const oldZoomData = metadata.zoom_levels[zoom]
      const newZoomData = metadata.zoom_levels[newZoom]
      
      if (!oldZoomData || !newZoomData || !canvasRef.current) return

      const container = canvasRef.current
      const centerX = container.clientWidth / 2
      const centerY = container.clientHeight / 2

      const scale = newZoomData.width / oldZoomData.width
      const newX = centerX - (centerX - position.x) * scale
      const newY = centerY - (centerY - position.y) * scale

      setZoom(newZoom)
      setPosition({ x: newX, y: newY })
    }
  }, [zoom, metadata, position])

  // Manejar click en tile
  const handleTileClick = useCallback((tileMetadata: TileMetadata) => {
    if (onTileClick) {
      onTileClick(tileMetadata, zoom)
    }
  }, [onTileClick, zoom])

  // Manejar hover en tile
  const handleTileHover = useCallback((tileMetadata: TileMetadata | null) => {
    setHoveredTile(tileMetadata)
    if (onTileHover) {
      onTileHover(tileMetadata, zoom)
    }
  }, [onTileHover, zoom])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-lg">Cargando imagen del espacio...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tiles</p>
        </div>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl mb-2">Error al cargar la imagen</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const currentZoomData = metadata.zoom_levels[zoom]
  const tileSize = metadata.tile_size

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-black cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      {/* Capa de fondo del espacio */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0e27] to-[#1a1f3a]"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 90%, white, transparent)
          `,
          backgroundSize: '200% 200%',
          backgroundPosition: '50% 50%'
        }}
      />

      {/* Contenedor de tiles */}
      <div
        className="absolute"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          willChange: 'transform',
          imageRendering: 'auto'
        }}
      >
        {Array.from(visibleTiles).map((tileKey) => {
          const [z, row, col] = tileKey.split('-').map(Number)
          const tileMetadata = getTileMetadata(z, row, col)
          
          return (
            <div
              key={tileKey}
              className="absolute group"
              style={{
                left: col * tileSize,
                top: row * tileSize,
                width: tileSize,
                height: tileSize
              }}
              onClick={() => tileMetadata && handleTileClick(tileMetadata)}
              onMouseEnter={() => tileMetadata && handleTileHover(tileMetadata)}
              onMouseLeave={() => handleTileHover(null)}
            >
              <img
                src={getTileUrl(z, row, col)}
                alt={`Tile ${tileKey}`}
                className="w-full h-full"
                style={{
                  imageRendering: 'auto',
                  display: 'block'
                }}
                loading="lazy"
                draggable={false}
                onError={(e) => {
                  console.error(`Error cargando tile: ${getTileUrl(z, row, col)}`)
                  ;(e.target as HTMLImageElement).style.opacity = '0.3'
                }}
              />
              
              {/* Overlay de hover para mostrar info del tile */}
              {showDebugInfo && tileMetadata && (
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-cyan-400/50">
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[8px] p-1">
                    <div>Col: {col}, Row: {row}</div>
                    <div>Brightness: {tileMetadata.content.avg_brightness}</div>
                    <div>Size: {(tileMetadata.size / 1024).toFixed(1)}KB</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Children (controles, overlays, etc.) */}
      {children}

      {/* Controles de zoom */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= metadata.zoom_levels.length - 1}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <span className="text-xl font-light">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <span className="text-xl font-light">−</span>
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all"
          aria-label="Reset view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Información del objeto celeste */}
      {metadata.celestial_object && (
        <div className="absolute top-20 left-6 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20 text-white z-50 max-w-xs">
          <h3 className="font-semibold text-lg mb-1">{metadata.celestial_object.name}</h3>
          <p className="text-xs text-gray-300">{metadata.celestial_object.type}</p>
          {metadata.celestial_object.catalog_id && (
            <p className="text-xs text-cyan-400 mt-1">{metadata.celestial_object.catalog_id}</p>
          )}
        </div>
      )}

      {/* Indicador de zoom */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white text-sm z-50">
        <span className="font-mono">
          Nivel {zoom}/{metadata.zoom_levels.length - 1}
        </span>
        {metadata.original_dimensions.gigapixels && metadata.original_dimensions.gigapixels >= 0.01 && (
          <span className="ml-2 text-cyan-400">
            • {metadata.original_dimensions.gigapixels.toFixed(2)} GP
          </span>
        )}
      </div>

      {/* Panel de información del tile hovereado */}
      {hoveredTile && (
        <div className="absolute top-20 left-6 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-cyan-400/30 text-white z-50 max-w-sm">
          <h4 className="font-semibold text-sm mb-2 text-cyan-400">Información del Tile</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Posición:</span>
              <span className="font-mono">({hoveredTile.position.col}, {hoveredTile.position.row})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coordenadas originales:</span>
              <span className="font-mono">
                ({hoveredTile.content.original_coords.x}, {hoveredTile.content.original_coords.y})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Brillo promedio:</span>
              <span>{hoveredTile.content.avg_brightness.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tamaño:</span>
              <span>{(hoveredTile.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado:</span>
              <span className={hoveredTile.content.is_empty ? "text-red-400" : "text-green-400"}>
                {hoveredTile.content.is_empty ? "Vacío" : "Con contenido"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hash:</span>
              <span className="font-mono text-[10px]">{hoveredTile.hash}</span>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de debug completo */}
      {showDebugInfo && currentZoomData && (
        <div className="absolute top-20 right-6 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 text-white text-xs z-40 font-mono space-y-1">
          <div className="font-semibold text-cyan-400 mb-2">Debug Info</div>
          <div>Zoom Level: {zoom}</div>
          <div>Position: ({Math.round(position.x)}, {Math.round(position.y)})</div>
          <div>Tiles Visibles: {visibleTiles.size}</div>
          <div>Dimensiones: {currentZoomData.width}x{currentZoomData.height}</div>
          <div>Grid: {currentZoomData.cols}x{currentZoomData.rows}</div>
          <div>Tile Size: {tileSize}px</div>
          {hoveredTile && (
            <>
              <div className="border-t border-white/20 mt-2 pt-2">
                <div className="font-semibold text-cyan-400 mb-1">Tile Actual:</div>
                <div>Pos: ({hoveredTile.position.col}, {hoveredTile.position.row})</div>
                <div>Hash: {hoveredTile.hash}</div>
                <div>Brightness: {hoveredTile.content.avg_brightness.toFixed(1)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SpaceRender