import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Search, Tag, Star, Clock, BookOpen, User, Settings, Info } from 'lucide-react';
import { Button } from '../ui/button';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (item: string) => void;
}

export function NavigationMenu({ isOpen, onClose, onMenuItemClick }: NavigationMenuProps) {
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home, description: 'Vista del universo completo' },
    { id: 'search', label: 'Búsqueda Avanzada', icon: Search, description: 'Encontrar objetos específicos' },
    { id: 'tags', label: 'Explorar por Tags', icon: Tag, description: 'Navegar por categorías' },
    { id: 'featured', label: 'Destacados', icon: Star, description: 'Imágenes más impresionantes' },
    { id: 'timeline', label: 'Línea Temporal', icon: Clock, description: 'Explorar por fecha de captura' },
    { id: 'collections', label: 'Colecciones', icon: BookOpen, description: 'Galerías curadas' },
    { id: 'profile', label: 'Mi Perfil', icon: User, description: 'Favoritos y configuración' },
    { id: 'settings', label: 'Configuración', icon: Settings, description: 'Ajustes de la aplicación' },
    { id: 'about', label: 'Acerca de', icon: Info, description: 'Información del proyecto' }
  ];

  const handleItemClick = (item: string) => {
    onMenuItemClick(item);
    onClose();
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

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[320px] bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border-r border-cyan-500/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-white">NASA Explorer</h2>
                  <p className="text-sm text-cyan-300">Navegación del Universo</p>
                </div>
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

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-4 hover:bg-white/5 group"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-1">
                          <item.icon className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Powered by NASAs Open Data
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Explora el cosmos desde tu navegador
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}