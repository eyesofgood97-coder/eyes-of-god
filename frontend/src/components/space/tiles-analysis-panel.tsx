/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Loader2, Sparkles, Download } from 'lucide-react'
import { Button } from '../ui/button'
import ReactMarkdown from 'react-markdown'

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

interface TileAnalysisPanelProps {
  isOpen: boolean
  onClose: () => void
  tileMetadata: TileMetadata | null
  tileUrl: string | null
  celestialObject?: {
    name: string
    type: string
  }
  onAnalyze: (tileUrl: string, metadata: TileMetadata, celestialObject?: any) => Promise<string>
}

export function TileAnalysisPanel({ 
  isOpen, 
  onClose, 
  tileMetadata,
  tileUrl,
  celestialObject,
  onAnalyze 
}: TileAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  console.log('🎨 TileAnalysisPanel render:', {
    isOpen,
    hasTileMetadata: !!tileMetadata,
    hasTileUrl: !!tileUrl,
    tileUrl
  })

  const handleAnalyze = async () => {
    if (!tileUrl || !tileMetadata) {
      console.error('❌ Cannot analyze: missing tileUrl or tileMetadata')
      return
    }

    console.log('🚀 Starting analysis...')
    setIsAnalyzing(true)
    setHasAnalyzed(false)
    
    try {
      const result = await onAnalyze(tileUrl, tileMetadata, celestialObject)
      console.log('✅ Analysis complete, length:', result.length)
      setAnalysisResult(result)
      setHasAnalyzed(true)
    } catch (error) {
      console.error('❌ Error during analysis:', error)
      setAnalysisResult(`# ❌ Error\n\nFailed to analyze tile: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setHasAnalyzed(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = () => {
    if (!analysisResult || !tileMetadata) return

    const filename = `tile_analysis_col${tileMetadata.position.col}_row${tileMetadata.position.row}.md`
    const blob = new Blob([analysisResult], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    console.log('🚪 Closing panel')
    setAnalysisResult(null)
    setHasAnalyzed(false)
    onClose()
  }

  // Early return if no data
  if (!tileMetadata || !tileUrl) {
    console.log('⚠️ Panel not rendering: missing data')
    return null
  }

  console.log('✅ Panel rendering with data')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[700px] bg-gradient-to-b from-black/95 to-black/98 backdrop-blur-xl border-l border-cyan-500/30 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-black/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl text-white flex items-center gap-3 font-bold">
                    <Sparkles className="h-6 w-6 text-cyan-400" />
                    Tile Analysis
                  </h2>
                  {celestialObject && (
                    <p className="text-sm text-cyan-300 mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                      {celestialObject.name} • {celestialObject.type}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:text-cyan-400 hover:bg-white/10 h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tile Preview */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-b from-transparent to-black/30">
              <div className="relative w-fit bg-black/80 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-lg">
                <img
                  src={tileUrl}
                  alt="Tile preview"
                  className="object-contain"
                  onError={(e) => {
                    console.error('❌ Error loading tile image:', tileUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => console.log('✅ Tile image loaded successfully')}
                />
                
                {/* Corner label */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-cyan-500/50">
                  <span className="text-cyan-400 text-xs font-mono">
                    [{tileMetadata.position.col}, {tileMetadata.position.row}]
                  </span>
                </div>
              </div>

              {/* Tile Info Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Position</p>
                  <p className="text-white font-mono text-base">
                    Col {tileMetadata.position.col}, Row {tileMetadata.position.row}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Brightness</p>
                  <p className="text-white font-mono text-base">
                    {tileMetadata.content.avg_brightness.toFixed(1)}/255
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-cyan-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${(tileMetadata.content.avg_brightness / 255) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Dimensions</p>
                  <p className="text-white font-mono text-base">
                    {tileMetadata.dimensions.width} × {tileMetadata.dimensions.height}px
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">File Size</p>
                  <p className="text-white font-mono text-base">
                    {(tileMetadata.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {/* Analyze Button */}
              {!hasAnalyzed && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 text-base shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Analyze Tile with AI
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Analysis Results */}
            <div className="flex-1 overflow-y-auto">
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <Loader2 className="h-16 w-16 text-cyan-400 animate-spin mb-6" />
                  <p className="text-white text-xl mb-3 font-semibold">Analyzing tile fragment...</p>
                  <p className="text-gray-400 text-sm text-center max-w-md leading-relaxed">
                    Our AI is examining this section of the space image for celestial objects,
                    phenomena, and scientific features
                  </p>
                  <div className="mt-6 flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}

              {hasAnalyzed && analysisResult && (
                <div className="p-6">
                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={handleAnalyze}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Again
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>

                  {/* Analysis Result - Markdown rendering */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 prose prose-invert prose-cyan max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ ...props }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-xl font-semibold text-cyan-300 mb-3 mt-5" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-lg font-semibold text-cyan-400 mb-2 mt-4" {...props} />,
                        p: ({ ...props }) => <p className="text-gray-300 mb-3 leading-relaxed" {...props} />,
                        ul: ({ ...props }) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1" {...props} />,
                        ol: ({ ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1" {...props} />,
                        li: ({ ...props }) => <li className="text-gray-300 ml-4" {...props} />,
                        strong: ({ ...props }) => <strong className="text-white font-semibold" {...props} />,
                        em: ({ ...props }) => <em className="text-cyan-300 italic" {...props} />,
                        code: ({ inline, ...props }: any) => 
                          inline ? (
                            <code className="bg-black/50 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                          ) : (
                            <code className="block bg-black/50 text-cyan-400 p-3 rounded text-sm font-mono overflow-x-auto" {...props} />
                          ),
                        blockquote: ({ ...props }) => (
                          <blockquote className="border-l-4 border-cyan-500/50 pl-4 italic text-gray-400 my-3" {...props} />
                        ),
                      }}
                    >
                      {analysisResult}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {!isAnalyzing && !hasAnalyzed && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="relative mb-6">
                    <Sparkles className="h-20 w-20 text-cyan-400/30" />
                    <Sparkles className="h-12 w-12 text-cyan-400/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="text-white text-xl mb-3 font-semibold">Ready to Analyze</p>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                    Click the <span className="text-cyan-400 font-semibold">Analyze Tile with AI</span> button above to start a detailed
                    astronomical analysis of this tile fragment using advanced AI
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}