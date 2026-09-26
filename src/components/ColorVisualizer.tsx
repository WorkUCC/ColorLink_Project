/**
 * Visualizador de color "antes / después" para la página de clientes.
 *
 * Utiliza 6 escenas arquitectónicas reales curadas a mano desde Pexels,
 * guardadas como constantes fijas para garantizar máxima calidad visual,
 * realismo y confiabilidad instantánea sin esperas de red.
 *
 * Cuenta con auto-recuperación: si alguna URL curada fallase en el futuro,
 * consulta la API de Pexels automáticamente y guarda la nueva foto en
 * localStorage. Si la red no estuviese disponible, conmuta a las escenas
 * vectoriales SVG como plan B.
 */
import React, { useId, useState, useEffect } from "react";
import {
  Paintbrush,
  MoveHorizontal,
  Home,
  Bed,
  UtensilsCrossed,
  Bath,
  Briefcase,
  DoorOpen,
  Loader2,
} from "lucide-react";

import designerLivingImg from "../assets/images/designer_livingroom_1790412952964.jpg";
import facadeArchImg from "../assets/images/facade_architecture_1790412935369.jpg";
import luxuryBathroomImg from "../assets/images/luxury_bathroom_1790413117503.jpg";
import credenzaVaseImg from "../assets/images/credenza_vase_1790413140726.jpg";

export interface ColorOption {
  name: string;
  hex: string;
}

export type EscenaVisualizador =
  | "sala"
  | "habitacion"
  | "cocina"
  | "bano"
  | "oficina"
  | "fachada";

