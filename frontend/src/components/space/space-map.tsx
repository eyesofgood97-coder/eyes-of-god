import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export interface SpaceImage {
  id: string;
  name: string;
  object: string;
  x: number; // Spatial coordinates
  y: number;
  z: number;
  ra: number; // Right Ascension
  dec: number; // Declination
  date: string;
  satellite: string;
  instrument: string;
  tags: string[];
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  type: 'planet' | 'galaxy' | 'nebula' | 'star' | 'moon' | 'asteroid';
  featured: boolean;
}

interface SpaceMapProps {
  images: SpaceImage[];
  onImageClick: (image: SpaceImage) => void;
  onMapClick: (x: number, y: number) => void;
}

export function SpaceMap({ images, onImageClick, onMapClick }: SpaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);

    // Zoom towards mouse position
    const zoomPointX = (mouseX - offset.x) / zoom;
    const zoomPointY = (mouseY - offset.y) / zoom;

    const newOffsetX = mouseX - zoomPointX * newZoom;
    const newOffsetY = mouseY - zoomPointY * newZoom;

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && e.target === containerRef.current) {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      onMapClick(x, y);
    }
  };

  const getImageIcon = (type: string) => {
    switch (type) {
      case 'planet': return '🪐';
      case 'galaxy': return '🌌';
      case 'nebula': return '☁️';
      case 'star': return '⭐';
      case 'moon': return '🌙';
      case 'asteroid': return '☄️';
      default: return '✨';
    }
  };

  const getImageColor = (type: string) => {
    switch (type) {
      case 'planet': return '#a855f7';
      case 'galaxy': return '#00d9ff';
      case 'nebula': return '#f59e0b';
      case 'star': return '#ffffff';
      case 'moon': return '#d1d5db';
      case 'asteroid': return '#ef4444';
      default: return '#00d9ff';
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <div
        className="relative origin-top-left transition-transform duration-100"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          width: '200vw',
          height: '200vh'
        }}
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${(image.x + 100) * 5}px`, // Normalize coordinates
              top: `${(image.y + 100) * 5}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: Math.random() * 2 }}
            onClick={(e) => {
              e.stopPropagation();
              onImageClick(image);
            }}
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${getImageColor(image.type)}40 0%, transparent 70%)`,
                width: '40px',
                height: '40px',
                transform: 'translate(-50%, -50%)'
              }}
            />
            
            {/* Main node */}
            <div
              className="relative w-6 h-6 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-150"
              style={{
                backgroundColor: getImageColor(image.type),
                borderColor: getImageColor(image.type),
                boxShadow: `0 0 20px ${getImageColor(image.type)}80`
              }}
            >
              <span className="text-xs">{getImageIcon(image.type)}</span>
            </div>

            {/* Tooltip */}
            {hoveredImage === image.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-2 text-white z-10 whitespace-nowrap"
              >
                <div className="text-sm font-medium">{image.name}</div>
                <div className="text-xs text-cyan-300">{image.object}</div>
                <div className="text-xs text-gray-400">{image.date}</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}