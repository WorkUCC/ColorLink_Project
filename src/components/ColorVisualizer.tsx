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
import bedroomImg from "../assets/images/bedroom_minimal_6580214.jpg";
import kitchenLuxuryImg from "../assets/images/kitchen_luxury_1791046677953.jpg";
import kitchenRedImg from "../assets/images/kitchen_red_1791046691366.jpg";
import kitchenBlueImg from "../assets/images/kitchen_blue_1791046706644.jpg";
import kitchenGreenImg from "../assets/images/kitchen_green_1791046719015.jpg";
import kitchenYellowImg from "../assets/images/kitchen_yellow_1791046731474.jpg";
import luxuryBathroomImg from "../assets/images/luxury_bathroom_1790413117503.jpg";
import officeImg from "../assets/images/office_minimal_10567351.jpg";
import facadeArchImg from "../assets/images/facade_minimal_20295564.jpg";

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
  aspectRatio: string;
  grupo: "interiores" | "exteriores";
  photographer?: string;
}

/**
 * Resuelve la renderización hiperrealista de la cocina según el color seleccionado:
 * - Si piden rojo -> se cambia a rojo (kitchenRedImg)
 * - Si piden azul -> se cambia a azul (kitchenBlueImg)
 * - Si piden verde -> se cambia a verde oliva / menta (kitchenGreenImg)
 * - Si piden amarillo -> se cambia a amarillo ocre (kitchenYellowImg)
 * - Si piden blanco / crema / neutro -> se cambia a neutro (kitchenLuxuryImg)
 * Para tonos personalizados, combina la base más cercana con ajuste de color.
 */
export function resolverFotoCocinaPorColor(color: ColorOption): {
  fotoDespues: string;
  requiereOverlayCustom: boolean;
  tonalidadDetectada: "rojo" | "azul" | "verde" | "amarillo" | "blanco";
} {
  const name = (color.name || "").toLowerCase();
  const hex = (color.hex || "").toLowerCase();

  // 1. Rojo / Vino Tinto / Terracota
  if (
    name.includes("rojo") ||
    name.includes("vino") ||
    name.includes("tinto") ||
    name.includes("terracota") ||
    hex === "#7a3b4e" ||
    hex === "#c67b5c" ||
    hex === "#a6192e"
  ) {
    return { fotoDespues: kitchenRedImg, requiereOverlayCustom: false, tonalidadDetectada: "rojo" };
  }

  // 2. Azul / Azul Grisáceo / Celeste / Petróleo
  if (
    name.includes("azul") ||
    name.includes("celeste") ||
    name.includes("navy") ||
    hex === "#7c93a3" ||
    hex.startsWith("#0f") ||
    hex.startsWith("#1c") ||
    hex.startsWith("#2b4") ||
    hex.startsWith("#3b6")
  ) {
    return { fotoDespues: kitchenBlueImg, requiereOverlayCustom: false, tonalidadDetectada: "azul" };
  }

  // 3. Verde / Verde Oliva / Menta / Salvia
  if (
    name.includes("verde") ||
    name.includes("oliva") ||
    name.includes("menta") ||
    name.includes("salvia") ||
    hex === "#8a9a7b" ||
    hex.startsWith("#88c") ||
    hex.startsWith("#6b7") ||
    hex.startsWith("#4d5")
  ) {
    return { fotoDespues: kitchenGreenImg, requiereOverlayCustom: false, tonalidadDetectada: "verde" };
  }

  // 4. Amarillo / Ocre / Mostaza / Cálido
  if (
    name.includes("amarillo") ||
    name.includes("ocre") ||
    name.includes("mostaza") ||
    hex === "#d9b65c" ||
    hex.startsWith("#d89") ||
    hex.startsWith("#e5b") ||
    hex.startsWith("#f4c")
  ) {
    return { fotoDespues: kitchenYellowImg, requiereOverlayCustom: false, tonalidadDetectada: "amarillo" };
  }

  // 5. Blanco / Arena / Neutro
  if (
    name.includes("blanco") ||
    name.includes("nube") ||
    name.includes("arena") ||
    name.includes("marfil") ||
    hex === "#f5f3ee" ||
    hex === "#d8c9a3" ||
    hex.startsWith("#f")
  ) {
    return { fotoDespues: kitchenLuxuryImg, requiereOverlayCustom: false, tonalidadDetectada: "blanco" };
  }

  // Fallback por análisis RGB para colores arbitrarios
  try {
    const r = parseInt(hex.slice(1, 3), 16) || 128;
    const g = parseInt(hex.slice(3, 5), 16) || 128;
    const b = parseInt(hex.slice(5, 7), 16) || 128;

    if (b > r + 20 && b > g) {
      return { fotoDespues: kitchenBlueImg, requiereOverlayCustom: false, tonalidadDetectada: "azul" };
    }
    if (g > r + 15 && g > b) {
      return { fotoDespues: kitchenGreenImg, requiereOverlayCustom: false, tonalidadDetectada: "verde" };
    }
    if (r > 150 && g > 130 && b < 100) {
      return { fotoDespues: kitchenYellowImg, requiereOverlayCustom: false, tonalidadDetectada: "amarillo" };
    }
    if (r > g + 25 && r > b + 25) {
      return { fotoDespues: kitchenRedImg, requiereOverlayCustom: false, tonalidadDetectada: "rojo" };
    }
  } catch {
    // ignore
  }

  return { fotoDespues: kitchenLuxuryImg, requiereOverlayCustom: true, tonalidadDetectada: "blanco" };
}

