import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { SurfaceOption } from "../types";
import { SURFACE_GALLERIES, SurfaceGalleryItem } from "../data/surfaceGalleriesData";

const PEXELS_API_KEY =
  (import.meta.env.VITE_PEXELS_API_KEY as string) ||
  "4fPfX4F1Y8TYcnM0kobnebh8zho3RSyEZR2bL8aEiLQsokw0kgxu74bU";

interface SurfaceGalleryModalProps {
  surface: SurfaceOption | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSurface: (surface: SurfaceOption) => void;
}

export const SurfaceGalleryModal: React.FC<SurfaceGalleryModalProps> = ({
  surface,
  isOpen,
  onClose,
  onSelectSurface,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});
  const [isRecovering, setIsRecovering] = useState(false);

  const galleryItems: SurfaceGalleryItem[] = surface ? (SURFACE_GALLERIES[surface.id] || []) : [];

  // Reset index when surface changes
  useEffect(() => {
    setActiveIndex(0);
  }, [surface?.id]);

  // Handle ESC key and arrows to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, galleryItems.length, onClose]);

  // Load photos from localStorage or fallback
  useEffect(() => {
    if (!surface || !galleryItems.length) return;

    const initialMap: Record<string, string> = {};
    galleryItems.forEach((item) => {
      const cacheKey = `colorlink_gallery_${surface.id}_${item.id}`;
      try {
        const cached = localStorage.getItem(cacheKey);
        initialMap[item.id] = cached || item.curatedUrl;
      } catch {
        initialMap[item.id] = item.curatedUrl;
      }
    });

    setLoadedImages(initialMap);
  }, [surface, galleryItems]);

  if (!isOpen || !surface || !galleryItems.length) return null;

  const currentItem = galleryItems[activeIndex] || galleryItems[0];
  const currentImageUrl = loadedImages[currentItem.id] || currentItem.curatedUrl;

  // Handle image load error: query Pexels API and cache
  const handleImageError = async (itemId: string, query: string) => {
    const cacheKey = `colorlink_gallery_${surface.id}_${itemId}`;
    console.warn(`[SurfaceGallery] Imagen fallida para ${itemId}. Consultando Pexels API...`);
    setIsRecovering(true);

    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`,
        {
          headers: { Authorization: PEXELS_API_KEY },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const nuevaUrl =
          data.photos?.[0]?.src?.large ||
          data.photos?.[0]?.src?.landscape ||
          data.photos?.[1]?.src?.large;

        if (nuevaUrl) {
          setLoadedImages((prev) => ({ ...prev, [itemId]: nuevaUrl }));
          try {
            localStorage.setItem(cacheKey, nuevaUrl);
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error("[SurfaceGallery] Error al recuperar foto desde Pexels:", err);
    } finally {
      setIsRecovering(false);
    }
  };

  const handleSelectAndClose = () => {
    onSelectSurface(surface);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header minimalista */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#E2622F] uppercase tracking-wider">
              {surface.title}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">
              Caso {activeIndex + 1} de {galleryItems.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
            aria-label="Cerrar galería"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visor de foto principal ampliada */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-950 overflow-hidden group">
          <img
            src={currentImageUrl}
            alt={currentItem.title}
            onError={() => handleImageError(currentItem.id, currentItem.pexelsQuery)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          />

          {/* Gradiente inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Flechas de navegación */}
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer"
            aria-label="Ejemplo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer"
            aria-label="Siguiente ejemplo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Detalle sobre la foto */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E2622F] text-white px-2 py-0.5 rounded-sm">
                {currentItem.tag}
              </span>
              <span className="text-xs text-stone-300 font-medium truncate">
                {currentItem.recommendedProduct}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug drop-shadow-xs">
              {currentItem.title}
            </h3>
            <p className="text-xs text-stone-200 mt-0.5 max-w-xl line-clamp-2 text-stone-300">
              {currentItem.description}
            </p>
          </div>
        </div>

        {/* Carrusel horizontal de miniaturas clicables */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 shrink-0">
          <div className="text-[11px] font-semibold text-stone-500 mb-2 flex items-center justify-between">
            <span>Explora los 4 casos reales de esta categoría:</span>
            <span className="text-[10px] text-stone-400 font-normal">Haz clic para ampliar</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {galleryItems.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              const thumbUrl = loadedImages[item.id] || item.curatedUrl;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`text-left rounded-lg overflow-hidden border transition-all cursor-pointer group flex flex-col ${
                    isCurrent
                      ? "border-[#E2622F] ring-2 ring-[#E2622F]/30 shadow-xs bg-white"
                      : "border-stone-200 hover:border-stone-300 bg-white opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="aspect-[4/3] w-full bg-stone-200 overflow-hidden relative">
                    <img
                      src={thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isCurrent && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E2622F] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="p-1.5 min-h-[32px] flex items-center">
                    <p className={`text-[10px] font-medium leading-tight line-clamp-1 ${
                      isCurrent ? "text-[#1A1715] font-bold" : "text-stone-600"
                    }`}>
                      {item.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pie de acciones */}
        <div className="px-5 py-3 border-t border-stone-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            Cerrar galería
          </button>

          <button
            type="button"
            onClick={handleSelectAndClose}
            className="bg-[#E2622F] hover:bg-[#C95222] text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Elegir {surface.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
