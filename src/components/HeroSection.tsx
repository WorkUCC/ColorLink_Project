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

// 8 Fotografías reales de insumos y suministros para la cuadrícula
import supplyBrushesImg from "../assets/images/supply_brushes_1790413404062.jpg";
import supplyRollersImg from "../assets/images/supply_rollers_1790413416433.jpg";
import supplyToolsImg from "../assets/images/supply_tools_1790413430366.jpg";
import supplyTapeImg from "../assets/images/supply_tape_1790413444631.jpg";
import supplyDropclothImg from "../assets/images/supply_dropcloth_1790413459131.jpg";
import supplyTrayImg from "../assets/images/supply_tray_1790413473121.jpg";
import supplyCaulkImg from "../assets/images/supply_caulk_1790413486214.jpg";
import supplySandpaperImg from "../assets/images/supply_sandpaper_1790413500087.jpg";

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
    swatchName: "Teal ColorLink",
    swatchHex: "#00A896",
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
    swatchName: "Azul Pintuco",
    swatchHex: "#001D40",
  },
];

// 6 Categorías de pintura interior (Exacto a la captura de pantalla: "Explore Interior Paint Categories")
const CATEGORIAS_PINTURA = [
  {
    id: "interior-paints",
    nombre: "Pinturas de Interior",
    nombreIngles: "Interior Paints",
    lineas: "Viniltex Avanzado, Viniltex Vida, Baños y Cocinas",
    imagen: catInteriorImg,
    alt: "Pinturas de interior sobre pared con molduras",
  },
  {
    id: "interior-primers",
    nombre: "Imprimantes y Selladores",
    nombreIngles: "Interior Primers",
    lineas: "Sellador 501, Primer Acrílico, Barrera Antihumedad",
    imagen: catPrimersImg,
    alt: "Imprimantes y selladores para preparación de muros",
  },
  {
    id: "wood-stains",
    nombre: "Maderas, Tintes y Barnices",
    nombreIngles: "Wood Stains, Sealants & Topcoats",
    lineas: "Maderprotect, Barniz Poliuretano, Tintes al Aceite",
    imagen: catWoodImg,
    alt: "Tintes y barnices para madera en mesón y mobiliario",
  },
  {
    id: "concrete-masonry",
    nombre: "Concreto y Mampostería",
    nombreIngles: "Concrete & Masonry",
    lineas: "Koraza Mampostería, Pintura para Ladrillo y Morteros",
    imagen: catMasonryImg,
    alt: "Pintura para concreto y chimenea de ladrillo blanco",
  },
  {
    id: "aerosols",
    nombre: "Aerosoles y Esmaltes",
    nombreIngles: "Aerosols",
    lineas: "Aerocolor Pintuco, Pintulux Esmalte Secado Rápido",
    imagen: catAerosolsImg,
    alt: "Aerosoles y esmaltes sobre mueble credenza azul",
  },
  {
    id: "ceiling-paint",
    nombre: "Pintura para Techos y Cielos Rasos",
    nombreIngles: "Ceiling Paint",
    lineas: "Cielos Rasos Antirreflejo Blanco Nube, Antigoteo",
    imagen: catCeilingImg,
    alt: "Pintura para techos y cielos rasos con ventana arqueada",
  },
];

