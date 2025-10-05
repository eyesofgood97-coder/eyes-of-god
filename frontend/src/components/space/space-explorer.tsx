'use client'

import { useCallback, useState } from 'react'
import SpaceRender from '@/components/space/space-render'
import { toast, Toaster } from 'sonner'
import { analyzeTileWithAI } from '@/actions/gemini'
import { FloatingControls } from './floating-controls'
import { NavigationMenu } from './navigation-menu'
import { TileAnalysisPanel } from './tiles-analysis-panel'
import { SearchPanel } from './search-panel'
import { UploadPanel } from './upload-panel'
import { ImageViewerPanel } from './image-viewer-panel'

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

export default function SpaceExplorer({ isAdmin }: { isAdmin: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false)
  const [selectedTile, setSelectedTile] = useState<TileMetadata | null>(null)
  const [selectedTileUrl, setSelectedTileUrl] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)

  // Celestial object info (from metadata)
  const celestialObject = {
    name: "Andromeda Galaxy",
    type: "Spiral Galaxy"
  }

  // Handle tile click
  const handleTileClick = useCallback((tileMetadata: TileMetadata, zoomLevel: number) => {
    console.log('Tile selected:', tileMetadata, 'at zoom level:', zoomLevel)

    // Don't analyze empty tiles
    if (tileMetadata.content.is_empty) {
      toast.info("Empty Tile", {
        description: "This tile contains no significant astronomical data to analyze.",
        duration: 3000,
      })
      return
    }

    setSelectedTile(tileMetadata)
    setSelectedTileUrl(tileMetadata.url)
    setIsAnalysisPanelOpen(true)

    toast.success("Tile Selected", {
      description: `Position: Col ${tileMetadata.position.col}, Row ${tileMetadata.position.row}`,
      duration: 3000,
    })
  }, [])

  // Handle AI analysis - Convierte imagen a base64 en el cliente
  const handleAnalyze = useCallback(async (
    tileUrl: string,
    metadata: TileMetadata,
    celestialObject?: any
  ): Promise<string> => {
    try {
      // Fetch la imagen desde el cliente
      const response = await fetch(tileUrl)
      if (!response.ok) {
        throw new Error('Failed to load tile image')
      }
      
      const blob = await response.blob()
      
      // Convertir a base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string
            const base64Data = base64.split(',')[1] // Remover prefijo data:image/...
            
            // Llamar al server action con base64
            const result = await analyzeTileWithAI({
              tileUrl: base64Data, // Pasar base64 en lugar de URL
              tileMetadata: {
                position: metadata.position,
                content: metadata.content,
                dimensions: metadata.dimensions,
                originalCoords: metadata.content.original_coords
              },
              celestialObject
            })

            toast.success("Analysis Complete", {
              description: "AI has finished analyzing the tile fragment.",
              duration: 3000,
            })

            resolve(result)
          } catch (error) {
            toast.error("Analysis Failed", {
              description: error instanceof Error ? error.message : "Unknown error occurred",
              duration: 5000,
            })
            reject(error)
          }
        }
        reader.onerror = () => {
          reject(new Error('Failed to read image file'))
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      toast.error("Failed to Load Tile", {
        description: "Could not read the tile image for analysis",
        duration: 5000,
      })
      throw error
    }
  }, [])

  // Menu handlers
  const handleMenuItemClick = useCallback((item: string) => {
    switch (item) {
      case "home":
        toast.info("View Reset", {
          description: "Returning to initial view of the cosmos"
        })
        break
      case "about":
        toast.info("Eyes of God - Space Explorer", {
          description: "Explore gigapixel astronomical images with AI-powered analysis"
        })
        break
      default:
        toast.info(`Feature: ${item}`, {
          description: "This feature is coming soon"
        })
    }
  }, [])

  return (
    <>
      <SpaceRender
        tilesBasePath="/tiles/andromeda"
        initialZoom={2}
        showDebugInfo={true}
        onTileClick={handleTileClick}
      >
        {/* Floating Controls */}
        <FloatingControls
          isAdmin={isAdmin}
          onSearchClick={() => setIsSearchOpen(true)}
          onMenuClick={() => setIsMenuOpen(true)}
          onUploadClick={() => setIsUploadOpen(true)}
          onZoomIn={() => { }}
          onZoomOut={() => { }}
          onResetView={() => { }}
          zoom={1}
        />

        {/* Navigation Menu */}
        <NavigationMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onMenuItemClick={handleMenuItemClick}
        />

        {/* Toast Notifications */}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(0, 217, 255, 0.3)",
              color: "white",
            },
          }}
        />
      </SpaceRender>

      {/* Search Panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Upload Panel (Admin only) */}
      {isAdmin && (
        <UploadPanel
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {/* Tile Analysis Panel - Fuera de SpaceRender para evitar z-index issues */}
      <TileAnalysisPanel
        isOpen={isAnalysisPanelOpen}
        onClose={() => {
          setIsAnalysisPanelOpen(false)
          setSelectedTile(null)
          setSelectedTileUrl(null)
        }}
        tileMetadata={selectedTile}
        tileUrl={selectedTileUrl}
        celestialObject={celestialObject}
        onAnalyze={handleAnalyze}
      />
    </>
  )
}