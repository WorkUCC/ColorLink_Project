import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  Droplets,
  TreePine,
  ShieldAlert,
  Maximize2,
  Umbrella,
  Calculator,
  Palette,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";
import { ProjectNeedState, SurfaceId, ProblemId, PintucoColor, UserProfile } from "../types";
import {
  SURFACE_OPTIONS,
  PROBLEM_OPTIONS,
  PINTUCO_PALETTES,
  COLOMBIAN_CITIES,
} from "../data/pintucoData";

interface NeedWizardProps {
  initialState: ProjectNeedState;
  user: UserProfile | null;
  onComplete: (data: ProjectNeedState) => void;
  onBackToLogin: () => void;
}

export const NeedWizard: React.FC<NeedWizardProps> = ({
  initialState,
  user,
  onComplete,
  onBackToLogin,
}) => {
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [surface, setSurface] = useState<SurfaceId>(initialState.surface || "fachadas_exteriores");
  const [problem, setProblem] = useState<ProblemId>(initialState.problem || "humedad_filtraciones");
  const [areaM2, setAreaM2] = useState<number>(initialState.areaM2 || 45);
  const [selectedColor, setSelectedColor] = useState<PintucoColor>(initialState.selectedColor || PINTUCO_PALETTES[0]);
  const [city, setCity] = useState<string>(initialState.city || user?.city || "Bogotá D.C.");
  const [address, setAddress] = useState<string>(initialState.address || user?.address || "");
  const [urgency, setUrgency] = useState<"urgente_24h" | "esta_semana" | "proximo_mes">(
    initialState.urgency || "esta_semana"
  );
  const [projectNotes, setProjectNotes] = useState<string>(initialState.projectNotes || "");

  // Advanced wall dimensions calculator modal/drawer toggle
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [wallWidth, setWallWidth] = useState(4);
  const [wallHeight, setWallHeight] = useState(2.6);
  const [wallCount, setWallCount] = useState(4);
  const [doorsWindowsM2, setDoorsWindowsM2] = useState(4);

  // Surface icon helper
  const getSurfaceIcon = (id: SurfaceId) => {
    switch (id) {
      case "fachadas_exteriores":
        return <Home className="w-5 h-5" />;
      case "paredes_interiores":
        return <LayoutGrid className="w-5 h-5" />;
      case "banos_cocinas":
        return <Droplets className="w-5 h-5" />;
      case "madera_decks":
        return <TreePine className="w-5 h-5" />;
      case "metales_estructuras":
        return <ShieldAlert className="w-5 h-5" />;
      case "pisos_garajes":
        return <Maximize2 className="w-5 h-5" />;
      case "techos_cubiertas":
        return <Umbrella className="w-5 h-5" />;
    }
  };

  const handleApplyAdvancedCalc = () => {
    const totalWallArea = Math.max(5, Math.round(wallWidth * wallHeight * wallCount - doorsWindowsM2));
    setAreaM2(totalWallArea);
    setShowAdvancedCalc(false);
  };

  const handleNext = () => {
    if (wizardStep < 5) {
      setWizardStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete({
        surface,
        problem,
        areaM2,
        selectedColor,
        city,
        address,
        urgency,
        projectNotes,
      });
    }
  };

  const handlePrev = () => {
    if (wizardStep > 1) {
      setWizardStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onBackToLogin();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Wizard Header with dynamic progress */}
      <div className="mb-8">
        {!user ? (
          <div className="mb-4 bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 sm:p-3.5 flex items-center justify-between text-xs text-slate-800 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span>
                <strong className="text-emerald-900 font-bold">Modo Visitante Libre:</strong> Podrás cotizar, simular color y calcular gratis; el registro solo se pide al agendar tu instalación o despacho oficial.
              </span>
            </div>
            <span className="hidden sm:inline-block bg-white text-emerald-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
              Sin registro previo
            </span>
          </div>
        ) : (
          <div className="mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>
                <strong className="text-emerald-900 font-bold">Cliente {user.name}:</strong> 15% Descuento Especial Activo • Opciones técnicas personalizadas para {user.city}.
              </span>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Beneficios VIP
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#00A896]">
              Paso {wizardStep} de 5 • Asistente de Necesidad
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              {wizardStep === 1 && "¿Qué superficie o espacio vas a intervenir?"}
              {wizardStep === 2 && "¿Cuál es el estado actual o problema a resolver?"}
              {wizardStep === 3 && "¿Cuántos metros cuadrados (m²) calculas pintar?"}
              {wizardStep === 4 && "Elige y previsualiza el color en tu espacio"}
              {wizardStep === 5 && "¿Dónde está ubicado tu proyecto y qué tan urgente es?"}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-[#002D62] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-[#00A896]" /> ColorLink AI Asistente
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#002D62] to-[#00A896] h-full rounded-full transition-all duration-300"
            style={{ width: `${(wizardStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main step container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 min-h-[420px]">
        {/* STEP 1: Superficie */}
        {wizardStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Selecciona el tipo de superficie. Cada una requiere una tecnología de pintura diferente (antihongos, lavabilidad, hidrorepelencia o anticorrosivo).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {SURFACE_OPTIONS.map((item) => {
                const isSelected = surface === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSurface(item.id);
                      if (areaM2 === 45 || areaM2 === 50 || areaM2 === 35) {
                        setAreaM2(item.defaultM2);
                      }
                    }}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col justify-between group overflow-hidden ${
                      isSelected
                        ? "border-[#002D62] bg-blue-50/50 shadow-md ring-2 ring-[#002D62]/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                    id={`surface-opt-${item.id}`}
                  >
                    {/* Small image preview banner */}
                    <div className="h-24 w-full rounded-lg overflow-hidden mb-3 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white flex items-center gap-1.5 text-xs font-semibold">
                        {getSurfaceIcon(item.id)}
                        <span>{item.title.split(" ")[0]}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#002D62] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Problema o necesidad técnica */}
        {wizardStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Identificar el problema actual permite a la formulación Pintuco seleccionar el sellador, imprimante o aditivo adecuado para que la pintura no se caiga ni se manche.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {PROBLEM_OPTIONS.map((item) => {
                const isSelected = problem === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setProblem(item.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#002D62] bg-blue-50/50 shadow-md ring-2 ring-[#002D62]/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                    id={`problem-opt-${item.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.tag}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#002D62] shrink-0" />
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Nivel de intervención técnica:</span>
                      <span
                        className={`font-semibold capitalize ${
                          item.severity === "alta"
                            ? "text-amber-700"
                            : item.severity === "media"
                            ? "text-blue-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Calculadora de Pintura y Metros Cuadrados */}
        {wizardStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Calculator className="w-5 h-5 text-[#002D62] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#002D62]">
                  Calculadora de Rendimiento Integrada (Inspirada en Comex & PPG)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Calculamos automáticamente los galones y cuñetes requeridos a 2 manos con el factor de absorción de la superficie elegida.
                </p>
              </div>
            </div>

            {/* Direct Area Slider */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Área total a cubrir
                  </label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[#002D62]">{areaM2}</span>
                    <span className="text-lg font-bold text-slate-500">m² (metros cuadrados)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedCalc(!showAdvancedCalc)}
                  className="text-xs text-[#00A896] hover:text-[#008f80] font-bold flex items-center gap-1 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  {showAdvancedCalc ? "Ocultar calculador por paredes" : "Calcular por alto x ancho"}
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="5"
                max="250"
                step="1"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002D62]"
                id="slider-area-m2"
              />

              {/* Quick Area Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-slate-500 self-center mr-1">Sugerencias rápidas:</span>
                {[
                  { label: "Habitación (20 m²)", val: 20 },
                  { label: "Sala-Comedor (40 m²)", val: 40 },
                  { label: "Fachada mediana (60 m²)", val: 60 },
                  { label: "Casa completa (120 m²)", val: 120 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setAreaM2(preset.val)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                      areaM2 === preset.val
                        ? "bg-[#002D62] text-white border-[#002D62]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced wall dimensions calculator accordion */}
            {showAdvancedCalc && (
              <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Desglose de Medidas de Paredes
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ancho pared (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wallWidth}
                      onChange={(e) => setWallWidth(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Alto pared (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wallHeight}
                      onChange={(e) => setWallHeight(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nº de Paredes</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={wallCount}
                      onChange={(e) => setWallCount(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Puertas/Ventanas (m²)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={doorsWindowsM2}
                      onChange={(e) => setDoorsWindowsM2(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleApplyAdvancedCalc}
                    className="bg-[#002D62] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#003882]"
                  >
                    Calcular y Aplicar ({Math.max(5, Math.round(wallWidth * wallHeight * wallCount - doorsWindowsM2))} m²)
                  </button>
                </div>
              </div>
            )}

            {/* Instant Paint Yield Estimate preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Galones estimados (2 manos)</span>
                <span className="text-lg font-bold text-slate-900">
                  ~{(areaM2 / 22).toFixed(1)} Galones
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Formato más eficiente</span>
                <span className="text-lg font-bold text-slate-900">
                  {areaM2 >= 80 ? "Cuñetes de 5 Galones" : "Galones Individuales"}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Manos recomendadas</span>
                <span className="text-lg font-bold text-emerald-700">
                  2 Manos Cruzadas
                </span>
              </div>
            </div>

            {/* Visual Guide: 1 Mano vs 2 Manos */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>¿Por qué recomendamos 2 manos en el 90% de los proyectos?</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-slate-900 block mb-0.5">1 Mano (Solo Retoque):</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Aplica únicamente si vas a repintar con el <strong>mismo tono exacto</strong> sobre una base limpia y en perfecto estado.
                  </p>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-300 ring-1 ring-amber-400/30">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#002D62] block">2 Manos (Estándar Pintuco):</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Garantía 100%</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Sella la porosidad, evita sombras o vetas, garantiza la viveza del color y activa la póliza de respaldo de fábrica.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Disclaimer Notice */}
            <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Nota técnica:</strong> Este cálculo es una estimación técnica y puede variar según la rugosidad, porosidad, absorción y el estado real de la superficie a pintar.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Visualizador de Color en Tiempo Real (Inspirado en Sherwin-Williams & Comex) */}
        {wizardStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">
                  Explora la carta de colores oficial Pintuco y visualiza cómo luce el tono aplicado sobre la arquitectura de tu espacio.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#002D62] bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                <Palette className="w-3.5 h-3.5 text-[#00A896]" /> ColorSnap Simulator
              </div>
            </div>

            {/* Interactive Room / Facade Visualizer Canvas Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Virtual Space Preview */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-300 relative">
                {/* SVG architectural room mockup that gets dynamic fill color */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800 flex items-center justify-center">
                  <svg
                    viewBox="0 0 800 600"
                    className="w-full h-full object-cover transition-all duration-500"
                  >
                    {/* Background sky/horizon for facades or ceiling */}
                    <rect width="800" height="600" fill="#E2E8F0" />

                    {/* Floor / Ground */}
                    <polygon points="0,480 800,480 800,600 0,600" fill="#CBD5E1" />
                    <line x1="0" y1="480" x2="800" y2="480" stroke="#94A3B8" strokeWidth="2" />

                    {/* Baseboard / Rodapié */}
                    <polygon points="0,465 800,465 800,480 0,480" fill="#475569" />

                    {/* Dynamic Tinted Main Wall */}
                    <polygon
                      points="80,80 720,80 720,465 80,465"
                      fill={selectedColor.hex}
                      className="transition-colors duration-500"
                    />

                    {/* Ambient light gradient simulation */}
                    <rect
                      x="80"
                      y="80"
                      width="640"
                      height="385"
                      fill="url(#wallGradient)"
                      opacity="0.25"
                    />

                    {/* Architectural window frame */}
                    <rect x="140" y="140" width="160" height="200" rx="4" fill="#F8FAFC" stroke="#334155" strokeWidth="6" />
                    <line x1="220" y1="140" x2="220" y2="340" stroke="#334155" strokeWidth="4" />
                    <line x1="140" y1="240" x2="300" y2="240" stroke="#334155" strokeWidth="4" />
                    {/* Window view (garden sunlight) */}
                    <rect x="146" y="146" width="70" height="90" fill="#93C5FD" opacity="0.6" />
                    <rect x="224" y="146" width="70" height="90" fill="#93C5FD" opacity="0.6" />
                    <rect x="146" y="244" width="70" height="90" fill="#86EFAC" opacity="0.4" />
                    <rect x="224" y="244" width="70" height="90" fill="#86EFAC" opacity="0.4" />

                    {/* Decorative artwork/plant or sofa silhouette */}
                    <rect x="480" y="160" width="180" height="120" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
                    <rect x="495" y="175" width="150" height="90" fill="#002D62" />
                    <circle cx="570" cy="220" r="25" fill="#00A896" />

                    {/* Modern sofa */}
                    <path
                      d="M 380,360 L 680,360 Q 690,360 690,370 L 690,460 L 370,460 L 370,370 Q 370,360 380,360 Z"
                      fill="#1E293B"
                    />
                    <rect x="400" y="380" width="120" height="60" rx="4" fill="#334155" />
                    <rect x="540" y="380" width="120" height="60" rx="4" fill="#334155" />
                    {/* Decorative cushion in contrasting Pintuco tone */}
                    <polygon points="420,375 460,375 455,410 415,410" fill="#00A896" />

                    <defs>
                      <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Overlaid color badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-white/50 flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {selectedColor.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Código: {selectedColor.code} • Tinturado de Fábrica
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Swatch Selector Palette */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Catálogo de Tendencias Pintuco
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {PINTUCO_PALETTES.map((color) => {
                    const isSelected = selectedColor.code === color.code;
                    return (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "border-[#002D62] bg-blue-50 ring-2 ring-[#002D62]/20 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        id={`color-swatch-${color.code}`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg shadow-sm border border-black/10 relative"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CheckCircle2
                                className={`w-4 h-4 ${
                                  color.hex === "#F8F9FA" || color.hex === "#F1EBE1" || color.hex === "#E7D8C5"
                                    ? "text-slate-900"
                                    : "text-white"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 text-center leading-tight line-clamp-1">
                          {color.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{color.code}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                  <span>
                    <strong>{selectedColor.name}:</strong> {selectedColor.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Ubicación y Urgencia del Proyecto */}
        {wizardStep === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
              Con tu ubicación conectamos el inventario en tiempo real de la tienda o bodega Pintuco más cercana para asegurar despacho express o retiro inmediato.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ciudad Principal
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white font-medium"
                    id="select-city"
                  >
                    {COLOMBIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dirección o Barrio (Opcional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Carrera 7 # 116-50 o sector general"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white"
                  id="input-address"
                />
              </div>
            </div>

            {/* Urgency selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                ¿Qué tan pronto necesitas el material o la aplicación?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "urgente_24h" as const,
                    title: "Urgente (24 a 48 horas)",
                    desc: "Despacho prioritario y pintor disponible hoy o mañana.",
                    badge: "Express",
                  },
                  {
                    id: "esta_semana" as const,
                    title: "Esta misma semana",
                    desc: "Tiempo ideal para coordinar preparación y tinturado.",
                    badge: "Recomendado",
                  },
                  {
                    id: "proximo_mes" as const,
                    title: "Planificado (15 - 30 días)",
                    desc: "Cotización formal y reserva de cupo con aplicador.",
                    badge: "Reserva",
                  },
                ].map((item) => {
                  const isSelected = urgency === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setUrgency(item.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#002D62] bg-blue-50/60 shadow-sm ring-2 ring-[#002D62]/10"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                      }`}
                      id={`urgency-opt-${item.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#002D62]">
                            {item.badge}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#002D62]" />}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detalles adicionales del proyecto (opcional)
              </label>
              <textarea
                rows={2}
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Ej: La pared tiene una fisura pequeña cerca al techo, queremos que quede lisa..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
          id="btn-wizard-prev"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{wizardStep === 1 ? (user ? "Volver a Perfil" : "Acceso Clientes (Opcional)") : "Anterior"}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002D62] hover:bg-[#003882] text-white font-bold text-sm shadow-md transition-all group cursor-pointer"
          id="btn-wizard-next"
        >
          <span>
            {wizardStep === 5 ? "Generar Solución Técnica con IA" : "Siguiente Paso"}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
