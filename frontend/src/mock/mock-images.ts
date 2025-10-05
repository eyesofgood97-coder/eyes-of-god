import { SpaceImage } from "@/components/space/space-map";

export const mockSpaceImages: SpaceImage[] = [
  {
    id: '1',
    name: 'Nebulosa del Águila',
    object: 'Messier 16',
    x: -45.2,
    y: 12.8,
    z: -8.3,
    ra: 274.7,
    dec: -13.8,
    date: '2023-07-15',
    satellite: 'James Webb Space Telescope',
    instrument: 'NIRCam',
    tags: ['nebula', 'star-formation', 'jwst', 'infrared'],
    description: 'La Nebulosa del Águila es una región de formación estelar activa ubicada en la constelación Serpens. Esta imagen de infrarrojos revela estructuras ocultas en el interior de la nebulosa.',
    imageUrl: 'https://images.unsplash.com/photo-1504812333783-63b845853c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMG5lYnVsYXxlbnwxfHx8fDE3NTk1OTk5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504812333783-63b845853c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMG5lYnVsYXxlbnwxfHx8fDE3NTk1OTk5Mzd8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'nebula',
    featured: true
  },
  {
    id: '2',
    name: 'Superficie de Marte - Cráter Jezero',
    object: 'Marte',
    x: 78.1,
    y: -34.6,
    z: 12.9,
    ra: 0,
    dec: 0,
    date: '2023-09-22',
    satellite: 'Mars Reconnaissance Orbiter',
    instrument: 'HiRISE',
    tags: ['mars', 'planetary', 'surface', 'geology'],
    description: 'Vista detallada del cráter Jezero en Marte, donde el rover Perseverance está buscando signos de vida antigua. Las formaciones rocosas sugieren actividad acuática pasada.',
    imageUrl: 'https://images.unsplash.com/photo-1527826507412-72e447368aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwc3VyZmFjZXxlbnwxfHx8fDE3NTk2NDI5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527826507412-72e447368aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwc3VyZmFjZXxlbnwxfHx8fDE3NTk2NDI5MzR8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'planet',
    featured: false
  },
  {
    id: '3',
    name: 'Saturno y sus Anillos',
    object: 'Saturno',
    x: -12.4,
    y: 67.3,
    z: -23.1,
    ra: 320.5,
    dec: -18.2,
    date: '2023-05-10',
    satellite: 'Hubble Space Telescope',
    instrument: 'Wide Field Camera 3',
    tags: ['saturn', 'planetary', 'rings', 'hubble'],
    description: 'Imagen en alta resolución de Saturno mostrando la compleja estructura de sus anillos. Se pueden observar las divisiones de Cassini y Encke con claridad excepcional.',
    imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXR1cm4lMjByaW5ncyUyMHBsYW5ldHxlbnwxfHx8fDE3NTk2ODA0OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXR1cm4lMjByaW5ncyUyMHBsYW5ldHxlbnwxfHx8fDE3NTk2ODA0OTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'planet',
    featured: true
  },
  {
    id: '4',
    name: 'Superficie Lunar - Mare Tranquillitatis',
    object: 'Luna',
    x: 23.7,
    y: -89.2,
    z: 45.6,
    ra: 0,
    dec: 0,
    date: '2023-08-03',
    satellite: 'Lunar Reconnaissance Orbiter',
    instrument: 'LROC NAC',
    tags: ['moon', 'lunar', 'surface', 'apollo'],
    description: 'Vista detallada del Mar de la Tranquilidad, sitio histórico del alunizaje del Apollo 11. Se pueden distinguir cráteres de impacto y formaciones geológicas lunares.',
    imageUrl: 'https://images.unsplash.com/photo-1649947432829-858c4550c04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29uJTIwbHVuYXIlMjBzdXJmYWNlfGVufDF8fHx8MTc1OTYzNzgxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1649947432829-858c4550c04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29uJTIwbHVuYXIlMjBzdXJmYWNlfGVufDF8fHx8MTc1OTYzNzgxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'moon',
    featured: false
  },
  {
    id: '5',
    name: 'Júpiter - La Gran Mancha Roja',
    object: 'Júpiter',
    x: -67.8,
    y: 34.2,
    z: -12.7,
    ra: 215.3,
    dec: 12.4,
    date: '2023-06-18',
    satellite: 'Juno',
    instrument: 'JunoCam',
    tags: ['jupiter', 'planetary', 'storm', 'atmosphere'],
    description: 'Imagen detallada de la Gran Mancha Roja de Júpiter, una tormenta anticiclónica que ha persistido durante siglos. Los colores realzan las diferentes altitudes atmosféricas.',
    imageUrl: 'https://images.unsplash.com/photo-1639477734993-44982980229e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXBpdGVyJTIwcGxhbmV0JTIwc3Rvcm18ZW58MXx8fHwxNzU5NjgwNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639477734993-44982980229e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXBpdGVyJTIwcGxhbmV0JTIwc3Rvcm18ZW58MXx8fHwxNzU5NjgwNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'planet',
    featured: true
  },
  {
    id: '6',
    name: 'Galaxia Espiral M81',
    object: 'Messier 81',
    x: 102.5,
    y: -56.7,
    z: 89.3,
    ra: 148.9,
    dec: 69.1,
    date: '2023-04-25',
    satellite: 'Hubble Space Telescope',
    instrument: 'Advanced Camera for Surveys',
    tags: ['galaxy', 'spiral', 'hubble', 'deep-space'],
    description: 'La galaxia espiral M81, también conocida como Galaxia de Bode, situada a aproximadamente 12 millones de años luz. Sus brazos espirales muestran regiones de formación estelar activa.',
    imageUrl: 'https://images.unsplash.com/photo-1649554007580-aeba20951028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodWJibGUlMjB0ZWxlc2NvcGUlMjBzcGFjZXxlbnwxfHx8fDE3NTk1NzQ5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1649554007580-aeba20951028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodWJibGUlMjB0ZWxlc2NvcGUlMjBzcGFjZXxlbnwxfHx8fDE3NTk1NzQ5NzF8MA&ixlib=rb-4.1.0&q=80&w=400',
    type: 'galaxy',
    featured: false
  }
];