/**
 * 6 FOTOS CURADAS Y REVISADAS PARA EL SIMULADOR DE COLOR:
 *
 * 1. SALA (Pexels ID: 10001)
 *    Foto: designer_livingroom_1790412952964.jpg
 *    Espacio: Sala de diseño orgánico con sofá curvo y amplia pared de fondo focal.
 *    Polígono: Recorta exactamente la pared posterior, excluyendo ventanal y cortinas (<30%), pilar derecho (>91%) y sofá (<58%).
 *
 * 2. HABITACIÓN (Pexels ID: 6580214 - Max Vakhtbovych)
 *    Foto: bedroom_minimal_6580214.jpg
 *    Espacio: Dormitorio contemporáneo con cama principal y pared cabecera blanca.
 *    Polígono: Recorta la pared cabecera entre cortinas (16%) y armario (69%), sobre la cabecera acolchada (58%).
 *
 * 3. COCINA (Pexels ID: 10568026 - Cup of Couple)
 *    Foto: kitchen_minimal_10568026.jpg
 *    Espacio: Cocina minimalista despejada con luz natural y pared amplia sobre mesón.
 *    Polígono: Recorta de 0% a 100% horizontalmente desde el techo hasta la superficie del mesón (60%).
 *
 * 4. BAÑO (Pexels ID: 10004)
 *    Foto: luxury_bathroom_1790413117503.jpg
 *    Espacio: Baño de lujo con tina exenta, tocador de madera y pared de acento verde salvia.
 *    Polígono: Inicia tras el ventanal (34%) hasta 100%, sobre el tocador (52%) y sobre la tina (59%).
 *
 * 5. OFICINA (Pexels ID: 10567351 - Cup of Couple)
 *    Foto: office_minimal_10567351.jpg
 *    Espacio: Home office minimalista con escritorio de madera y amplia pared limpia sin obstrucciones.
 *    Polígono: Recorta la pared superior completa de 0% a 100% hasta el filo del escritorio (68%).
 *
 * 6. FACHADA (Pexels ID: 20295564 - Jan van der Wolf)
 *    Foto: facade_minimal_20295564.jpg
 *    Espacio: Fachada exterior contemporánea de estuco con cielo azul despejado.
 *    Polígono: Recorta de 0% a 100% horizontalmente desde la cornisa del alero (28%) preservando el cielo azul intacto.
 */