// 8 Categorías de insumos con fotografía de producto real (exacto al catálogo visual)
const INSUMOS = [
  {
    nombre: "BROCHAS",
    detalle: "Brochas de cerda fina y angular",
    imagen: supplyBrushesImg,
    alt: "Brochas profesionales de pintura",
  },
  {
    nombre: "RODILLOS Y FELPAS",
    detalle: "Felpas de microfibra antigoteo",
    imagen: supplyRollersImg,
    alt: "Rodillos y marcos de aplicación",
  },
  {
    nombre: "HERRAMIENTAS DE OBRA",
    detalle: "Escaleras, espátulas y alargadores",
    imagen: supplyToolsImg,
    alt: "Herramientas profesionales de pintor",
  },
  {
    nombre: "CINTAS DE ENMASCARAR",
    detalle: "Cintas azul y beige de precisión",
    imagen: supplyTapeImg,
    alt: "Cintas de enmascarar para bordes nítidos",
  },
  {
    nombre: "PLÁSTICOS Y MANTAS",
    detalle: "Protección textil y plástico grueso",
    imagen: supplyDropclothImg,
    alt: "Mantas protectoras de piso para pintura",
  },
  {
    nombre: "BANDEJAS Y CUBETAS",
    detalle: "Bandejas con liner descartable",
    imagen: supplyTrayImg,
    alt: "Bandejas plásticas y cubetas de pintura",
  },
  {
    nombre: "MASILLAS Y SELLANTES",
    detalle: "Pistolas de calafateo y masilla acrílica",
    imagen: supplyCaulkImg,
    alt: "Masillas y sellantes de grietas",
  },
  {
    nombre: "LIJAS Y ABRASIVOS",
    detalle: "Hojas y discos grano fino a medio",
    imagen: supplySandpaperImg,
    alt: "Hojas de lija para preparación de muro",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDiagnostic }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                    
                    {/* Badge ColorLink con Swatch */}
                    <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                      {slide.swatchHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs shrink-0"
                          style={{ backgroundColor: slide.swatchHex }}
                        />
                      )}
                      <span className="text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Titular */}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-3 drop-shadow-sm">
                      {slide.title}
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed font-normal mb-6 max-w-xl drop-shadow-xs">
                      {slide.description}
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={onStartDiagnostic}
                        className="bg-[#00A896] hover:bg-[#009282] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg transition-all hover:shadow-xl inline-flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                        id="btn-hero-carousel-diagnostic"
                      >
                        <span>Comenzar diagnóstico gratis</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        onClick={onStartDiagnostic}
                        className="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer text-center"
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
                      ? "w-8 bg-[#00A896] shadow-sm"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. BARRA DE SEGMENTOS RÁPIDOS */}
      <section className="bg-white border-b border-[#E7E5E4] py-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
                className="flex flex-col text-left p-2.5 rounded-lg hover:bg-stone-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-[#001D40] group-hover:text-[#00A896]">
                  <span>{item.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00A896] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] text-stone-500 mt-0.5">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: EXPLORA CATEGORÍAS DE PINTURA (Exacto a la captura de pantalla del usuario) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
              Explora Categorías de Pintura Interior
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Formulaciones de alta durabilidad por tipo de ambiente, sustrato y requerimiento estético.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="text-xs sm:text-sm font-bold text-[#00A896] hover:text-[#009282] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver catálogo completo ColorLink</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rejilla de 6 tarjetas: 3 columnas x 2 filas (exacto a la imagen del usuario) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIAS_PINTURA.map((cat) => (
            <div
              key={cat.id}
              onClick={onStartDiagnostic}
              className="group flex flex-col cursor-pointer"
            >
              {/* Contenedor de Imagen de la escena con lata integrada en esquina */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 border border-[#E7E5E4] shadow-xs group-hover:shadow-md group-hover:border-[#00A896]/60 transition-all">
                <img
                  src={cat.imagen}
                  alt={cat.alt}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
              </div>

              {/* Título de la categoría con Chevron debajo de la imagen */}
              <div className="pt-3.5 flex items-center justify-between">
                <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917] group-hover:text-[#00A896] transition-colors flex items-center gap-1.5">
                  <span>{cat.nombre}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5] text-[#001D40] group-hover:text-[#00A896] group-hover:translate-x-1 transition-all" />
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                {cat.lineas}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SHOWCASE EDITORIAL COLORLINK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
              Pilares de Confianza
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] tracking-tight">
              Excelencia técnica en cada capa
            </h2>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="text-xs sm:text-sm font-bold text-[#001D40] hover:text-[#00A896] transition-colors flex items-center gap-1 group cursor-pointer"
          >
            <span>Ver portafolio de soluciones</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tarjeta 1: Tendencia de Color */}
          <div
            onClick={onStartDiagnostic}
            className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all flex flex-col cursor-pointer hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src={credenzaVaseImg}
                alt="Tendencias de color con molduras y jarrón"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-stone-200 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#8A9A7B] border border-stone-300" />
                <span className="text-[11px] font-bold text-stone-800">Celadón · 2026</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A896]">
                  Tendencias & Acabados
                </span>
                <h3 className="font-extrabold text-[#1C1917] text-base group-hover:text-[#00A896] transition-colors mt-1">
                  Color del Año y Paletas de Autor
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Ambientes diseñados para reflejar calma y luminosidad con fórmulas Viniltex ultra-lavables.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center text-xs font-bold text-[#001D40] group-hover:text-[#00A896]">
                <span>Explorar paletas en el simulador</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Maestros Certificados */}
          <div
            onClick={onStartDiagnostic}
            className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all flex flex-col cursor-pointer hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src={paintersPlanningImg}
                alt="Maestros pintores certificados revisando planos técnicos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#001D40]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                <Users className="w-3.5 h-3.5 text-[#00A896]" />
                <span>+1.200 Aplicadores</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A896]">
                  Mano de Obra Calificada
                </span>
                <h3 className="font-extrabold text-[#1C1917] text-base group-hover:text-[#00A896] transition-colors mt-1">
                  Maestros Certificados de Fábrica
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Operarios capacitados en preparación de sustratos, dosificación y aplicación con garantía.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center text-xs font-bold text-[#001D40] group-hover:text-[#00A896]">
                <span>Solicitar cuadrilla certificada</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Protección Arquitectónica */}
          <div
            onClick={onStartDiagnostic}
            className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all flex flex-col cursor-pointer hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src={facadeArchImg}
                alt="Fachada moderna de alto desempeño arquitectónico"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Hasta 7 Años</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A896]">
                  Desempeño & Clima
                </span>
                <h3 className="font-extrabold text-[#1C1917] text-base group-hover:text-[#00A896] transition-colors mt-1">
                  Protección de Fachadas 360
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Recubrimientos elásticos, hidrofóbicos y resistentes a rayos UV con garantía extendida.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center text-xs font-bold text-[#001D40] group-hover:text-[#00A896]">
                <span>Conocer sellos y garantías</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Baños & Cocinas */}
          <div
            onClick={onStartDiagnostic}
            className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all flex flex-col cursor-pointer hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src={luxuryBathroomImg}
                alt="Baño contemporáneo con tina y paredes impermeables"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#00A896]/95 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Antihumedad</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A896]">
                  Líneas Especiales
                </span>
                <h3 className="font-extrabold text-[#1C1917] text-base group-hover:text-[#00A896] transition-colors mt-1">
                  Baños & Cocinas Ultra-Lavables
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Fórmula de alta lavabilidad con fungicidas que previenen manchas de moho y humedad por vapor.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center text-xs font-bold text-[#001D40] group-hover:text-[#00A896]">
                <span>Cotizar línea especial</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN INSUMOS Y HERRAMIENTAS CON FOTOGRAFÍAS REALES DE CATÁLOGO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
              Insumos para tu Proyecto
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Herramientas y accesorios de aplicación profesional incluidos en tu cotización técnica ColorLink.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="text-xs sm:text-sm font-bold text-[#00A896] hover:text-[#009282] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver insumos recomendados</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rejilla de 8 tarjetas con fotografía de producto real */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {INSUMOS.map((item, idx) => (
            <div
              key={idx}
              onClick={onStartDiagnostic}
              className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden shadow-xs hover:shadow-md hover:border-[#00A896] transition-all flex flex-col cursor-pointer hover:-translate-y-0.5"
            >
              {/* Imagen de producto real */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={item.imagen}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Barra inferior blanca con título en mayúsculas negrita centrado */}
              <div className="p-3.5 sm:p-4 text-center bg-white border-t border-stone-100 flex flex-col items-center justify-center min-h-[64px]">
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1C1917] tracking-wide uppercase group-hover:text-[#00A896] transition-colors leading-snug">
                  {item.nombre}
                </h3>
                <span className="text-[11px] text-stone-400 mt-0.5 hidden sm:inline">
                  {item.detalle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