// Generate additional random images for a more populated universe
const generateRandomImage = (id: number): SpaceImage => {
  const types: Array<SpaceImage['type']> = ['planet', 'galaxy', 'nebula', 'star', 'moon', 'asteroid'];
  const satellites = ['Hubble Space Telescope', 'James Webb Space Telescope', 'Spitzer Space Telescope', 'Kepler Space Telescope'];
  const instruments = ['WFC3', 'NIRCam', 'ACS', 'MIRI', 'COR'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const names: Record<string, string[]> = {
    planet: ['Exoplaneta K2-18b', 'HD 209458b', 'WASP-121b', 'TOI-849b'],
    galaxy: ['NGC 4414', 'M87', 'Galaxia del Sombrero', 'NGC 2207'],
    nebula: ['Nebulosa del Cangrejo', 'Nebulosa Rosetta', 'Nebulosa del Anillo', 'Nebulosa Cabeza de Caballo'],
    star: ['Betelgeuse', 'Rigel', 'Vega', 'Altair'],
    moon: ['Io', 'Europa', 'Ganimedes', 'Titán'],
    asteroid: ['Ceres', 'Vesta', 'Pallas', 'Hygiea']
  };
  
  const nameOptions = names[type];
  const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
  
  return {
    id: `generated-${id}`,
    name: `${name} ${id}`,
    object: name,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    z: Math.random() * 200 - 100,
    ra: Math.random() * 360,
    dec: Math.random() * 180 - 90,
    date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    satellite: satellites[Math.floor(Math.random() * satellites.length)],
    instrument: instruments[Math.floor(Math.random() * instruments.length)],
    tags: ['deep-space', type, 'exploration'],
    description: `Observación detallada de ${name} capturada durante misión de exploración espacial.`,
    imageUrl: mockSpaceImages[Math.floor(Math.random() * mockSpaceImages.length)].imageUrl,
    thumbnailUrl: mockSpaceImages[Math.floor(Math.random() * mockSpaceImages.length)].thumbnailUrl,
    type,
    featured: Math.random() > 0.8
  };
};

// Add 20 more random images to populate the universe
const additionalImages = Array.from({ length: 20 }, (_, i) => generateRandomImage(i + 7));

export const allSpaceImages = [...mockSpaceImages, ...additionalImages];