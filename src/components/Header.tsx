import React, { useState, useRef, useEffect } from "react";
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
  Compass,
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
  HelpCircle,
  ExternalLink,
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

const AVATAR_IMG = "/src/assets/images/asesor_avatar_1791011367910.jpg";

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
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const steps = [
    { num: 1, label: "Acceso", subtitle: "Identificación", icon: User },
    { num: 2, label: "Diagnóstico", subtitle: "Superficie y área", icon: Layers },
    { num: 3, label: "Solución técnica", subtitle: "Cálculo y resina", icon: Sparkles },
    { num: 4, label: "Disponibilidad", subtitle: "Inventario en tienda", icon: Truck },
    { num: 5, label: "Servicio y ruta", subtitle: "Maestro y despacho", icon: Paintbrush },
    { num: 6, label: "Garantía 360", subtitle: "Póliza oficial", icon: Award },
  ];

  // Cerrar el panel Explorar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    if (isExploreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExploreOpen]);

  // Manejadores de navegación de opciones dentro del panel Explorar
  const handleSurfaceClick = (surface: SurfaceId) => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onSelectSurface) {
      onSelectSurface(surface);
    } else {
      onNavigateStep(2);
    }
  };

  const handleColorVisualizerClick = () => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onGoToColorVisualizer) {
      onGoToColorVisualizer();
    } else {
      onNavigateStep(2);
    }
  };

  const handleSegmentoClick = (segmento: string) => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onSelectSegmento) {
      onSelectSegmento(segmento);
    } else {
      onNavigateStep(1);
    }
  };

  const handleTrackingClick = () => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onGoToTracking) {
      onGoToTracking();
    } else {
      onNavigateStep(5);
    }
  };

  const handleWarrantyClick = () => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onGoToWarranty) {
      onGoToWarranty();
    } else {
      onNavigateStep(6);
    }
  };

  const handleHotlineClick = () => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    if (onHighlightHotline) {
      onHighlightHotline();
    }
    window.location.href = "tel:018000111404";
  };

  const handlePresetClick = (preset: typeof DEMO_PRESETS[0]) => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
    onLoadPreset(preset);
  };

  const handleOpenAdvisor = () => {
    const btn = document.getElementById("btn-virtual-advisor");
    if (btn) btn.click();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1A1715] text-[#FBF7F0] border-b border-[#2B211C]/80 shadow-md">
      {/* 1. BARRA PRINCIPAL ÚNICA (Storefront contemporáneo en grafito cálido #1A1715) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* LOGO COLORLINK BY PINTUCO */}
        <div
          onClick={() => onNavigateStep(2)}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          id="btn-brand-home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2622F] to-[#F2A93C] flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shrink-0 shadow-md">
            <Paintbrush className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#FBF7F0]">
                ColorLink
              </span>
              <span className="text-[10px] font-bold text-[#F2A93C] bg-[#F2A93C]/15 px-1.5 py-0.5 rounded">
                by Pintuco
              </span>
            </div>
            <span className="text-[10px] text-[#CDBEAF] hidden sm:block tracking-wide">
              Canal Oficial · Especificación Técnica Pintuco
            </span>
          </div>
        </div>

        {/* ACCIONES PRINCIPALES EN UNA SOLA FILA (Explorar, Sofía, Login/Perfil) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Chip de Segmento activo si existe */}
          {segmentoElegido && (
            <div className="hidden lg:flex items-center gap-1.5 bg-black/40 text-[#F2A93C] border border-[#F2A93C]/30 text-xs px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2A93C] animate-pulse" />
              <span className="font-medium text-[11px] capitalize">Sesión: {segmentoElegido}</span>
              {onClearSegmento && (
                <button
                  type="button"
                  onClick={onClearSegmento}
                  className="hover:text-white transition ml-0.5 text-stone-400"
                  title="Cambiar segmento"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* BOTÓN EXPLORAR (Despliega el mega-menú visual con las 5 secciones) */}
          <div className="relative" ref={exploreRef}>
            <button
              type="button"
              onClick={() => setIsExploreOpen(!isExploreOpen)}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                isExploreOpen
                  ? "bg-gradient-to-br from-[#E2622F] to-[#F2A93C] text-white border-transparent shadow-sm"
                  : "bg-white/10 hover:bg-white/15 text-[#FBF7F0] border-white/15 hover:border-white/30"
              }`}
              id="btn-header-explore"
              aria-expanded={isExploreOpen}
            >
              <Compass className={`w-4 h-4 ${isExploreOpen ? "text-white" : "text-[#F2A93C]"}`} />
              <span className="hidden xs:inline">Explorar</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExploreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* PANEL MEGA-MENÚ STOREFRONT "EXPLORAR" (Moderno, 3 columnas) */}
            {isExploreOpen && (
              <div
                className="absolute right-0 sm:left-auto mt-2 w-[92vw] sm:w-[720px] max-h-[85vh] overflow-y-auto bg-[#FBF7F0] text-[#2B211C] rounded-2xl shadow-2xl border border-[#E8DFD5] p-5 sm:p-6 z-50 animate-scaleUp"
                role="menu"
              >
                {/* Header del Panel */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E8DFD5]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E2622F]/10 text-[#E2622F] flex items-center justify-center font-bold">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2B211C] leading-none">
                        Catálogo & Soluciones ColorLink
                      </h4>
                      <p className="text-[11px] text-[#7A6A5D] mt-0.5">
                        Selecciona tu necesidad o explora herramientas de diseño
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen(false)}
                    className="p-1.5 rounded-lg text-[#7A6A5D] hover:text-[#2B211C] hover:bg-[#F5EFE6] transition cursor-pointer"
                    aria-label="Cerrar panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid de 3 Columnas Temáticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* COLUMNA 1: Diagnóstico por Superficie */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2622F] block">
                      1. Diagnóstico por Superficie
                    </span>
                    <div className="space-y-1">
                      {[
                        { id: "paredes_interiores", label: "Paredes Interiores", sub: "Viniltex lavable", icon: Home },
                        { id: "fachadas_exteriores", label: "Fachadas Exteriores", sub: "Koraza climática", icon: Umbrella },
                        { id: "banos_cocinas", label: "Baños y Cocinas", sub: "Aquaprotec antihumedad", icon: ShieldAlert },
                        { id: "madera_decks", label: "Maderas y Decks", sub: "Maderprotect poro abierto", icon: TreePine },
                        { id: "metales_estructuras", label: "Metales & Rejas", sub: "Pintulux 3 en 1", icon: ShieldCheck },
                        { id: "pisos_garajes", label: "Pisos y Garajes", sub: "Epóxicos alto tráfico", icon: LayoutGrid },
                      ].map((surf) => {
                        const Icon = surf.icon;
                        return (
                          <button
                            key={surf.id}
                            type="button"
                            onClick={() => handleSurfaceClick(surf.id as SurfaceId)}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E8DFD5] transition-all text-left cursor-pointer group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] text-[#7A6A5D] group-hover:bg-[#E2622F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-[#2B211C] block text-[11px] leading-tight">
                                {surf.label}
                              </span>
                              <span className="text-[10px] text-[#7A6A5D] block leading-tight">
                                {surf.sub}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* COLUMNA 2: Color y Casos Rápidos */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7C59] block mb-2">
                        2. Color & Simulación en Vivo
                      </span>
                      <div
                        onClick={handleColorVisualizerClick}
                        className="p-3 rounded-xl bg-gradient-to-br from-[#6B7C59]/10 to-[#E2622F]/10 border border-[#6B7C59]/20 hover:border-[#6B7C59] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 text-[#6B7C59] font-bold text-xs mb-1">
                          <Palette className="w-4 h-4" />
                          <span>Simulador Arquitectónico</span>
                        </div>
                        <p className="text-[11px] text-[#7A6A5D] leading-snug">
                          Recorte de paredes con antes/después y prueba de tonos Pintuco 2026.
                        </p>
                        <span className="text-[10px] font-bold text-[#6B7C59] mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Probar simulador →
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2A93C] block mb-1.5">
                        Casos Rápidos de Obra
                      </span>
                      <div className="space-y-1">
                        {DEMO_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handlePresetClick(p)}
                            className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-[#E8DFD5] hover:border-[#E2622F] text-left transition cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-[#2B211C] block text-[11px]">
                                {idx === 0 ? "Fachada Bogotá" : idx === 1 ? "Interior Medellín" : "Piso Cali"}
                              </span>
                              <span className="text-[10px] text-[#7A6A5D] block">
                                {p.data.city} · {p.data.areaM2} m²
                              </span>
                            </div>
                            <span className="text-[10px] text-[#E2622F] font-bold">Cargar</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 3: Para Profesionales & Garantía Oficial */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1715] block mb-2">
                        3. Perfiles y Servicios
                      </span>
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleSegmentoClick("contratista")}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DFD5] transition text-left cursor-pointer"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-[#E2622F]" />
                          <div>
                            <span className="font-bold text-[#2B211C] text-[11px] block">
                              Maestros y Contratistas
                            </span>
                            <span className="text-[10px] text-[#7A6A5D]">15% dto. en compras</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSegmentoClick("empresa")}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DFD5] transition text-left cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#6B7C59]" />
                          <div>
                            <span className="font-bold text-[#2B211C] text-[11px] block">
                              Empresas y Constructoras
                            </span>
                            <span className="text-[10px] text-[#7A6A5D]">Facturación y crédito</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={handleTrackingClick}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DFD5] transition text-left cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#1A1715]" />
                          <div>
                            <span className="font-bold text-[#2B211C] text-[11px] block">
                              Rastreo de Despacho
                            </span>
                            <span className="text-[10px] text-[#7A6A5D]">Monitoreo en vivo</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={handleWarrantyClick}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DFD5] transition text-left cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5 text-[#F2A93C]" />
                          <div>
                            <span className="font-bold text-[#2B211C] text-[11px] block">
                              Póliza Garantía 360
                            </span>
                            <span className="text-[10px] text-[#7A6A5D]">Certificación oficial</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Banner de Contacto Técnico Gratuito en Grafito #1A1715 */}
                    <div className="bg-[#1A1715] text-[#FBF7F0] p-3.5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <PhoneCall className="w-3.5 h-3.5 text-[#F2A93C]" />
                        <span className="font-bold text-[11px]">Línea Técnica Pintuco</span>
                      </div>
                      <p className="text-[10px] text-[#CDBEAF] mb-2.5 leading-relaxed">
                        Atención directa con ingenieros de planta para especificación en obra.
                      </p>
                      <a
                        href="tel:018000111404"
                        onClick={handleHotlineClick}
                        className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg block text-center transition shadow-xs"
                      >
                        01 8000 111 404 (Gratis)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOTÓN ASESORA SOFÍA */}
          <button
            type="button"
            onClick={handleOpenAdvisor}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#E2622F] text-[#FBF7F0] text-xs px-2.5 sm:px-3 py-1.5 rounded-xl transition cursor-pointer group shadow-xs"
            title="Abrir asesora técnica virtual Sofía"
            id="btn-header-advisor"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#E2622F] shrink-0">
              <img
                src={AVATAR_IMG}
                alt="Sofía Asesora"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full border border-[#1A1715]" />
            </div>
            <span className="font-semibold text-[11px] hidden sm:inline">Asesora Sofía</span>
          </button>

          {/* ESTADO DE USUARIO O INICIAR SESIÓN (CTA con GRADIENTE #E2622F -> #F2A93C) */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right leading-tight">
                <span className="text-xs font-bold text-[#FBF7F0]">{user.name}</span>
                <span className="text-[10px] text-[#CDBEAF] capitalize">
                  {user.type === "hogar"
                    ? "Cliente hogar"
                    : user.type === "contratista"
                    ? "Maestro contratista"
                    : "Cliente empresa"} · {user.city.split(" ")[0]}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs border border-white/20 hover:bg-white/10 text-[#CDBEAF] hover:text-[#FBF7F0] px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer"
                id="btn-logout"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => (onOpenLoginModal ? onOpenLoginModal() : onNavigateStep(1))}
              className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white text-xs font-extrabold px-3.5 sm:px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
              id="btn-login-header"
            >
              <User className="w-3.5 h-3.5" />
              <span>Iniciar sesión</span>
            </button>
          )}

          {/* Botón de Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBF7F0] transition cursor-pointer"
            aria-label="Abrir menú móvil"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MENÚ DESPLEGABLE MÓVIL (Grafito #1A1715) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141210] border-t border-white/10 p-4 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-[#F2A93C] text-[11px] uppercase tracking-wider">
              Navegación Rápida
            </span>
            <span className="text-[10px] text-[#CDBEAF]">Pintuco ColorLink</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsExploreOpen(true);
              }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left font-medium flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-[#E2622F]" />
              <span>Ver Catálogo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleColorVisualizerClick();
              }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left font-medium flex items-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 text-[#6B7C59]" />
              <span>Simulador</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleTrackingClick();
              }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left font-medium flex items-center gap-2"
            >
              <Truck className="w-3.5 h-3.5 text-[#F2A93C]" />
              <span>Rastreo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleWarrantyClick();
              }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left font-medium flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5 text-[#E2622F]" />
              <span>Garantía 360</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <a
              href="tel:018000111404"
              className="text-[#F2A93C] hover:underline flex items-center gap-1 font-semibold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Línea Técnica: 018000 111 404</span>
            </a>
          </div>
        </div>
      )}

      {/* 3. BARRA DE PASOS COMPACTA DEL ASISTENTE (Círculo ACTIVO con GRADIENTE #E2622F -> #F2A93C) */}
      <div className="bg-[#12100E] border-t border-white/5 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  type="button"
                  onClick={() => onNavigateStep(step.num)}
                  disabled={!isCompleted && !isActive}
                  className={`flex items-center gap-2 py-1 px-2.5 rounded-lg transition-all text-left shrink-0 ${
                    isActive
                      ? "bg-white/10 text-white font-bold shadow-xs cursor-default border border-white/15"
                      : isCompleted
                      ? "text-[#CDBEAF] hover:text-[#FBF7F0] hover:bg-white/5 cursor-pointer"
                      : "text-stone-500 opacity-60 cursor-not-allowed"
                  }`}
                  title={`Paso ${step.num}: ${step.label}`}
                >
                  {/* Círculo/indicador del paso: ACTIVO con GRADIENTE #E2622F -> #F2A93C */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                      isActive
                        ? "bg-gradient-to-br from-[#E2622F] to-[#F2A93C] text-white shadow-sm ring-2 ring-[#E2622F]/40"
                        : isCompleted
                        ? "bg-[#6B7C59] text-white"
                        : "bg-white/10 text-stone-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] whitespace-nowrap ${
                      isActive ? "text-white font-bold" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div className="hidden sm:block flex-1 min-w-3 max-w-12 h-[2px] rounded-full bg-white/10 shrink-0">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentStep > step.num ? "bg-[#6B7C59] w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
