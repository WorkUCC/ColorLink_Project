import React, { useState, useMemo } from "react";
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
  Info,
  X,
  Images,
} from "lucide-react";
import { ProjectNeedState, SurfaceId, ProblemId, PintucoColor, UserProfile, ProblemOption, SurfaceOption } from "../types";
import {
  SURFACE_OPTIONS,
  PROBLEM_OPTIONS,
  PINTUCO_PALETTES,
  COLOMBIAN_CITIES,
  getProblemsForSurface,
  getCoverageM2PerGallon,
} from "../data/pintucoData";
import { ColorVisualizer } from "./ColorVisualizer";
import { SurfaceGalleryModal } from "./SurfaceGalleryModal";

interface NeedWizardProps {
  initialState: ProjectNeedState;
  user: UserProfile | null;
  onComplete: (data: ProjectNeedState) => void;
  onBackToLogin: () => void;
  initialWizardStep?: number;
  segmentoElegido?: string | null;
  onCambiarSegmento?: () => void;
}

export const NeedWizard: React.FC<NeedWizardProps> = ({
  initialState,
  user,
  onComplete,
  onBackToLogin,
  initialWizardStep = 1,
  segmentoElegido,
  onCambiarSegmento,
}) => {
  const [wizardStep, setWizardStep] = useState<number>(initialWizardStep || 1);
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

  // Sync state when props change
  React.useEffect(() => {
    if (initialState.surface) setSurface(initialState.surface);
    if (initialState.problem) setProblem(initialState.problem);
    if (initialState.areaM2) setAreaM2(initialState.areaM2);
    if (initialState.selectedColor) setSelectedColor(initialState.selectedColor);
  }, [initialState.surface, initialState.problem, initialState.areaM2, initialState.selectedColor]);

  React.useEffect(() => {
    if (initialWizardStep && initialWizardStep >= 1 && initialWizardStep <= 5) {
      setWizardStep(initialWizardStep);
    }
  }, [initialWizardStep]);

  // 1. Obtener problemas técnicos filtrados según la superficie (INTERIOR vs EXTERIOR)
  const problemasFiltrados = useMemo(() => {
    return getProblemsForSurface(surface);
  }, [surface]);

  // Si la superficie cambia y el problema actual no pertenece a las opciones válidas, asignar la primera
  React.useEffect(() => {
    const validos = getProblemsForSurface(surface);
    if (!validos.some((p) => p.id === problem)) {
      setProblem(validos[0]?.id || "humedad_filtraciones");
    }
  }, [surface]);

  // 2. Estado para la ventana emergente de confirmación rápida
  interface ConfirmationData {
    tipo: "superficie" | "problema" | "color";
    titulo: string;
    badge?: string;
    resumen: string;
    icono?: React.ReactNode;
    colorHex?: string;
    onConfirm: () => void;
  }

  const [confirmacion, setConfirmacion] = useState<ConfirmationData | null>(null);
  const [gallerySurface, setGallerySurface] = useState<SurfaceOption | null>(null);

  // Desplaza suavemente hacia el inicio del paso activo del asistente (justo debajo del header fijo)
  const scrollToWizardTop = () => {
    setTimeout(() => {
      const el = document.getElementById("wizard-step-top") || document.getElementById("wizard-container");
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    }, 40);
  };

  const handleSelectSurface = (item: SurfaceOption) => {
    setSurface(item.id);
    const validos = getProblemsForSurface(item.id);
    if (!validos.some((p) => p.id === problem)) {
      setProblem(validos[0]?.id || "humedad_filtraciones");
    }

    const entornoTexto =
      item.environment === "interior"
        ? "Ambiente Interior (Paredes, techos y zonas habitables)"
        : item.environment === "exterior"
        ? "Ambiente Exterior (Intemperie, sol, lluvia y desgaste)"
        : "Ambiente Mixto (Interior o Exterior según aplicación)";

    setConfirmacion({
      tipo: "superficie",
      titulo: item.title,
      badge: item.environment === "interior" ? "Interior" : item.environment === "exterior" ? "Exterior" : "Interior / Exterior",
      resumen: `Clasificación: ${entornoTexto}. El diagnóstico presentará exclusivamente retos técnicos y pinturas compatibles.`,
      icono: getSurfaceIcon(item.id),
      onConfirm: () => {
        setConfirmacion(null);
        setWizardStep(2);
        scrollToWizardTop();
      },
    });
  };

  const handleSelectProblem = (item: ProblemOption) => {
    setProblem(item.id);
    setConfirmacion({
      tipo: "problema",
      titulo: item.title,
      badge: `Severidad ${item.severity}`,
      resumen: `Tratamiento técnico: ${item.tag}. ${item.description}`,
      icono: <AlertCircle className="w-5 h-5 text-amber-500" />,
      onConfirm: () => {
        setConfirmacion(null);
        setWizardStep(3);
        scrollToWizardTop();
      },
    });
  };

  const handleSelectColor = (col: PintucoColor) => {
    setSelectedColor(col);
    setConfirmacion({
      tipo: "color",
      titulo: `${col.name} (${col.code})`,
      badge: col.collection,
      colorHex: col.hex,
      resumen: `${col.description} Tono oficial configurado para simulación arquitectónica y tinturado de fábrica.`,
      onConfirm: () => {
        setConfirmacion(null);
        setWizardStep(5);
        scrollToWizardTop();
      },
    });
  };

  // Advanced wall dimensions calculator toggle
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [wallWidth, setWallWidth] = useState(4);
  const [wallHeight, setWallHeight] = useState(2.6);
  const [wallCount, setWallCount] = useState(4);
  const [doorsWindowsM2, setDoorsWindowsM2] = useState(4);

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
      scrollToWizardTop();
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
      scrollToWizardTop();
    } else {
      onBackToLogin();
    }
  };

  const wizardSubtitles: Record<number, { title: string; desc: string }> = {
    1: {
      title: "¿Qué superficie vas a pintar?",
      desc: "El tipo de material determina la adherencia, sellado y tecnología de resina adecuada.",
    },
    2: {
      title: "¿Qué necesidad o reto técnico presenta el espacio?",
      desc: "Identificamos factores de humedad, intemperie, lavado frecuente o cambio drástico de tono.",
    },
    3: {
      title: "Calcula los metros cuadrados y manos a aplicar",
      desc: "Evita compras de más o de menos. Calculamos la cantidad exacta de galones con estándar Pintuco.",
    },
    4: {
      title: "Visualizador y carta de colores Pintuco",
      desc: "Prueba el tono en vivo con el simulador de arquitectura y selecciona tu color oficial.",
    },
    5: {
      title: "Ubicación del proyecto y tiempos de entrega",
      desc: "Conectamos con la tienda Pintuco y los maestros certificados más cercanos a tu dirección.",
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Segmento Profesional Elegido (Contexto de Sesión) */}
      {segmentoElegido && (
        <div className="mb-6 p-4 rounded-xl bg-[#F5EFE6] border border-[#E2622F]/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E2622F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              PRO
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A1715]">
                Canal profesional activo: <span className="text-[#E2622F] font-extrabold">{segmentoElegido}</span>
              </p>
              <p className="text-[11px] text-stone-600">
                Tarifas preferenciales, cálculo por cuñetes de obra y asignación de cuadrillas certificadas.
              </p>
            </div>
          </div>
          {onCambiarSegmento && (
            <button
              type="button"
              onClick={onCambiarSegmento}
              className="text-xs font-bold text-[#1A1715] hover:text-[#E2622F] underline cursor-pointer"
            >
              Cambiar segmento
            </button>
          )}
        </div>
      )}

      {/* Top Banner */}
      <div id="wizard-step-top" className="mb-6 scroll-mt-24">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#E2622F]">
              Paso {wizardStep} de 5 del diagnóstico
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              {wizardStep === 1
                ? "Superficie"
                : wizardStep === 2
                ? "Condición técnica"
                : wizardStep === 3
                ? "Cálculo de área"
                : wizardStep === 4
                ? "Color en vivo"
                : "Ubicación"}
            </span>
          </div>

          {user && (
            <span className="text-xs text-stone-800 bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#1A1715] px-2.5 py-1 rounded-lg font-medium">
              15% descuento VIP activo
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2B211C]">
          {wizardSubtitles[wizardStep].title}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {wizardSubtitles[wizardStep].desc}
        </p>

        {/* Consejo inteligente en vivo con el avatar de Sofía */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-teal-50/90 via-teal-50/40 to-white border border-[#E8DFD5] flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E2622F] shrink-0">
              <img
                src="/src/assets/images/asesor_avatar_1791011367910.jpg"
                alt="Sofía Asesora Pintuco"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
            </div>
            <div>
              <span className="font-bold text-[#1A1715] block text-[11px]">
                Tip de Sofía (Asesora Técnica Pintuco):
              </span>
              <span className="text-stone-600 block text-[11px] leading-snug">
                {wizardStep === 1 && "Selecciona el material base. Cada superficie requiere resinas de adherencia específica."}
                {wizardStep === 2 && "Identificar el reto técnico nos permite formular el sellador e imprimante necesario."}
                {wizardStep === 3 && "Calculamos los galones considerando 2 manos y un 10% de desperdicio técnico para que no falte pintura."}
                {wizardStep === 4 && "Puedes usar el simulador de arquitectura con recorte de paredes para probar tonos en vivo."}
                {wizardStep === 5 && "Asignamos la sede oficial y el maestro con mejor calificación en tu ciudad."}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const btn = document.getElementById("btn-virtual-advisor");
              if (btn) btn.click();
            }}
            className="text-[10px] font-bold text-[#E2622F] hover:text-[#1A1715] whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-[#E8DFD5] transition cursor-pointer shadow-2xs shrink-0"
          >
            Consultar a Sofía →
          </button>
        </div>
      </div>

      {/* STEP 1: Surface Selection */}
      {wizardStep === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SURFACE_OPTIONS.map((item) => {
            const isSelected = surface === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectSurface(item)}
                className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between group ${
                  isSelected
                    ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F]"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
                id={`surface-${item.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#1A1715] text-white"
                          : "bg-stone-100 text-[#1A1715] group-hover:bg-stone-200"
                      }`}
                    >
                      {getSurfaceIcon(item.id)}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#E2622F]" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#2B211C] mb-1 group-hover:text-[#1A1715]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>Área típica: {item.defaultM2} m²</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGallerySurface(item);
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A1715] hover:text-[#E2622F] hover:bg-[#F5EFE6] px-2 py-1 rounded-md transition-colors border border-stone-200 hover:border-[#E2622F]/40 cursor-pointer"
                    title={`Ver ejemplos reales de ${item.title}`}
                  >
                    <Images className="w-3.5 h-3.5 text-[#E2622F]" />
                    <span>Ver ejemplos</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 2: Problem / Need Selection (FILTRADO CONTEXTUAL POR SUPERFICIE) */}
      {wizardStep === 2 && (
        <div className="space-y-4">
          {/* Barra de contexto de superficie activa */}
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1715]">Superficie:</span>
              <span className="text-[#E2622F] font-bold">
                {SURFACE_OPTIONS.find((s) => s.id === surface)?.title}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500">
                {SURFACE_OPTIONS.find((s) => s.id === surface)?.environment === "interior"
                  ? "Retos para interiores"
                  : SURFACE_OPTIONS.find((s) => s.id === surface)?.environment === "exterior"
                  ? "Retos para exteriores e intemperie"
                  : "Retos para madera y metales"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setWizardStep(1);
                scrollToWizardTop();
              }}
              className="text-[#E2622F] font-semibold hover:underline cursor-pointer"
            >
              Cambiar superficie
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problemasFiltrados.map((item) => {
              const isSelected = problem === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectProblem(item)}
                  className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
                    isSelected
                      ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F]"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                  id={`problem-${item.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-stone-500 font-medium capitalize">
                        Severidad: {item.severity}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#E2622F]" />
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#2B211C] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="bg-stone-50/80 rounded-lg p-2.5 text-xs text-stone-600 border border-stone-100">
                    <span className="font-semibold text-stone-800">Tratamiento técnico:</span>{" "}
                    {item.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Area Calculator */}
      {wizardStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8DFD5] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#2B211C]">
                  Área estimada de la superficie a pintar
                </label>
                <p className="text-xs text-stone-500">
                  Ajusta el control o ingresa los metros cuadrados exactos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={areaM2}
                  onChange={(e) => setAreaM2(Math.max(5, Number(e.target.value) || 5))}
                  className="w-24 text-right text-lg font-bold border border-[#E8DFD5] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                />
                <span className="text-sm font-semibold text-stone-600">m²</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="5"
              max="200"
              step="1"
              value={areaM2}
              onChange={(e) => setAreaM2(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#E2622F] mb-6"
            />

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-600 block">
                O selecciona una medida de referencia habitual:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Habitación pequeña", val: 25 },
                  { label: "Sala / Comedor", val: 45 },
                  { label: "Apartamento mediano", val: 75 },
                  { label: "Fachada casa 2 pisos", val: 120 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setAreaM2(preset.val)}
                    className={`text-xs px-3 py-2 rounded-lg border font-medium transition cursor-pointer text-center ${
                      areaM2 === preset.val
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-white text-stone-700 border-[#E8DFD5] hover:bg-stone-50"
                    }`}
                  >
                    {preset.label} ({preset.val} m²)
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced calculator toggle */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                ¿Prefieres calcular ingresando ancho y alto de cada pared?
              </span>
              <button
                type="button"
                onClick={() => setShowAdvancedCalc(!showAdvancedCalc)}
                className="text-xs font-semibold text-[#E2622F] hover:underline cursor-pointer"
              >
                {showAdvancedCalc ? "Ocultar desglose" : "Desglosar por medidas"}
              </button>
            </div>

            {showAdvancedCalc && (
              <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-[#2B211C] block">
                  Cálculo detallado de paredes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Ancho pared (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wallWidth}
                      onChange={(e) => setWallWidth(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Alto pared (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wallHeight}
                      onChange={(e) => setWallHeight(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Número de paredes</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={wallCount}
                      onChange={(e) => setWallCount(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Ventanas/Puertas (m²)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={doorsWindowsM2}
                      onChange={(e) => setDoorsWindowsM2(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-lg text-sm font-semibold bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleApplyAdvancedCalc}
                    className="bg-[#1A1715] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                  >
                    Aplicar {Math.max(5, Math.round(wallWidth * wallHeight * wallCount - doorsWindowsM2))} m²
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instant Material Yield Preview */}
          {(() => {
            const coverageM2PerGal = getCoverageM2PerGallon(surface, problem);
            const estGallons = (areaM2 / coverageM2PerGal).toFixed(1);
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
                  <span className="text-xs text-stone-500 font-medium block">Galones estimados (2 manos)</span>
                  <span className="text-lg font-bold text-[#2B211C] mt-0.5 block">
                    ~{estGallons} galones
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Rendimiento: {coverageM2PerGal} m²/galón
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
                  <span className="text-xs text-stone-500 font-medium block">Presentación óptima</span>
                  <span className="text-lg font-bold text-[#2B211C] mt-0.5 block">
                    {Number(estGallons) >= 4 ? "Cuñetes de 5 galones" : "Galones individuales"}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {Number(estGallons) >= 4 ? `~${Math.floor(Number(estGallons) / 5)} cuñete(s)` : "Presentación galón"}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
                  <span className="text-xs text-stone-500 font-medium block">Recomendación técnica</span>
                  <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                    2 manos cruzadas
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Espesor de película óptimo
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Standard notice */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Estándar oficial de fábrica:</strong> 2 manos cruzadas garantizan el poder cubriente, sellan la porosidad y activan la póliza de garantía Pintuco de fábrica.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: Color Visualizer (PROMINENT COLORVISUALIZER COMPONENT) */}
      {wizardStep === 4 && (
        <div id="color-visualizer-container" className="space-y-6">
          {/* Prominent ColorVisualizer with live split slider */}
          <ColorVisualizer
            colorHex={selectedColor.hex}
            colorName={selectedColor.name}
            onSelectColor={(col) =>
              setSelectedColor({
                name: col.name,
                hex: col.hex,
                code: selectedColor.code,
                collection: selectedColor.collection,
                description: selectedColor.description,
              })
            }
            mostrarSelectorEscena={true}
          />

          {/* Official Pintuco Swatches Palette */}
          <div className="bg-white rounded-xl border border-[#E8DFD5] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#2B211C]">
                  Carta de colores oficiales Pintuco
                </h3>
                <p className="text-xs text-stone-500">
                  Selecciona cualquier tono para probarlo de inmediato en el simulador superior.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                Tono activo: {selectedColor.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {PINTUCO_PALETTES.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F]"
                        : "border-[#E8DFD5] hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-lg border border-black/10 mb-2 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-xs font-bold text-[#2B211C] truncate">
                        {color.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {color.code} · {color.collection}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Location, Urgency & Project Notes */}
      {wizardStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8DFD5] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-4">
            <h3 className="text-sm font-bold text-[#2B211C]">
              Lugar y plazo del proyecto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ciudad
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-[#E8DFD5] focus:outline-none focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dirección aproximada o barrio
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle 134 # 19-45, Cedritos"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E8DFD5] focus:outline-none focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                ¿Para cuándo necesitas el material o la aplicación?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "urgente_24h", label: "Urgente", desc: "Menos de 24 horas" },
                  { id: "esta_semana", label: "Esta semana", desc: "Entre 2 y 5 días" },
                  { id: "proximo_mes", label: "Planificado", desc: "Próximas semanas" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as any)}
                    className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                      urgency === item.id
                        ? "border-[#E2622F] bg-[#E2622F]/5 text-[#1A1715] font-semibold"
                        : "border-[#E8DFD5] hover:border-stone-300 bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-stone-500 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Notas adicionales para el técnico (opcional)
              </label>
              <textarea
                rows={2}
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Ej: Hay manchas oscuras de humedad en la esquina superior; techo alto de 3 metros..."
                className="w-full p-3 text-xs rounded-lg border border-[#E8DFD5] focus:outline-none focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-6 border-t border-[#E8DFD5] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="border border-stone-300 hover:bg-stone-50 text-[#1A1715] font-medium px-5 py-2.5 rounded-lg transition inline-flex items-center gap-2 cursor-pointer text-sm"
          id="btn-wizard-prev"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{wizardStep === 1 ? "Volver a acceso" : "Anterior"}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition inline-flex items-center gap-2 cursor-pointer text-sm active:scale-[0.98]"
          id="btn-wizard-next"
        >
          <span>{wizardStep === 5 ? "Formular solución técnica" : "Continuar"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Ventana Emergente / Tarjeta de Confirmación Rápida */}
      {confirmacion && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setConfirmacion(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar X */}
            <button
              type="button"
              onClick={() => setConfirmacion(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
              aria-label="Cerrar confirmación"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Encabezado con icono o muestra de color */}
            <div className="flex items-center gap-3.5 mb-3.5">
              {confirmacion.colorHex ? (
                <div
                  className="w-12 h-12 rounded-xl border border-black/15 shadow-sm shrink-0"
                  style={{ backgroundColor: confirmacion.colorHex }}
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-stone-100 text-[#1A1715] flex items-center justify-center shrink-0">
                  {confirmacion.icono || <CheckCircle2 className="w-5 h-5 text-[#E2622F]" />}
                </div>
              )}
              <div className="pr-6">
                {confirmacion.badge && (
                  <span className="text-[11px] font-semibold text-[#E2622F] block mb-0.5 uppercase tracking-wider">
                    {confirmacion.badge}
                  </span>
                )}
                <h3 className="font-bold text-base text-[#2B211C] leading-tight">
                  {confirmacion.titulo}
                </h3>
              </div>
            </div>

            {/* Resumen conciso de 1-2 líneas */}
            <p className="text-xs text-stone-600 leading-relaxed mb-6 bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
              {confirmacion.resumen}
            </p>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmacion(null)}
                className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition cursor-pointer"
              >
                Cambiar opción
              </button>
              <button
                type="button"
                onClick={confirmacion.onConfirm}
                className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <span>Confirmar y continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Galería de Ejemplos Reales con Pexels y Caché */}
      <SurfaceGalleryModal
        surface={gallerySurface}
        isOpen={!!gallerySurface}
        onClose={() => setGallerySurface(null)}
        onSelectSurface={(surf) => {
          setGallerySurface(null);
          handleSelectSurface(surf);
        }}
      />
    </div>
  );
};
