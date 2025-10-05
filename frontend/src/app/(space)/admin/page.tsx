'use client'

import { FloatingControls } from "@/components/space/floating-controls";
import { ImageViewerPanel } from "@/components/space/image-viewer-panel";
import { NavigationMenu } from "@/components/space/navigation-menu";
import { SearchPanel } from "@/components/space/search-panel";
import { SpaceBackground } from "@/components/space/space-background";
import { SpaceImage, SpaceMap } from "@/components/space/space-map";
import { UploadPanel } from "@/components/space/upload-panel";
import { allSpaceImages } from "@/mock/mock-images";
import { useState, useCallback } from "react";
import { toast, Toaster } from "sonner";

export default function App() {
  const [spaceImages, setSpaceImages] =
    useState<SpaceImage[]>(allSpaceImages);
  const [zoom, setZoom] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState<SpaceImage | null>(null);
  const [isAdmin] = useState(true); // Toggle this for admin/user mode

  // Panel states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Space map handlers
  const handleImageClick = useCallback((image: SpaceImage) => {
    setSelectedImage(image);
    setIsImageViewerOpen(true);
  }, []);

  const handleMapClick = useCallback((x: number, y: number) => {
    console.log("Map clicked at:", x, y);
  }, []);

  // Control handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.5, 0.1));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    // Could also reset map position here
  }, []);

  // Upload handler
  const handleUpload = useCallback((newImage: SpaceImage) => {
    setSpaceImages((prev) => [...prev, newImage]);
    toast.success(
      `Imagen "${newImage.name}" subida exitosamente`,
      {
        description:
          "La imagen ahora está visible en el mapa del espacio",
        duration: 5000,
      },
    );
  }, []);

  // Menu handlers
  const handleMenuItemClick = useCallback(
    (item: string) => {
      switch (item) {
        case "home":
          handleResetView();
          setSelectedImage(null);
          toast.info(
            "Vista restablecida al origen del universo",
          );
          break;
        case "search":
          setIsSearchOpen(true);
          break;
        case "featured":
          const featuredImages = spaceImages.filter(
            (img) => img.featured,
          );
          if (featuredImages.length > 0) {
            const randomFeatured =
              featuredImages[
                Math.floor(
                  Math.random() * featuredImages.length,
                )
              ];
            handleImageClick(randomFeatured);
            toast.info(
              `Navegando a imagen destacada: ${randomFeatured.name}`,
            );
          }
          break;
        case "timeline":
          toast.info("Función de línea temporal próximamente");
          break;
        case "collections":
          toast.info("Colecciones curadas próximamente");
          break;
        case "about":
          toast.info(
            "NASA Gigapixel Explorer - Explora el universo con imágenes reales de misiones espaciales",
          );
          break;
        default:
          toast.info(`Función "${item}" próximamente`);
      }
    },
    [spaceImages, handleImageClick, handleResetView],
  );

  // Get related images for the selected image
  const getRelatedImages = useCallback(
    (image: SpaceImage) => {
      return spaceImages
        .filter(
          (img) =>
            img.id !== image.id &&
            (img.type === image.type ||
              img.tags.some((tag) =>
                image.tags.includes(tag),
              ) ||
              img.satellite === image.satellite),
        )
        .slice(0, 6);
    },
    [spaceImages],
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Space Background */}
      <SpaceBackground />

      {/* Main Space Map */}
      <SpaceMap
        images={spaceImages}
        onImageClick={handleImageClick}
        onMapClick={handleMapClick}
      />

      {/* Floating Controls */}
      <FloatingControls
        isAdmin={isAdmin}
        onSearchClick={() => setIsSearchOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        onUploadClick={() => setIsUploadOpen(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        zoom={zoom}
      />

      {/* Navigation Menu */}
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Search Panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onImageSelect={handleImageClick}
        images={spaceImages}
      />

      {/* Upload Panel (Admin only) */}
      {isAdmin && (
        <UploadPanel
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}

      {/* Image Viewer Panel */}
      <ImageViewerPanel
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        image={selectedImage}
        relatedImages={
          selectedImage ? getRelatedImages(selectedImage) : []
        }
        onImageSelect={handleImageClick}
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
    </div>
  );
}