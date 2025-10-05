import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ZoomIn, ZoomOut, Home, Ruler, Bookmark, Clock, Palette, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SpaceImage } from './space-map';

interface ImageViewerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  image: SpaceImage | null;
  relatedImages: SpaceImage[];
  onImageSelect: (image: SpaceImage) => void;
}

export function ImageViewerPanel({ 
  isOpen, 
  onClose, 
  image, 
  relatedImages,
  onImageSelect 
}: ImageViewerPanelProps) {
  const [imageZoom, setImageZoom] = useState(1);
  const [isMetadataOpen, setIsMetadataOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!image) return null;

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev / 1.5, 0.1));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
  };

  const formatCoordinates = (ra: number, dec: number) => {
    return `RA: ${ra.toFixed(4)}° | DEC: ${dec.toFixed(4)}°`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border-l border-cyan-500/30 z-50 flex flex-col ${
              isFullscreen ? 'w-full' : 'w-[600px]'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl text-white truncate">{image.name}</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-cyan-300">{image.object}</p>
            </div>

            {/* Image Viewer */}
            <div className="flex-1 flex flex-col">
              <div className="relative bg-black/50 flex-1 overflow-hidden">
                {/* Image */}
                <div className="w-full h-full flex items-center justify-center p-4">
                  <motion.img
                    src={image.imageUrl}
                    alt={image.name}
                    className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                    style={{ transform: `scale(${imageZoom})` }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: imageZoom }}
                    transition={{ duration: 0.3 }}
                    draggable={false}
                  />
                </div>

                {/* Image Controls */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full p-1 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-white text-xs px-2 py-1 min-w-[3rem] text-center">
                    {Math.round(imageZoom * 100)}%
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <Separator orientation="vertical" className="h-6 bg-white/20" />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetZoom}
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tools */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full p-1 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Medir distancias"
                    className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Añadir marcador"
                    className="text-white hover:text-yellow-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Ver serie temporal"
                    className="text-white hover:text-green-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Cambiar capa espectral"
                    className="text-white hover:text-purple-400 hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Metadata and Info */}
              <div className="border-t border-white/10 overflow-y-auto max-h-1/2">
                {/* Quick Actions */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>

                {/* Metadata */}
                <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-white hover:bg-white/5 p-4"
                    >
                      <span>Metadatos</span>
                      <span className="text-xs">
                        {isMetadataOpen ? '▼' : '▶'}
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 space-y-4">
                    {/* Coordinates */}
                    <div>
                      <h4 className="text-sm text-gray-300 mb-2">📍 Coordenadas</h4>
                      <p className="text-white text-sm">{formatCoordinates(image.ra, image.dec)}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Posición: X:{image.x.toFixed(2)}, Y:{image.y.toFixed(2)}, Z:{image.z.toFixed(2)}
                      </p>
                    </div>

                    {/* Capture Info */}
                    <div>
                      <h4 className="text-sm text-gray-300 mb-2">📅 Captura</h4>
                      <p className="text-white text-sm">{image.date}</p>
                      <p className="text-gray-400 text-xs">{image.satellite} • {image.instrument}</p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="text-sm text-gray-300 mb-2">🏷️ Etiquetas</h4>
                      <div className="flex flex-wrap gap-2">
                        {image.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm text-gray-300 mb-2">📝 Descripción</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {image.description}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Related Images */}
                {relatedImages.length > 0 && (
                  <div className="p-4 border-t border-white/10">
                    <h4 className="text-white mb-3">Imágenes Relacionadas</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {relatedImages.slice(0, 4).map(relatedImage => (
                        <motion.div
                          key={relatedImage.id}
                          className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-colors p-2 flex flex-col items-center justify-center"
                          onClick={() => onImageSelect(relatedImage)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg mb-1">
                            {relatedImage.type === 'planet' && '🪐'}
                            {relatedImage.type === 'galaxy' && '🌌'}
                            {relatedImage.type === 'nebula' && '☁️'}
                            {relatedImage.type === 'star' && '⭐'}
                            {relatedImage.type === 'moon' && '🌙'}
                            {relatedImage.type === 'asteroid' && '☄️'}
                          </span>
                          <span className="text-xs text-gray-400 text-center leading-tight truncate w-full">
                            {relatedImage.name.split(' ')[0]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}