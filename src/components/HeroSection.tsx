import React, { useState, useEffect, useRef } from "react";
import {
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Users,
} from "lucide-react";

import credenzaVaseImg from "../assets/images/credenza_vase_1790413140726.jpg";
import luxuryBathroomImg from "../assets/images/luxury_bathroom_1790413117503.jpg";
import heroConsultationImg from "../assets/images/hero_consultation_1790412922500.jpg";
import designerLivingImg from "../assets/images/designer_livingroom_1790412952964.jpg";
import facadeArchImg from "../assets/images/facade_architecture_1790412935369.jpg";
import paintersPlanningImg from "../assets/images/painters_planning_1790412967607.jpg";

// 6 Fotografías para "Explora Categorías de Pintura Interior" (Exacto a la captura de pantalla)
import catInteriorImg from "../assets/images/category_interior_1790413705511.jpg";
import catPrimersImg from "../assets/images/category_primers_1790413724236.jpg";
import catWoodImg from "../assets/images/category_wood_1790413745474.jpg";
import catMasonryImg from "../assets/images/category_masonry_1790413760804.jpg";
import catAerosolsImg from "../assets/images/category_aerosols_1790413777245.jpg";
import catCeilingImg from "../assets/images/category_ceiling_1790413798457.jpg";

interface HeroSectionProps {
  onStartDiagnostic: () => void;
}

interface SlideItem {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  swatchName?: string;
  swatchHex?: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "color-of-year-credenza",
    image: credenzaVaseImg,
    tag: "COLORLINK BY PINTUCO · COLOR DEL AÑO 2026",
    title: "Verde Celadón & Molduras Arquitectónicas",
    description:
      "Tonalidades serenas que transforman paredes en piezas de arte con acabado mate sedoso y fórmula Viniltex ultra-lavable.",
    swatchName: "Verde Celadón",
    swatchHex: "#8A9A7B",
  },
  {
    id: "luxury-bathroom",
    image: luxuryBathroomImg,
    tag: "COLORLINK · LÍNEA BAÑOS & COCINAS ANTI-HUMEDAD",
    title: "Ambientes Serenos, Resistencia Absoluta",
    description:
      "Protección antimicrobiana activa y barrera impermeable contra el vapor, la humedad y el desgaste cotidiano.",
    swatchName: "Salvia Suave",
    swatchHex: "#9BB79A",
  },
  {
    id: "store-consultation",
    image: heroConsultationImg,
    tag: "ASESORÍA OFICIAL COLORLINK BY PINTUCO",
    title: "Cada cliente, cada espacio, cada obra — estamos contigo",
    description:
      "Diagnóstico técnico en minutos, tinturado de alta precisión computarizada y acompañamiento de expertos en pintura.",
    swatchName: "Terracota Vivo",
    swatchHex: "#E2622F",
  },
  {
    id: "facade-architecture",
    image: facadeArchImg,
    tag: "COLORLINK · PROTECCIÓN ARQUITECTÓNICA 360",
    title: "Protección Climática y Fachadas de Vanguardia",
    description:
      "Hasta 7 años de garantía certificada con Koraza: polímeros elásticos que sellan microfisuras y resisten sol y lluvia.",
    swatchName: "Blanco Titanio",
    swatchHex: "#F5F3EE",
  },
  {
    id: "designer-living",
    image: designerLivingImg,
    tag: "COLORLINK · DISEÑO RESIDENCIAL & INTERIORISMO",
    title: "Tu proyecto de pintura, resuelto en minutos",
    description:
      "Simula tu color ideal en espacios reales, calcula los galones exactos y agenda maestros certificados en toda Colombia.",
    swatchName: "Arena Colonial",
    swatchHex: "#D8C9A3",
  },
  {
    id: "painters-planning",
    image: paintersPlanningImg,
    tag: "RED DE MAESTROS CERTIFICADOS PINTUCO",
    title: "Mano de Obra Profesional Avalada",
    description:
      "Más de 1.200 operarios capacitados con protocolos oficiales de aplicación, seguridad y póliza de garantía de obra.",
    swatchName: "Espresso Cálido",
    swatchHex: "#1A1715",
  },
];

const PEXELS_API_KEY =
  (import.meta.env.VITE_PEXELS_API_KEY as string) ||
  "4fPfX4F1Y8TYcnM0kobnebh8zho3RSyEZR2bL8aEiLQsokw0kgxu74bU";

