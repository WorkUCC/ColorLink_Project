import React, { useState, useRef } from "react";
import {
  Paintbrush,
  ShieldCheck,
  PhoneCall,
  User,
  Sparkles,
  Layers,
  Truck,
  Award,
  Check,
  ChevronDown,
  Menu,
  X,
  Home,
  LayoutGrid,
  Maximize2,
  Umbrella,
  TreePine,
  ShieldAlert,
  Palette,
  Users,
  Briefcase,
  Building2,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import { UserProfile, ProjectNeedState, SurfaceId } from "../types";
import { DEMO_PRESETS } from "../data/pintucoData";

interface HeaderProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onLoadPreset: (preset: typeof DEMO_PRESETS[0]) => void;
  projectNeed: ProjectNeedState;
  segmentoElegido?: string | null;
  onSelectSegmento?: (segmento: string) => void;
  onClearSegmento?: () => void;
  onSelectSurface?: (surface: SurfaceId) => void;
  onGoToColorVisualizer?: () => void;
  onGoToTracking?: () => void;
  onGoToWarranty?: () => void;
  onHighlightHotline?: () => void;
  isHotlineHighlighted?: boolean;
  onOpenLoginModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateStep,
  user,
  onLogout,
  onLoadPreset,
  projectNeed,
  segmentoElegido,
  onSelectSegmento,
  onClearSegmento,
  onSelectSurface,
  onGoToColorVisualizer,
  onGoToTracking,
  onGoToWarranty,
  onHighlightHotline,
  isHotlineHighlighted,
  onOpenLoginModal,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    { num: 1, label: "Acceso", subtitle: "Identificación de cliente", icon: User },
    { num: 2, label: "Diagnóstico", subtitle: "Requerimientos y superficie", icon: Layers },
    { num: 3, label: "Solución técnica", subtitle: "Recomendación y cálculo", icon: Sparkles },
    { num: 4, label: "Disponibilidad", subtitle: "Inventario y logística", icon: Truck },
    { num: 5, label: "Servicio y ruta", subtitle: "Asignación y cuadrilla", icon: Paintbrush },
    { num: 6, label: "Garantía 360", subtitle: "Certificación y respaldo", icon: Award },
  ];

  const handleMouseEnter = (menuKey: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Manejadores para cada opción del menú desplegable
  const handleSurfaceClick = (surface: SurfaceId) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onSelectSurface) {
      onSelectSurface(surface);
    } else {
      onNavigateStep(2);
    }
  };

  const handleColorVisualizerClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onGoToColorVisualizer) {
      onGoToColorVisualizer();
    } else {
      onNavigateStep(2);
    }
  };

  const handleSegmentoClick = (segmento: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onSelectSegmento) {
      onSelectSegmento(segmento);
    } else {
      onNavigateStep(1);
    }
  };

  const handleTrackingClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onGoToTracking) {
      onGoToTracking();
    } else {
      onNavigateStep(5);
    }
  };

  const handleWarrantyClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onGoToWarranty) {
      onGoToWarranty();
    } else {
      onNavigateStep(6);
    }
  };

  const handleHotlineClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onHighlightHotline) {
      onHighlightHotline();
    }
    window.location.href = "tel:018000111404";
  };

  const handlePresetClick = (preset: typeof DEMO_PRESETS[0]) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    onLoadPreset(preset);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#001D40] text-white border-b border-stone-800 shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
      {/* 1. Barra de información superior */}
      <div className="bg-[#00142C] px-4 py-1.5 text-xs text-stone-300 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[#00A896] font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Canal oficial Pintuco Colombia
          </span>
          <span className="hidden md:inline text-stone-400">·</span>
          <span className="hidden md:inline text-stone-300 text-[11px]">
            Diagnóstico asistido, tinturado de fábrica y maestros certificados
          </span>
        </div>

        {/* Acceso rápido a casos y línea técnica */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          <span className="text-stone-400 hidden lg:inline">Casos rápidos:</span>
          <div className="flex items-center gap-1">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onLoadPreset(preset)}
                className="bg-white/10 hover:bg-[#00A896] hover:text-white text-stone-200 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
                title={preset.subtitle}
              >
                {idx === 0 ? "Fachada Bogotá" : idx === 1 ? "Interior Medellín" : "Piso Cali"}
              </button>
            ))}
          </div>

          <a
            id="header-hotline-link"
            href="tel:018000111404"
            className={`inline-flex items-center gap-1 text-stone-300 hover:text-white transition px-2 py-0.5 rounded ${
              isHotlineHighlighted
                ? "bg-[#00A896] text-white ring-2 ring-[#00A896]/50 animate-pulse font-bold"
                : ""
            }`}
          >
            <PhoneCall className="w-3 h-3 text-[#00A896]" /> Línea técnica: 018000 111 404
          </a>
        </div>
      </div>

      {/* 2. Barra principal de marca y usuario */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo ColorLink by Pintuco */}
        <div
          onClick={() => onNavigateStep(2)}
          className="flex items-center gap-3 cursor-pointer group"
          id="btn-brand-home"
        >
          <div className="w-10 h-10 rounded-lg bg-[#00A896] flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shrink-0 shadow-xs">
            <Paintbrush className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">ColorLink</span>
              <span className="text-[11px] font-bold text-[#00A896] bg-[#00A896]/15 px-1.5 py-0.5 rounded">
                by Pintuco
              </span>
            </div>
            <p className="text-[11px] text-stone-300 font-normal">
              Ecosistema técnico de pintura y acabados
            </p>
          </div>
        </div>

        {/* Estado del usuario y botón de login / logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-stone-300 capitalize">
                {user.type === "hogar"
                  ? "Cliente hogar"
                  : user.type === "contratista"
                  ? "Maestro contratista"
                  : "Cliente empresarial"} · {user.city.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs border border-white/20 hover:bg-white/10 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
              id="btn-logout"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex text-xs text-stone-300 items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Modo cotizador abierto
            </span>
            <button
              onClick={() => (onOpenLoginModal ? onOpenLoginModal() : onNavigateStep(1))}
              className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              id="btn-login-header"
            >
              <User className="w-3.5 h-3.5" />
              <span>Iniciar sesión</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. BARRA DE NAVEGACIÓN SECUNDARIA CON MENÚS DESPLEGABLES (Estándar Sherwin-Williams) */}
      <nav className="w-full bg-[#FAFAF9] text-[#1C1917] border-t border-b border-[#E7E5E4] shadow-xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Menú de escritorio (5 ítems horizontales con desplegables al pasar el mouse) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            
            {/* ÍTEM 1: Diagnóstico y Soluciones */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("diagnostico")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === "diagnostico" ? null : "diagnostico"))}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs lg:text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
                  openDropdown === "diagnostico"
                    ? "border-[#00A896] text-[#00A896] bg-stone-100/50"
                    : "border-transparent text-[#1C1917] hover:text-[#00A896]"
                }`}
              >
                <span>Diagnóstico y Soluciones</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === "diagnostico" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {openDropdown === "diagnostico" && (
                <div
                  className="absolute left-0 top-full w-80 bg-white rounded-b-xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter("diagnostico")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    Selecciona superficie para diagnosticar
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("fachadas_exteriores")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Fachadas y Muros Exteriores
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Pinturas elásticas e impermeabilización Koraza
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("paredes_interiores")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Paredes y Cielorrasos Interiores
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Viniltex lavable y acabados mate sedoso
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("madera_decks")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <TreePine className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Madera, Decks y Muebles
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Maderprotect, filtros UV y barnices nobles
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("metales_estructuras")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Metales, Rejas y Estructuras
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Pintulux 3 en 1 anticorrosivo y esmaltes
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("pisos_garajes")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Pisos, Garajes y Canchas
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Epóxicos de alta resistencia al tráfico
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("techos_cubiertas")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Umbrella className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Techos e Impermeabilización
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Sellantes acrílicos y barreras antihumedad
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ÍTEM 2: Encuentra tu Color */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("color")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === "color" ? null : "color"))}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs lg:text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
                  openDropdown === "color"
                    ? "border-[#00A896] text-[#00A896] bg-stone-100/50"
                    : "border-transparent text-[#1C1917] hover:text-[#00A896]"
                }`}
              >
                <span>Encuentra tu Color</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === "color" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {openDropdown === "color" && (
                <div
                  className="absolute left-0 top-full w-80 bg-white rounded-b-xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter("color")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    Herramientas de Color
                  </div>
                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Paintbrush className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Simulador de Color
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Prueba en salas, fachadas y baños reales antes/después
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Color del Año 2026
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Paleta Verde Celadón y armonías arquitectónicas
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Ver catálogo de colores
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Más de 1.000 fórmulas tinturadas con exactitud
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ÍTEM 3: Para Profesionales */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("profesionales")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === "profesionales" ? null : "profesionales"))}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs lg:text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
                  openDropdown === "profesionales"
                    ? "border-[#00A896] text-[#00A896] bg-stone-100/50"
                    : "border-transparent text-[#1C1917] hover:text-[#00A896]"
                }`}
              >
                <span>Para Profesionales</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === "profesionales" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {openDropdown === "profesionales" && (
                <div
                  className="absolute left-0 top-full w-80 bg-white rounded-b-xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter("profesionales")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    Segmentos Especializados
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Contratistas y Maestros")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Contratistas y Maestros
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Tarifas de volumen, cuñetes de obra y cuadrillas
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Diseñadores y Arquitectos")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Diseñadores y Arquitectos
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Especificación técnica de obra y cartas de color
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Fachadas y PH")}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Fachadas y PH (Propiedad Horizontal)
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Garantías hasta 7 años para copropiedades y edificios
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ÍTEM 4: Servicio y Garantía */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("servicio")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === "servicio" ? null : "servicio"))}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs lg:text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
                  openDropdown === "servicio"
                    ? "border-[#00A896] text-[#00A896] bg-stone-100/50"
                    : "border-transparent text-[#1C1917] hover:text-[#00A896]"
                }`}
              >
                <span>Servicio y Garantía</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === "servicio" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {openDropdown === "servicio" && (
                <div
                  className="absolute left-0 top-full w-80 bg-white rounded-b-xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter("servicio")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    Acompañamiento Técnico
                  </div>
                  <button
                    type="button"
                    onClick={handleTrackingClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Seguimiento de tu Pedido
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Rastreo de tinturado, despacho express y ruta GPS
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleWarrantyClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Garantía 360
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Póliza certificada de fábrica en producto y aplicación
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleHotlineClick}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                        Línea Técnica Oficial
                      </p>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        018000 111 404 · Asesoría con ingenieros Pintuco
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ÍTEM 5: Ofertas y Casos Rápidos */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("ofertas")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => (prev === "ofertas" ? null : "ofertas"))}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs lg:text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
                  openDropdown === "ofertas"
                    ? "border-[#00A896] text-[#00A896] bg-stone-100/50"
                    : "border-transparent text-[#1C1917] hover:text-[#00A896]"
                }`}
              >
                <span>Ofertas y Casos Rápidos</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === "ofertas" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Menú desplegable */}
              {openDropdown === "ofertas" && (
                <div
                  className="absolute left-0 top-full w-80 bg-white rounded-b-xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter("ofertas")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    Cargar presets de demostración
                  </div>
                  {DEMO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50 text-left transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-[#00A896] text-[#00A896] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        {idx === 0 ? <Building2 className="w-4 h-4" /> : idx === 1 ? <Home className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#00A896] transition-colors">
                          {idx === 0
                            ? "Fachada Bogotá (Koraza 7 Años)"
                            : idx === 1
                            ? "Interior Medellín (Viniltex Vida)"
                            : "Piso Cali (Epóxico Tráfico)"}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-tight">
                          {preset.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Lado derecho: Chip de Sesión/Contexto Profesional (si está seleccionado) */}
          <div className="flex items-center gap-2 py-2">
            {segmentoElegido ? (
              <div className="flex items-center gap-2 bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/30 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00A896] animate-pulse" />
                <span>Sesión: {segmentoElegido}</span>
                {onClearSegmento && (
                  <button
                    type="button"
                    onClick={onClearSegmento}
                    className="ml-1 text-stone-500 hover:text-stone-900 transition cursor-pointer text-[11px] underline"
                    title="Restablecer sesión"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Puntos de venta y tinturado conectados</span>
              </div>
            )}

            {/* Botón menú móvil (hamburguesa) */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 text-stone-700 hover:text-[#00A896] rounded-lg transition"
                aria-label="Abrir menú de navegación"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* 4. Menú desplegable para móviles (Acordeón colapsable) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 px-4 py-3 space-y-2 shadow-lg">
            
            {/* Acordeón 1: Diagnóstico y Soluciones */}
            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCategory((prev) => (prev === "diagnostico" ? null : "diagnostico"))
                }
                className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917] py-2 text-left"
              >
                <span>Diagnóstico y Soluciones</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCategory === "diagnostico" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>
              {mobileExpandedCategory === "diagnostico" && (
                <div className="pl-3 space-y-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("fachadas_exteriores")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Fachadas y Muros Exteriores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("paredes_interiores")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Paredes y Cielorrasos Interiores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("madera_decks")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <TreePine className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Madera, Decks y Muebles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("metales_estructuras")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Metales, Rejas y Estructuras</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("pisos_garajes")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Pisos, Garajes y Canchas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSurfaceClick("techos_cubiertas")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Umbrella className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Techos e Impermeabilización</span>
                  </button>
                </div>
              )}
            </div>

            {/* Acordeón 2: Encuentra tu Color */}
            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                onClick={() => setMobileExpandedCategory((prev) => (prev === "color" ? null : "color"))}
                className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917] py-2 text-left"
              >
                <span>Encuentra tu Color</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCategory === "color" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>
              {mobileExpandedCategory === "color" && (
                <div className="pl-3 space-y-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Paintbrush className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Simulador de Color</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Color del Año 2026</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleColorVisualizerClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Palette className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Ver catálogo de colores</span>
                  </button>
                </div>
              )}
            </div>

            {/* Acordeón 3: Para Profesionales */}
            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCategory((prev) => (prev === "profesionales" ? null : "profesionales"))
                }
                className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917] py-2 text-left"
              >
                <span>Para Profesionales</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCategory === "profesionales" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>
              {mobileExpandedCategory === "profesionales" && (
                <div className="pl-3 space-y-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Contratistas y Maestros")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Contratistas y Maestros</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Diseñadores y Arquitectos")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Diseñadores y Arquitectos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSegmentoClick("Fachadas y PH")}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Fachadas y PH</span>
                  </button>
                </div>
              )}
            </div>

            {/* Acordeón 4: Servicio y Garantía */}
            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCategory((prev) => (prev === "servicio" ? null : "servicio"))
                }
                className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917] py-2 text-left"
              >
                <span>Servicio y Garantía</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCategory === "servicio" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>
              {mobileExpandedCategory === "servicio" && (
                <div className="pl-3 space-y-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={handleTrackingClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Seguimiento de tu Pedido</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWarrantyClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <Award className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Garantía 360</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleHotlineClick}
                    className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Línea técnica: 018000 111 404</span>
                  </button>
                </div>
              )}
            </div>

            {/* Acordeón 5: Ofertas y Casos Rápidos */}
            <div className="pb-1">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCategory((prev) => (prev === "ofertas" ? null : "ofertas"))
                }
                className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917] py-2 text-left"
              >
                <span>Ofertas y Casos Rápidos</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCategory === "ofertas" ? "rotate-180 text-[#00A896]" : "text-stone-400"
                  }`}
                />
              </button>
              {mobileExpandedCategory === "ofertas" && (
                <div className="pl-3 space-y-1.5 pt-1 text-xs">
                  {DEMO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="w-full text-left py-1.5 text-stone-700 hover:text-[#00A896] font-medium flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 text-[#00A896]" />
                      <span>{preset.title} ({preset.data.city.split(" ")[0]})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </nav>

      {/* 4. Progressive Reveal Stepper (Pasos 1 a 6) */}
      <div className="bg-[#001733] border-t border-white/10 px-4 py-2.5 sm:py-3">
        <div className="max-w-5xl mx-auto">
          {/* Mobile view (< md): Current step badge + name + slim progress bar */}
          <div className="md:hidden flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00A896] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentStep}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {steps.find((s) => s.num === currentStep)?.label || `Paso ${currentStep}`}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    ({currentStep} de {steps.length})
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#00A896]">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>

            {/* Thin progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00A896] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop view (>= md): Progressive reveal stepper */}
          <div className="hidden md:flex items-center justify-between w-full">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <React.Fragment key={step.num}>
                  {/* Step node */}
                  {isCompleted ? (
                    <button
                      type="button"
                      onClick={() => onNavigateStep(step.num)}
                      className="w-6 h-6 rounded-full bg-[#00A896] hover:bg-[#009282] text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-xs shrink-0 focus:outline-none"
                      title={`Paso ${step.num} completado: ${step.label} (Clic para volver)`}
                      id={`step-nav-${step.num}`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                    </button>
                  ) : isActive ? (
                    <div
                      className="flex items-center gap-3 shrink-0"
                      id={`step-nav-${step.num}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#00A896] text-white flex items-center justify-center font-bold text-sm ring-4 ring-[#00A896]/25 shadow-sm shrink-0">
                        {step.num}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase tracking-wider text-[#00A896] font-bold leading-tight">
                          Paso {step.num}
                        </span>
                        <span className="text-sm font-bold text-white whitespace-nowrap leading-tight">
                          {step.label}
                        </span>
                        <span className="text-[11px] text-stone-300 whitespace-nowrap font-normal leading-tight hidden lg:inline">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-stone-400 flex items-center justify-center text-xs font-medium opacity-50 cursor-not-allowed shrink-0 select-none"
                      title={`Paso ${step.num}: ${step.label} (Se desbloqueará al avanzar)`}
                      id={`step-nav-${step.num}`}
                    >
                      {step.num}
                    </div>
                  )}

                  {/* Línea conectora */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 mx-2.5 lg:mx-4 h-[2px] rounded-full bg-white/10 relative overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentStep > step.num ? "bg-[#00A896] w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
