import { Search, Menu, User, Plus, ZoomIn, ZoomOut, Home, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface FloatingControlsProps {
  isAdmin: boolean;
  onSearchClick: () => void;
  onMenuClick: () => void;
  onUploadClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoom: number;
}

export function FloatingControls({
  isAdmin,
  onSearchClick,
  onMenuClick,
  onUploadClick,
  onZoomIn,
  onZoomOut,
  onResetView,
  zoom
}: FloatingControlsProps) {
  return (
    <>
      {/* Top Left - Logo and Menu */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-3"
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
          <div className="text-cyan-400 font-bold text-lg">NASA</div>
          <div className="w-px h-6 bg-white/20" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Top Right - Search and User */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearchClick}
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUploadClick}
              className="text-white hover:text-purple-400 hover:bg-white/10 h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Bottom Right - Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full p-1 flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= 5}
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0 disabled:opacity-50"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <div className="text-white text-xs px-2 py-1">
            {Math.round(zoom * 100)}%
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= 0.1}
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0 disabled:opacity-50"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-6 h-px bg-white/20 my-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Bottom Center - Timeline (Hidden by default, shows on hover) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 group"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
          <div className="flex items-center gap-4 text-white">
            <span className="text-sm">1995</span>
            <div className="w-64 h-2 bg-white/20 rounded-full relative">
              <div className="absolute left-1/2 top-0 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1" />
            </div>
            <span className="text-sm">2024</span>
          </div>
        </div>
        
        {/* Hover trigger area */}
        <div className="absolute inset-x-0 -top-10 h-20" />
      </motion.div>
    </>
  );
}