// 6 Categorías de pintura interior (Fotografías reales Pexels sin marcas ni textos en inglés)
const CATEGORIAS_PINTURA = [
  {
    id: "interior-paints",
    nombre: "Pinturas de Interior",
    nombreIngles: "Interior Paints",
    lineas: "Viniltex Avanzado, Viniltex Vida, Baños y Cocinas",
    imagenDefault: catInteriorImg,
    pexelsQuery: "modern living room wall interior architecture no text no logo",
    alt: "Pinturas de interior sobre pared de sala moderna",
  },
  {
    id: "interior-primers",
    nombre: "Imprimantes y Selladores",
    nombreIngles: "Interior Primers",
    lineas: "Sellador 501, Primer Acrílico, Barrera Antihumedad",
    imagenDefault: catPrimersImg,
    pexelsQuery: "white painted wall drywall plaster texture no text no logo",
    alt: "Imprimantes y selladores para preparación de muros",
  },
  {
    id: "wood-stains",
    nombre: "Maderas, Tintes y Barnices",
    nombreIngles: "Wood Stains, Sealants & Topcoats",
    lineas: "Maderprotect, Barniz Poliuretano, Tintes al Aceite",
    imagenDefault: catWoodImg,
    pexelsQuery: "wood furniture closeup texture natural grain no text no logo",
    alt: "Tintes y barnices para madera en mesón y mobiliario",
  },
  {
    id: "concrete-masonry",
    nombre: "Concreto y Mampostería",
    nombreIngles: "Concrete & Masonry",
    lineas: "Koraza Mampostería, Pintura para Ladrillo y Morteros",
    imagenDefault: catMasonryImg,
    pexelsQuery: "brick wall texture concrete masonry building facade no text no logo",
    alt: "Pintura para concreto y mampostería",
  },
  {
    id: "aerosols",
    nombre: "Aerosoles y Esmaltes",
    nombreIngles: "Aerosols",
    lineas: "Aerocolor Pintuco, Pintulux Esmalte Secado Rápido",
    imagenDefault: catAerosolsImg,
    pexelsQuery: "spray paint texture painted surface metallic finish no text no logo",
    alt: "Aerosoles y esmaltes sobre superficie metálica",
  },
  {
    id: "ceiling-paint",
    nombre: "Pintura para Techos y Cielos Rasos",
    nombreIngles: "Ceiling Paint",
    lineas: "Cielos Rasos Antirreflejo Blanco Nube, Antigoteo",
    imagenDefault: catCeilingImg,
    pexelsQuery: "white ceiling interior architecture clean lighting no text no logo",
    alt: "Pintura para techos y cielos rasos en espacio arquitectónico",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDiagnostic }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedCatImages, setLoadedCatImages] = useState<Record<string, string>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar fotos reales desde localStorage o consultar la API de Pexels con caché
  useEffect(() => {
    const initialMap: Record<string, string> = {};
    CATEGORIAS_PINTURA.forEach((cat) => {
      const cacheKey = `colorlink_hero_cat_${cat.id}`;
      try {
        const cached = localStorage.getItem(cacheKey);
        initialMap[cat.id] = cached || cat.imagenDefault;
      } catch {
        initialMap[cat.id] = cat.imagenDefault;
      }
    });
    setLoadedCatImages(initialMap);

    // Consulta en segundo plano a la API de Pexels si no está en caché
    CATEGORIAS_PINTURA.forEach(async (cat) => {
      const cacheKey = `colorlink_hero_cat_${cat.id}`;
      let cached: string | null = null;
      try {
        cached = localStorage.getItem(cacheKey);
      } catch {}

      if (!cached && PEXELS_API_KEY) {
        try {
          const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(cat.pexelsQuery)}&per_page=3&orientation=landscape`,
            {
              headers: { Authorization: PEXELS_API_KEY },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const pexelsPhoto =
              data.photos?.[0]?.src?.large2x ||
              data.photos?.[0]?.src?.large ||
              data.photos?.[0]?.src?.landscape;
            if (pexelsPhoto) {
              setLoadedCatImages((prev) => ({ ...prev, [cat.id]: pexelsPhoto }));
              try {
                localStorage.setItem(cacheKey, pexelsPhoto);
              } catch {}
            }
          }
        } catch (err) {
          console.warn(`[HeroSection] Error al consultar Pexels para ${cat.id}:`, err);
        }
      }
    });
  }, []);

  const handleCatImageError = async (catId: string, query: string) => {
    const cacheKey = `colorlink_hero_cat_${catId}`;
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
        {
          headers: { Authorization: PEXELS_API_KEY },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const pexelsPhoto =
          data.photos?.[0]?.src?.large2x ||
          data.photos?.[0]?.src?.large ||
          data.photos?.[0]?.src?.landscape;
        if (pexelsPhoto) {
          setLoadedCatImages((prev) => ({ ...prev, [catId]: pexelsPhoto }));
          try {
            localStorage.setItem(cacheKey, pexelsPhoto);
          } catch {}
        }
      }
    } catch (err) {
      console.error(`[HeroSection] Error recuperando imagen de Pexels para ${catId}:`, err);
    }
  };

  // Auto-rotación continua cada 4.5 segundos
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const irASiguiente = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const irAAnterior = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="w-full bg-[#FBFBFA]">
      {/* 1. CAROUSEL HERO CINEMATOGRÁFICO COLORLINK BY PINTUCO */}
      <section className="relative w-full overflow-hidden bg-[#00142C] select-none">
        <div className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] lg:h-[640px] overflow-hidden">
          
          {/* Slides con Crossfade y Efecto Ken Burns */}
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Imagen con zoom lento */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />

                {/* Filtro degradado para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00142C] via-[#00142C]/40 to-[#00142C]/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00142C]/90 via-[#00142C]/50 to-transparent" />

                {/* Contenido Editorial */}
                <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 md:pb-24">
                  <div className="max-w-2xl text-left">
                    
                    {/* Kicker editorial discreto */}
                    <div className="flex items-center gap-2 mb-3">
                      {slide.swatchHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-white/60 shadow-xs shrink-0"
                          style={{ backgroundColor: slide.swatchHex }}
                        />
                      )}
                      <span className="text-xs font-semibold text-[#D9A441] tracking-wider uppercase">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Titular */}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#FBF7F0] tracking-tight leading-[1.12] mb-3 drop-shadow-sm">
                      {slide.title}
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-sm sm:text-base md:text-lg text-[#F5EFE6] leading-relaxed font-normal mb-6 max-w-xl">
                      {slide.description}
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={onStartDiagnostic}
                        className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg transition-all hover:shadow-xl inline-flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                        id="btn-hero-carousel-diagnostic"
                      >
                        <span>Comenzar diagnóstico gratis</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        onClick={onStartDiagnostic}
                        className="bg-white/15 hover:bg-white/25 text-[#FBF7F0] font-semibold text-sm px-5 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer text-center"
                      >
                        Explorar paleta en el simulador
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* Botón de Pausa / Reproducción en esquina superior izquierda */}
          <div className="absolute top-5 left-5 z-30">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
              title={isPlaying ? "Pausar rotación de fotos" : "Reanudar rotación automática"}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md group"
              id="btn-carousel-pause-play"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Flechas de navegación manual */}
          <div className="absolute inset-y-0 left-3 right-3 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
            <button
              type="button"
              onClick={irAAnterior}
              aria-label="Foto anterior"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={irASiguiente}
              aria-label="Siguiente foto"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicadores inferiores */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {SLIDES.map((s, index) => {
              const isCurrent = index === currentSlide;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? "w-8 bg-[#E2622F] shadow-sm"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. BARRA DE SEGMENTOS RÁPIDOS */}
      <section className="bg-[#F5EFE6] border-b border-[#E8DFD5] py-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Hogares y Remodelación", sub: "Pinturas lavables y color a medida" },
              { title: "Maestros y Contratistas", sub: "Red de aplicadores certificados" },
              { title: "Fachadas y PH", sub: "Impermeabilización hasta 7 años" },
              { title: "Arquitectos y Diseñadores", sub: "Especificación técnica y muestras gratis" },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onStartDiagnostic}
                className="flex flex-col text-left p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E8DFD5] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-[#1A1715] group-hover:text-[#E2622F]">
                  <span>{item.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#E2622F] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] text-[#7A6A5D] mt-0.5">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: EXPLORA CATEGORÍAS DE PINTURA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B211C] tracking-tight">
              Explora Categorías de Pintura Interior
            </h2>
            <p className="text-sm text-[#7A6A5D] mt-1">
              Formulaciones de alta durabilidad por tipo de ambiente, sustrato y requerimiento estético.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="text-xs sm:text-sm font-bold text-[#E2622F] hover:text-[#C95222] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver catálogo completo ColorLink</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rejilla de 6 tarjetas: 3 columnas x 2 filas (fotos reales limpias sin marcas ni logos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIAS_PINTURA.map((cat) => {
            const currentImg = loadedCatImages[cat.id] || cat.imagenDefault;
            return (
              <div
                key={cat.id}
                onClick={onStartDiagnostic}
                className="group flex flex-col cursor-pointer"
              >
                {/* Contenedor de Imagen de la escena limpia sin marcas ni empaques */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E8DFD5] shadow-xs group-hover:shadow-md group-hover:border-[#E2622F]/60 transition-all">
                  <img
                    src={currentImg}
                    alt={cat.alt}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={() => handleCatImageError(cat.id, cat.pexelsQuery)}
                  />
                </div>

                {/* Título de la categoría con Chevron debajo de la imagen */}
                <div className="pt-3.5 flex items-center justify-between">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2B211C] group-hover:text-[#E2622F] transition-colors flex items-center gap-1.5">
                    <span>{cat.nombre}</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5] text-[#1A1715] group-hover:text-[#E2622F] group-hover:translate-x-1 transition-all" />
                  </h3>
                </div>
                <p className="text-xs text-[#7A6A5D] mt-1 leading-snug">
                  {cat.lineas}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
