import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MapPin, Filter, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SpaceImage } from './space-map';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (image: SpaceImage) => void;
  images?: SpaceImage[];
}

export function SearchPanel({ isOpen, onClose, onImageSelect, images }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const popularTags = ['nebula', 'galaxy', 'planetary', 'hubble', 'jwst', 'mars', 'jupiter', 'saturn'];
  const objectTypes = ['planet', 'galaxy', 'nebula', 'star', 'moon', 'asteroid'];

  const filteredImages = (images || []).filter(image => {
    const matchesQuery = searchQuery === '' || 
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.object.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => image.tags.includes(tag));
    
    const matchesType = selectedType === '' || image.type === selectedType;

    return matchesQuery && matchesTags && matchesType;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedType('');
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
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border-l border-cyan-500/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl text-white">Explorar el Universo</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Main Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar objetos, lugares, eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Quick Filters */}
              <div>
                <h3 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros Rápidos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {objectTypes.map(type => (
                    <Badge
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedType === type 
                          ? 'bg-cyan-500 text-black border-cyan-500' 
                          : 'text-gray-300 border-gray-500 hover:border-cyan-500 hover:text-cyan-400'
                      }`}
                      onClick={() => setSelectedType(selectedType === type ? '' : type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'text-gray-300 border-gray-500 hover:border-purple-500 hover:text-purple-400'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Búsqueda por Coordenadas
                    </span>
                    <span className="text-xs">
                      {isAdvancedOpen ? '▼' : '▶'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="RA (h:m:s)"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="DEC (°:':&quot;)"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    Ir a Coordenadas
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="bg-white/10" />

              {/* Search Results */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300">
                    Resultados ({filteredImages.length})
                  </h3>
                  {(selectedTags.length > 0 || selectedType || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-gray-400 hover:text-cyan-400"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredImages.slice(0, 10).map(image => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer hover:border-cyan-500/50 hover:bg-white/10 transition-all group"
                      onClick={() => {
                        onImageSelect?.(image);
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                          <span className="text-lg">
                            {image.type === 'planet' && '🪐'}
                            {image.type === 'galaxy' && '🌌'}
                            {image.type === 'nebula' && '☁️'}
                            {image.type === 'star' && '⭐'}
                            {image.type === 'moon' && '🌙'}
                            {image.type === 'asteroid' && '☄️'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white group-hover:text-cyan-400 transition-colors truncate">
                            {image.name}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">
                            {image.object}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {image.date} • {image.satellite}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredImages.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p>No se encontraron resultados</p>
                      <p className="text-sm mt-1">Intenta ajustar tu búsqueda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-white/10">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                Aplicar Filtros
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}