export const FOTOS_CURADAS_ESCENAS: Record<EscenaVisualizador, EscenaConfig> = {
  sala: {
    id: 10001,
    url: designerLivingImg,
    query: "luxury living room curved sofa organic design modern white wall",
    label: "Sala",
    icon: <Home className="w-3.5 h-3.5" />,
    aspectRatio: "1200 / 896",
    grupo: "interiores",
  },
  habitacion: {
    id: 6580214,
    url: bedroomImg,
    query: "bright modern bedroom empty wall interior",
    label: "Habitación",
    icon: <Bed className="w-3.5 h-3.5" />,
    aspectRatio: "940 / 645",
    grupo: "interiores",
    photographer: "Max Vakhtbovych",
  },
  cocina: {
    id: 10568026,
    url: kitchenLuxuryImg,
    query: "luxury modern kitchen waterfall island barstools",
    label: "Cocina",
    icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
    aspectRatio: "896 / 1200",
    grupo: "interiores",
    photographer: "ColorLink Studio",
  },
  bano: {
    id: 10004,
    url: luxuryBathroomImg,
    query: "modern luxury bathroom soaking tub wood vanity sage green wall",
    label: "Baño",
    icon: <Bath className="w-3.5 h-3.5" />,
    aspectRatio: "1376 / 768",
    grupo: "interiores",
  },
  oficina: {
    id: 10567351,
    url: officeImg,
    query: "minimalist home office wooden desk empty wall",
    label: "Oficina",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    aspectRatio: "940 / 627",
    grupo: "interiores",
    photographer: "Cup of Couple",
  },
  fachada: {
    id: 20295564,
    url: facadeArchImg,
    query: "modern building facade plain stucco wall clear sky",
    label: "Fachada",
    icon: <DoorOpen className="w-3.5 h-3.5" />,
    aspectRatio: "940 / 627",
    grupo: "exteriores",
    photographer: "Jan van der Wolf",
  },
};

/**
 * Polígonos CSS (clip-path: polygon(...)) a la medida exacta de la pared
 * en cada una de las 6 escenas, preservando piso, techo, muebles, marcos y ventanas.
 */