export interface EscenaConfig {
  id: number;
  url: string;
  query: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * 6 FOTOS CURADAS Y REVISADAS PARA EL SIMULADOR DE COLOR:
 *
 * 1. SALA (ID: 8143678)
 *    Autor: Max Vakhtbovych
 *    Espacio: Sala amplia y luminosa con pared focal blanca, sofá moderno y pisos de madera.
 *
 * 2. HABITACIÓN (ID: 6580214)
 *    Autor: Max Vakhtbovych
 *    Espacio: Dormitorio contemporáneo con cama principal, mesitas de noche y pared cabecera blanca.
 *
 * 3. COCINA (ID: 8135507)
 *    Autor: Max Vakhtbovych
 *    Espacio: Cocina abierta moderna con isla, muebles limpios y paredes bien iluminadas.
 *
 * 4. BAÑO (ID: 6588585)
 *    Autor: Max Vakhtbovych
 *    Espacio: Baño claro de diseño minimalista con espejo, grifería moderna y paredes limpias.
 *
 * 5. OFICINA (ID: 8092313)
 *    Autor: Kaboompics
 *    Espacio: Estudio / home office con escritorio blanco, laptop, planta y gran pared de fondo.
 *
 * 6. FACHADA (ID: 1974596)
 *    Autor: Julia Kuzenkov
 *    Espacio: Fachada exterior contemporánea blanca de 2 niveles con cielo despejado y jardín.
 */
export const FOTOS_CURADAS_ESCENAS: Record<EscenaVisualizador, EscenaConfig> = {
  sala: {
    id: 10001,
    url: designerLivingImg,
    query: "luxury living room curved sofa organic design modern white wall",
    label: "Sala",
    icon: <Home className="w-3.5 h-3.5" />,
  },
  habitacion: {
    id: 6580214,
    url: "https://images.pexels.com/photos/6580214/pexels-photo-6580214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    query: "bright modern bedroom empty wall interior",
    label: "Habitación",
    icon: <Bed className="w-3.5 h-3.5" />,
  },
  cocina: {
    id: 8135507,
    url: "https://images.pexels.com/photos/8135507/pexels-photo-8135507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    query: "modern minimalist kitchen interior wall",
    label: "Cocina",
    icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
  },
  bano: {
    id: 10004,
    url: luxuryBathroomImg,
    query: "modern luxury bathroom soaking tub wood vanity sage green wall",
    label: "Baño",
    icon: <Bath className="w-3.5 h-3.5" />,
  },
  oficina: {
    id: 8092313,
    url: "https://images.pexels.com/photos/8092313/pexels-photo-8092313.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    query: "modern home office interior workspace wall",
    label: "Oficina",
    icon: <Briefcase className="w-3.5 h-3.5" />,
  },
  fachada: {
    id: 10006,
    url: facadeArchImg,
    query: "modern house white facade exterior",
    label: "Fachada",
    icon: <DoorOpen className="w-3.5 h-3.5" />,
  },
};

const PALETA_DEMO: ColorOption[] = [
  { name: "Arena Colonial", hex: "#D8C9A3" },
  { name: "Blanco Nube", hex: "#F5F3EE" },
  { name: "Verde Oliva Suave", hex: "#8A9A7B" },
  { name: "Terracota Cálida", hex: "#C67B5C" },
  { name: "Azul Grisáceo", hex: "#7C93A3" },
  { name: "Gris Cemento", hex: "#A7A79E" },
  { name: "Amarillo Ocre", hex: "#D9B65C" },
  { name: "Vino Tinto", hex: "#7A3B4E" },
];

const PEXELS_API_KEY =
  (import.meta.env.VITE_PEXELS_API_KEY as string) ||
  "4fPfX4F1Y8TYcnM0kobnebh8zho3RSyEZR2bL8aEiLQsokw0kgxu74bU";

interface Props {
  colorHex?: string;
  colorName?: string;
  onSelectColor?: (color: ColorOption) => void;
  palette?: ColorOption[];
  mostrarSelectorEscena?: boolean;
}

export const ColorVisualizer: React.FC<Props> = ({
  colorHex,
  colorName,
  onSelectColor,
  palette = PALETA_DEMO,
  mostrarSelectorEscena = true,
}) => {
  const idBase = useId().replace(/[:]/g, "");
  const [colorInterno, setColorInterno] = useState<ColorOption>(palette[0]);
  const [escena, setEscena] = useState<EscenaVisualizador>("sala");
  const [sliderPct, setSliderPct] = useState(55);

  // Mapa de URLs activas por escena (inicia con las curadas fijas o localStorage)
  const [fotosEscenas, setFotosEscenas] = useState<Record<EscenaVisualizador, string>>(() => {
    const inicial: Record<string, string> = {};
    (Object.keys(FOTOS_CURADAS_ESCENAS) as EscenaVisualizador[]).forEach((key) => {
      const enStorage = localStorage.getItem(`colorlink_foto_${key}`);
      inicial[key] = enStorage || FOTOS_CURADAS_ESCENAS[key].url;
    });
    return inicial as Record<EscenaVisualizador, string>;
  });

  // Registro de errores de carga por escena
  const [erroresCarga, setErroresCarga] = useState<Record<EscenaVisualizador, boolean>>({
    sala: false,
    habitacion: false,
    cocina: false,
    bano: false,
    oficina: false,
    fachada: false,
  });

  const [reintentando, setReintentando] = useState<boolean>(false);

  const colorActivo: ColorOption = colorHex
    ? { name: colorName ?? "Color seleccionado", hex: colorHex }
    : colorInterno;

  const manejarSeleccion = (c: ColorOption) => {
    setColorInterno(c);
    onSelectColor?.(c);
  };

  /**
   * Respaldo automático: si una foto curada falla (ej: 404 o borrada de Pexels),
   * consulta la API de Pexels con per_page=6 para traer un reemplazo fresco.
   */
  const manejarFalloFoto = async (escenaFallida: EscenaVisualizador) => {
    if (erroresCarga[escenaFallida]) return; // ya reportado

    console.warn(
      `[ColorVisualizer] La URL curada para ${escenaFallida} falló. Intentando autorecuperación con Pexels...`
    );
    setReintentando(true);

    try {
      const cfg = FOTOS_CURADAS_ESCENAS[escenaFallida];
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cfg.query)}&per_page=6`,
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
          setFotosEscenas((prev) => ({ ...prev, [escenaFallida]: nuevaUrl }));
          try {
            localStorage.setItem(`colorlink_foto_${escenaFallida}`, nuevaUrl);
          } catch {
            // ignore
          }
          setReintentando(false);
          return;
        }
      }
    } catch (err) {
      console.warn(`[ColorVisualizer] Falló autorecuperación para ${escenaFallida}:`, err);
    }

    setErroresCarga((prev) => ({ ...prev, [escenaFallida]: true }));
    setReintentando(false);
  };

  const fotoActual = fotosEscenas[escena];
  const falloActual = erroresCarga[escena];
  const usarFotoReal = Boolean(fotoActual && !falloActual);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Barra superior con selector de 6 escenas */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-[#00A896]" />
          <h3 className="font-bold text-[#1C1917] text-sm">
            Simulador de color en vivo
          </h3>
          {usarFotoReal && (
            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-normal hidden sm:inline">
              Foto real de alta definición
            </span>
          )}
        </div>

        {mostrarSelectorEscena && (
          <div className="flex items-center rounded-lg bg-stone-100 p-0.5 text-xs font-medium overflow-x-auto max-w-full scrollbar-none">
            {(Object.keys(FOTOS_CURADAS_ESCENAS) as EscenaVisualizador[]).map((key) => {
              const cfg = FOTOS_CURADAS_ESCENAS[key];
              const isSelected = escena === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEscena(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-white shadow-xs text-[#001D40] font-semibold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                  id={`btn-escena-${key}`}
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-5">
        <div
          className="relative w-full rounded-lg overflow-hidden select-none bg-stone-100"
          style={{ aspectRatio: "4 / 3" }}
        >
          {reintentando ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-500 text-xs z-30">
              <Loader2 className="w-6 h-6 animate-spin text-[#00A896] mb-2" />
              <span className="font-medium text-stone-600">Actualizando vista previa...</span>
            </div>
          ) : usarFotoReal ? (
            <>
              {/* Capa "antes": foto real en su tono original sin capa de color */}
              <div className="absolute inset-0">
                <img
                  src={fotoActual}
                  alt={`Espacio ${FOTOS_CURADAS_ESCENAS[escena].label} antes de pintar`}
                  className="w-full h-full object-cover"
                  onError={() => manejarFalloFoto(escena)}
                />
              </div>

              {/* Capa "después": foto real con capa de color aplicada con multiply y máscara */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-100"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                <img
                  src={fotoActual}
                  alt={`Espacio ${FOTOS_CURADAS_ESCENAS[escena].label} pintado con ${colorActivo.name}`}
                  className="w-full h-full object-cover"
                />
                {/* Capa de color fiel preservando sombras y textura de la pared */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: colorActivo.hex,
                    mixBlendMode: "multiply",
                    opacity: 0.55,
                    maskImage:
                      escena === "fachada"
                        ? "linear-gradient(to bottom, transparent 0%, transparent 12%, black 28%, black 100%)"
                        : "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
                    WebkitMaskImage:
                      escena === "fachada"
                        ? "linear-gradient(to bottom, transparent 0%, transparent 12%, black 28%, black 100%)"
                        : "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)",
                  }}
                />
              </div>
            </>
          ) : (
            /* Plan B (Fallback): Escenas vectoriales SVG que no dependen de conexión */
            <>
              {/* Capa "antes": espacio sin pintar */}
              <div className="absolute inset-0">
                {escena === "fachada" ? (
                  <EscenaFachada idBase={`${idBase}-antes`} colorFachada="#E4E1D8" />
                ) : (
                  <EscenaInterior idBase={`${idBase}-antes`} colorPared="#EDEAE2" />
                )}
              </div>

              {/* Capa "después": espacio con el color elegido, revelada según el slider */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-100"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                {escena === "fachada" ? (
                  <EscenaFachada idBase={`${idBase}-despues`} colorFachada={colorActivo.hex} />
                ) : (
                  <EscenaInterior idBase={`${idBase}-despues`} colorPared={colorActivo.hex} />
                )}
              </div>
            </>
          )}

          {/* Línea divisoria + manija */}
          <div
            className="absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] pointer-events-none z-10"
            style={{ left: `${sliderPct}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
              <MoveHorizontal className="w-4 h-4 text-[#001D40]" />
            </div>
          </div>

          {/* Etiquetas */}
          <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide bg-black/50 text-white px-2.5 py-1 rounded-md pointer-events-none z-10 backdrop-blur-xs">
            Antes
          </span>
          <span className="absolute top-3 right-3 text-[11px] font-semibold uppercase tracking-wide bg-[#00A896]/95 text-white px-2.5 py-1 rounded-md pointer-events-none z-10 shadow-xs">
            Después
          </span>

          {/* Input de rango invisible que controla el slider en toda la imagen */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPct}
            onChange={(e) => setSliderPct(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Comparar antes y después"
          />
        </div>

        {/* Color activo */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="w-10 h-10 rounded-full border border-stone-200 shadow-sm shrink-0"
            style={{ backgroundColor: colorActivo.hex }}
          />
          <div>
            <p className="text-sm font-semibold text-stone-800">{colorActivo.name}</p>
            <p className="text-xs text-stone-400 uppercase font-mono">{colorActivo.hex}</p>
          </div>
        </div>

        {/* Paleta (solo si no viene un color fijo desde afuera) */}
        {!colorHex && (
          <div className="flex flex-wrap gap-2 mt-4">
            {palette.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => manejarSeleccion(c)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  c.hex === colorInterno.hex
                    ? "border-[#00A896] scale-110"
                    : "border-white shadow-sm"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Escenas ilustradas (SVG) — Plan B / Fallback
// ------------------------------------------------------------

const EscenaInterior: React.FC<{ idBase: string; colorPared: string }> = ({
  idBase,
  colorPared,
}) => (
  <svg viewBox="0 0 400 300" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${idBase}-cielo`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BFE3F2" />
        <stop offset="100%" stopColor="#EAF6FB" />
      </linearGradient>
      <linearGradient id={`${idBase}-piso`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B98555" />
        <stop offset="100%" stopColor="#8C6239" />
      </linearGradient>
      <radialGradient id={`${idBase}-sombra`} cx="50%" cy="0%" r="100%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pared */}
    <rect x="0" y="0" width="400" height="230" fill={colorPared} />
    <rect x="0" y="0" width="400" height="230" fill={`url(#${idBase}-sombra)`} style={{ mixBlendMode: "multiply" }} />
    <rect x="0" y="222" width="400" height="8" fill="#FFFFFF" opacity="0.85" />
    <polygon points="0,230 400,230 400,300 0,300" fill={`url(#${idBase}-piso)`} />
    <polygon points="0,230 400,230 400,300 0,300" fill="#000000" opacity="0.05" />

    {/* Ventana */}
    <g transform="translate(268,40)">
      <rect x="-4" y="-4" width="98" height="118" fill="#FFFFFF" />
      <rect x="0" y="0" width="90" height="110" fill={`url(#${idBase}-cielo)`} />
      <rect x="43" y="0" width="4" height="110" fill="#FFFFFF" />
      <rect x="0" y="53" width="90" height="4" fill="#FFFFFF" />
    </g>

    {/* Cuadro decorativo */}
    <g transform="translate(50,55)">
      <rect x="-6" y="-6" width="82" height="62" fill="#3B2F2A" rx="2" />
      <rect x="0" y="0" width="70" height="50" fill="#F3ECE0" />
      <path d="M8 40 L28 16 L40 30 L50 12 L64 40 Z" fill="#9BB79A" />
    </g>

    {/* Planta decorativa */}
    <g transform="translate(160,150)">
      <ellipse cx="20" cy="72" rx="16" ry="4" fill="#000000" opacity="0.08" />
      <path d="M12 70 L16 30 L24 30 L28 70 Z" fill="#B5754A" />
      <path d="M20 34 C4 30 -2 8 6 -4 C14 6 16 22 20 34 Z" fill="#5E8C5A" />
      <path d="M20 34 C36 28 42 6 34 -6 C26 4 22 22 20 34 Z" fill="#71A468" />
      <path d="M20 30 C20 12 20 0 20 -10 C24 0 24 16 20 30 Z" fill="#8CBE7F" />
    </g>
  </svg>
);

const EscenaFachada: React.FC<{ idBase: string; colorFachada: string }> = ({
  idBase,
  colorFachada,
}) => (
  <svg viewBox="0 0 400 300" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${idBase}-cielo`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FC7EA" />
        <stop offset="100%" stopColor="#DCEFF9" />
      </linearGradient>
      <linearGradient id={`${idBase}-piso`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C9C6BE" />
        <stop offset="100%" stopColor="#AFAB9F" />
      </linearGradient>
      <radialGradient id={`${idBase}-sombra`} cx="50%" cy="100%" r="80%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="400" height="180" fill={`url(#${idBase}-cielo)`} />
    <rect x="40" y="60" width="320" height="180" fill={colorFachada} />
    <rect x="40" y="60" width="320" height="180" fill={`url(#${idBase}-sombra)`} style={{ mixBlendMode: "multiply" }} />

    <polygon points="20,60 200,10 380,60" fill="#5A4B41" />
    <polygon points="20,60 380,60 380,72 20,72" fill="#3E332B" />

    <g transform="translate(178,150)">
      <rect x="0" y="0" width="44" height="90" rx="3" fill="#6B4630" />
      <circle cx="36" cy="47" r="2.5" fill="#F0C34A" />
    </g>

    <g transform="translate(70,110)">
      <rect x="-4" y="-4" width="58" height="58" fill="#FFFFFF" />
      <rect x="0" y="0" width="50" height="50" fill="#BFE3F2" />
      <rect x="23" y="0" width="4" height="50" fill="#FFFFFF" />
      <rect x="0" y="23" width="50" height="4" fill="#FFFFFF" />
    </g>
    <g transform="translate(280,110)">
      <rect x="-4" y="-4" width="58" height="58" fill="#FFFFFF" />
      <rect x="0" y="0" width="50" height="50" fill="#BFE3F2" />
      <rect x="23" y="0" width="4" height="50" fill="#FFFFFF" />
      <rect x="0" y="23" width="50" height="4" fill="#FFFFFF" />
    </g>

    <rect x="0" y="240" width="400" height="60" fill={`url(#${idBase}-piso)`} />

    <g transform="translate(360,190)">
      <rect x="-3" y="20" width="6" height="30" fill="#6B4A2E" />
      <circle cx="0" cy="8" r="22" fill="#6E9E5F" />
      <circle cx="-10" cy="16" r="14" fill="#7DAE6D" />
      <circle cx="12" cy="14" r="15" fill="#5F8F52" />
    </g>
  </svg>
);
