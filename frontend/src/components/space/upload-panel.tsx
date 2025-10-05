/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Calendar, Tag, MapPin, Image, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Progress } from '../ui/progress';

interface UploadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export function UploadPanel({ isOpen, onClose, onUpload }: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    object: '',
    ra: '',
    dec: '',
    x: '',
    y: '',
    z: '',
    date: '',
    time: '',
    satellite: '',
    instrument: '',
    filters: '',
    tags: '',
    description: '',
    visibility: 'public',
    isTimeSeries: false
  });

  const satellites = [
    'Hubble Space Telescope',
    'James Webb Space Telescope',
    'Spitzer Space Telescope',
    'Kepler Space Telescope',
    'Chandra X-ray Observatory',
    'Mars Reconnaissance Orbiter',
    'Cassini',
    'New Horizons'
  ];

  const objectTypes = [
    'Galaxia',
    'Nebulosa',
    'Planeta',
    'Luna',
    'Estrella',
    'Asteroide',
    'Cometa',
    'Exoplaneta'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill name from filename
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, name: nameWithoutExt }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, name: nameWithoutExt }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Call upload callback with mock data
          const uploadedData = {
            id: Date.now().toString(),
            name: formData.name,
            object: formData.object,
            x: parseFloat(formData.x) || Math.random() * 200 - 100,
            y: parseFloat(formData.y) || Math.random() * 200 - 100,
            z: parseFloat(formData.z) || Math.random() * 200 - 100,
            ra: parseFloat(formData.ra) || 0,
            dec: parseFloat(formData.dec) || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            satellite: formData.satellite,
            instrument: formData.instrument,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            description: formData.description,
            imageUrl: URL.createObjectURL(file),
            thumbnailUrl: URL.createObjectURL(file),
            type: 'galaxy' as const,
            featured: formData.visibility === 'featured'
          };
          
          onUpload(uploadedData);
          onClose();
          
          // Reset form
          setFile(null);
          setFormData({
            name: '',
            object: '',
            ra: '',
            dec: '',
            x: '',
            y: '',
            z: '',
            date: '',
            time: '',
            satellite: '',
            instrument: '',
            filters: '',
            tags: '',
            description: '',
            visibility: 'public',
            isTimeSeries: false
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
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
            className="fixed right-0 top-0 h-full w-[500px] bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-xl border-l border-purple-500/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-white">Nueva Imagen Gigapixel</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:text-purple-400 hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* File Upload */}
                <div>
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Image className="h-4 w-4" />
                    Archivo de Imagen
                  </Label>
                  
                  {!file ? (
                    <div
                      className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <Upload className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <p className="text-white mb-2">Arrastra tu imagen aquí</p>
                      <p className="text-gray-400 text-sm">o haz clic para seleccionar</p>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Image className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {isUploading && (
                        <div className="mt-3">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-400 mt-1">
                            Subiendo... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Spatial Information */}
                <div>
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4" />
                    Información Espacial
                  </Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Nombre del objeto"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                    
                    <Select value={formData.object} onValueChange={(value: string) => setFormData(prev => ({ ...prev, object: value }))}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Tipo de objeto celeste" />
                      </SelectTrigger>
                      <SelectContent>
                        {objectTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="RA (grados)"
                        value={formData.ra}
                        onChange={(e) => setFormData(prev => ({ ...prev, ra: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                      <Input
                        placeholder="DEC (grados)"
                        value={formData.dec}
                        onChange={(e) => setFormData(prev => ({ ...prev, dec: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between text-gray-300 hover:text-purple-400 hover:bg-white/5"
                        >
                          Coordenadas Cartesianas (Opcional)
                          <span className="text-xs">{isAdvancedOpen ? '▼' : '▶'}</span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="X"
                            value={formData.x}
                            onChange={(e) => setFormData(prev => ({ ...prev, x: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Input
                            placeholder="Y"
                            value={formData.y}
                            onChange={(e) => setFormData(prev => ({ ...prev, y: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Input
                            placeholder="Z"
                            value={formData.z}
                            onChange={(e) => setFormData(prev => ({ ...prev, z: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>

                {/* Capture Information */}
                <div>
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" />
                    Información de Captura
                  </Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>

                    <Select value={formData.satellite} onValueChange={(value: string) => setFormData(prev => ({ ...prev, satellite: value }))}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Satélite/Telescopio" />
                      </SelectTrigger>
                      <SelectContent>
                        {satellites.map(satellite => (
                          <SelectItem key={satellite} value={satellite}>{satellite}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Instrumento"
                      value={formData.instrument}
                      onChange={(e) => setFormData(prev => ({ ...prev, instrument: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />

                    <Input
                      placeholder="Filtros utilizados"
                      value={formData.filters}
                      onChange={(e) => setFormData(prev => ({ ...prev, filters: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4" />
                    Metadatos
                  </Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Etiquetas (separadas por comas)"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />

                    <Textarea
                      placeholder="Descripción científica"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      rows={3}
                    />

                    <div>
                      <Label className="text-white text-sm mb-3 block">Visibilidad</Label>
                      <RadioGroup
                        value={formData.visibility}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, visibility: value }))}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public" className="text-gray-300">Pública</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private" className="text-gray-300">Privada</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="featured" id="featured" />
                          <Label htmlFor="featured" className="text-gray-300">Destacada</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <div>
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Settings className="h-4 w-4" />
                    Opciones Avanzadas
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="timeSeries"
                      checked={formData.isTimeSeries}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isTimeSeries: !!checked }))}
                    />
                    <Label htmlFor="timeSeries" className="text-gray-300">
                      Parte de una serie temporal
                    </Label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 space-y-3">
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
                >
                  {isUploading ? 'Subiendo...' : 'Publicar Imagen'}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-white/5"
                  >
                    Guardar Borrador
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}