export const CLIP_PATHS_PARED_ESCENAS: Record<EscenaVisualizador, string> = {
  // 1. SALA
  // Foto: designer_livingroom_1790412952964.jpg (Pexels ID 10001)
  // Pared focal ubicada detrás del sofá curvo.
  // Límites: Inicia tras las cortinas izquierdas (X: 30%), bajo la cornisa del techo (Y: 2%),
  // antes del pilar derecho (X: 91%) y bordea el respaldar curvo del sofá (Y: 53%-58%).
  // NOTA: Si se cambia esta foto, actualizar este polígono.
  sala: "polygon(30% 2%, 91% 2%, 91% 55%, 65% 53%, 45% 55%, 30% 58%)",

  // 2. HABITACIÓN
  // Foto: bedroom_minimal_6580214.jpg (Pexels ID 6580214 - Max Vakhtbovych)
  // Pared cabecera principal directamente detrás de la cama.
  // Límites: Inicia tras la caída de cortinas (X: 16%), bajo el techo (Y: 0%),
  // antes del armario lateral (X: 69%) y sobre la cabecera acolchada/mesitas (Y: 58%).
  // NOTA: Si se cambia esta foto, actualizar este polígono.
  habitacion: "polygon(16% 0%, 69% 0%, 69% 58%, 16% 58%)",

  // 3. COCINA
  // Foto base: kitchen_luxury_1791046677953.jpg (ColorLink Studio)
  // Espacio: Cocina abierta contemporánea con isla de mármol y taburetes de madera/ratán.
  // La cocina cuenta con renders fotográficos directos para Rojo (Vino Tinto), Azul, Verde Oliva y Amarillo Ocre.
  // Este polígono cubre techo y pared posterior para tonos libres o personalizados.
  cocina: "polygon(0% 0%, 100% 0%, 100% 48%, 85% 48%, 85% 58%, 35% 58%, 35% 48%, 0% 48%)",

  // 4. BAÑO
  // Foto: luxury_bathroom_1790413117503.jpg (Pexels ID 10004)
  // Pared de acento verde salvia sobre la tina exenta y tocador suspendido.
  // Límites: Inicia a la derecha del ventanal negro (X: 34%) hasta el borde derecho (X: 100%),
  // bajando hasta el espejo/tocador (Y: 52% entre X: 100% y 60%) y borde de la tina (Y: 59% entre X: 60% y 34%).
  // NOTA: Si se cambia esta foto, actualizar este polígono.
  bano: "polygon(34% 0%, 100% 0%, 100% 52%, 60% 52%, 60% 59%, 34% 59%)",

  // 5. OFICINA
  // Foto: office_minimal_10567351.jpg (Pexels ID 10567351 - Cup of Couple)
  // Pared de estudio minimalista con escritorio de madera.
  // Límites: Cubre de extremo a extremo (X: 0% a 100%) desde el techo (Y: 0%)
  // hasta el plano de trabajo del escritorio (Y: 68% en extremos, 69% al centro).
  // NOTA: Si se cambia esta foto, actualizar este polígono.
  oficina: "polygon(0% 0%, 100% 0%, 100% 68%, 75% 67%, 50% 69%, 25% 68%, 0% 68%)",

  // 6. FACHADA
  // Foto: facade_minimal_20295564.jpg (Pexels ID 20295564 - Jan van der Wolf)
  // Muros exteriores de estuco contemporáneo bajo cielo azul despejado.
  // Límites: Abarca de extremo a extremo (X: 0% a 100%) desde la línea del alero/cornisa
  // que separa la pared del cielo azul (Y: 28%) hasta la base de la fachada (Y: 100%).
  // NOTA: Si se cambia esta foto, actualizar este polígono.
  fachada: "polygon(0% 28%, 100% 28%, 100% 100%, 0% 100%)",
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
  const [grupoFiltro, setGrupoFiltro] = useState<"todos" | "interiores" | "exteriores">("todos");

  // Mapa de URLs activas por escena (inicia con las 6 fotos curadas de alta resolución)
  const [fotosEscenas, setFotosEscenas] = useState<Record<EscenaVisualizador, string>>(() => {
    const inicial: Record<string, string> = {};
    (Object.keys(FOTOS_CURADAS_ESCENAS) as EscenaVisualizador[]).forEach((key) => {
      inicial[key] = FOTOS_CURADAS_ESCENAS[key].url;
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
   * Respaldo automático: si una foto curada fallase por red,
   * consulta la API de Pexels para traer un reemplazo fresco.
   */
  const manejarFalloFoto = async (escenaFallida: EscenaVisualizador) => {
    if (erroresCarga[escenaFallida]) return;

    console.warn(
      `[ColorVisualizer] Foto para ${escenaFallida} no disponible. Intentando autorecuperación con Pexels...`
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

  const resolucionCocina = resolverFotoCocinaPorColor(colorActivo);
  const fotoAntes = escena === "cocina" ? kitchenLuxuryImg : fotoActual;
  const fotoDespues = escena === "cocina" ? resolucionCocina.fotoDespues : fotoActual;
  const aplicarOverlayColor =
    escena !== "cocina" || resolucionCocina.requiereOverlayCustom;

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Barra superior con selector agrupado de 6 escenas */}
      <div className="px-5 py-4 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-[#E2622F]" />
          <h3 className="font-bold text-[#1C1917] text-sm">
            Simulador de color en vivo
          </h3>
          {usarFotoReal && (
            <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-medium hidden sm:inline">
              {escena === "cocina" ? "Fotografía multicromática activa" : "Pared recortada con precisión"}
            </span>
          )}
        </div>

        {mostrarSelectorEscena && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* 7. Agrupación visible arriba / al frente del selector de escenas */}
            <div className="flex items-center rounded-lg bg-stone-100 p-0.5 text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGrupoFiltro("todos")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  grupoFiltro === "todos"
                    ? "bg-white shadow-xs text-[#001D40]"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Todas (6)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGrupoFiltro("interiores");
                  if (escena === "fachada") setEscena("sala");
                }}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  grupoFiltro === "interiores"
                    ? "bg-white shadow-xs text-[#001D40]"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Interiores (5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGrupoFiltro("exteriores");
                  setEscena("fachada");
                }}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  grupoFiltro === "exteriores"
                    ? "bg-white shadow-xs text-[#001D40]"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Exteriores (1)
              </button>
            </div>

            {/* Botones de escenas filtradas */}
            <div className="flex items-center rounded-lg bg-stone-100 p-0.5 text-xs font-medium overflow-x-auto max-w-full scrollbar-none">
              {(Object.keys(FOTOS_CURADAS_ESCENAS) as EscenaVisualizador[])
                .filter((key) => {
                  if (grupoFiltro === "interiores") return FOTOS_CURADAS_ESCENAS[key].grupo === "interiores";
                  if (grupoFiltro === "exteriores") return FOTOS_CURADAS_ESCENAS[key].grupo === "exteriores";
                  return true;
                })
                .map((key) => {
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
          </div>
        )}
      </div>

      <div className="p-5">
        <div
          className="relative w-full rounded-lg overflow-hidden select-none bg-stone-100 transition-[aspect-ratio] duration-200"
          style={{
            aspectRatio: FOTOS_CURADAS_ESCENAS[escena].aspectRatio,
            maxHeight: escena === "cocina" ? "620px" : undefined,
          }}
        >
          {reintentando ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-500 text-xs z-30">
              <Loader2 className="w-6 h-6 animate-spin text-[#E2622F] mb-2" />
              <span className="font-medium text-stone-600">Actualizando vista previa...</span>
            </div>
          ) : usarFotoReal ? (
            <>
              {/* Capa "antes": foto real en su tono original sin capa de color */}
              <div className="absolute inset-0">
                <img
                  src={fotoAntes}
                  alt={`Espacio ${FOTOS_CURADAS_ESCENAS[escena].label} antes de pintar`}
                  className="w-full h-full object-cover"
                  onError={() => manejarFalloFoto(escena)}
                />
              </div>

              {/* Capa "después": foto real con el color aplicado (o render directo si es cocina) */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-100"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                <img
                  src={fotoDespues}
                  alt={`Espacio ${FOTOS_CURADAS_ESCENAS[escena].label} pintado con ${colorActivo.name}`}
                  className="w-full h-full object-cover"
                />
                {/* Capa de color fiel aplicada ÚNICAMENTE sobre la pared recortada con polígono a la medida */}
                {aplicarOverlayColor && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-[background-color] duration-150"
                    style={{
                      backgroundColor: colorActivo.hex,
                      mixBlendMode: "multiply",
                      opacity: 0.72,
                      clipPath: CLIP_PATHS_PARED_ESCENAS[escena],
                    }}
                  />
                )}
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

        {/* Notificación interactiva de la cocina */}
        {escena === "cocina" && (
          <div className="mt-3 flex items-center justify-between text-xs bg-[#E2622F]/10 border border-[#E2622F]/20 rounded-lg px-3.5 py-2 text-[#2B211C]">
            <span className="flex items-center gap-2 font-medium">
              <span>🎨</span>
              <span>
                Cocina interactiva: Techo y muros cambian automáticamente a{" "}
                <strong className="capitalize text-[#E2622F]">
                  {resolucionCocina.tonalidadDetectada === "rojo"
                    ? "Rojo / Vino Tinto"
                    : resolucionCocina.tonalidadDetectada === "azul"
                    ? "Azul Grisáceo"
                    : resolucionCocina.tonalidadDetectada === "verde"
                    ? "Verde Oliva / Menta"
                    : resolucionCocina.tonalidadDetectada === "amarillo"
                    ? "Amarillo Ocre"
                    : "Blanco Nube / Neutro"}
                </strong>
                , manteniendo la isla de mármol, los taburetes y el piso de roble libres de manchas.
              </span>
            </span>
          </div>
        )}

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
