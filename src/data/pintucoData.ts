import {
  SurfaceOption,
  ProblemOption,
  PintucoColor,
  CertifiedPainter,
  SurfaceId,
  ProblemId,
  TechnicalRecommendation,
  ProjectNeedState,
  CustomerType,
} from "../types";

export const SURFACE_OPTIONS: SurfaceOption[] = [
  {
    id: "fachadas_exteriores",
    title: "Fachadas y Muros Exteriores",
    subtitle: "Exteriores expuestos al sol, lluvia e intemperie continua",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    defaultM2: 50,
    environment: "exterior",
  },
  {
    id: "paredes_interiores",
    title: "Paredes y Cielorrasos Interiores",
    subtitle: "Salas, habitaciones y pasillos de uso cotidiano",
    icon: "LayoutGrid",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
    defaultM2: 35,
    environment: "interior",
  },
  {
    id: "banos_cocinas",
    title: "Baños, Cocinas y Zonas Húmedas",
    subtitle: "Superficies sometidas a vapor constante, grasa y humedad",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    defaultM2: 20,
    environment: "interior",
  },
  {
    id: "madera_decks",
    title: "Madera, Decks y Muebles",
    subtitle: "Pérgolas, pisos de madera, puertas y acabados nobles",
    icon: "TreePine",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    defaultM2: 25,
    environment: "ambos",
  },
  {
    id: "metales_estructuras",
    title: "Metales, Rejas y Estructuras",
    subtitle: "Portones, cerramientos, perfiles y láminas de acero",
    icon: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    defaultM2: 15,
    environment: "ambos",
  },
  {
    id: "pisos_garajes",
    title: "Pisos, Garajes y Canchas",
    subtitle: "Superficies de alto tránsito peatonal o vehicular",
    icon: "Maximize2",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80",
    defaultM2: 40,
    environment: "exterior",
  },
  {
    id: "techos_cubiertas",
    title: "Techos, Terrazas e Impermeabilización",
    subtitle: "Placas de concreto, tejas y terrazas con filtraciones",
    icon: "Umbrella",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&auto=format&fit=crop&q=80",
    defaultM2: 45,
    environment: "exterior",
  },
];

export const PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: "manchas_grasa",
    title: "Manchas Frecuentes, Suciedad y Roce (Lavabilidad)",
    description: "Paredes de sala, pasillos o cuartos que requieren lavado periódico con agua y jabón sin perder color ni brillo.",
    tag: "Superlavable CleanGuard (Interior)",
    severity: "baja",
    environment: "interior",
  },
  {
    id: "hongos_moho",
    title: "Hongos o Moho por Condensación Interior",
    description: "Manchas negras o puntos verdes en cielorrasos o zonas con poca ventilación causados por humedad interna.",
    tag: "Antihongos Activo Interior",
    severity: "media",
    environment: "interior",
  },
  {
    id: "humedad_filtraciones",
    title: "Humedad Ascendente o Salitre Interior",
    description: "Pintura soplada o polvillo blanco en la base de la pared por humedad del suelo o muros vecinos.",
    tag: "Sellador Antialcalino y Barrera",
    severity: "alta",
    environment: "interior",
  },
  {
    id: "cambio_estetico",
    title: "Renovación de Color / Obra Blanca Interior",
    description: "Paredes estucadas o en buen estado listas para nuevo estilo con máxima cobertura y tersura.",
    tag: "Acabado Mate Aterciopelado",
    severity: "baja",
    environment: "interior",
  },
  {
    id: "desgaste_intemperie",
    title: "Desgaste, Decoloración o Tiza por Intemperie",
    description: "Fachada o superficie exterior que perdió color por el sol, cuarteada o con polvo al tocarla.",
    tag: "Máxima Protección UV Exterior",
    severity: "media",
    environment: "exterior",
  },
  {
    id: "oxido_corrosion",
    title: "Óxido Activo, Escamas y Corrosión",
    description: "Rejas o perfiles metálicos con herrumbre rojiza y pérdida de espesor por oxidación.",
    tag: "Sistema 3 en 1 Anticorrosivo",
    severity: "alta",
    environment: "ambos",
  },
];

/**
 * Retorna las opciones de problema técnico contextualmente filtradas según la superficie elegida.
 * Garantiza que jamás se mezclen problemas de exteriores (sol/lluvia) en paredes interiores,
 * ni problemas de interiores (lavabilidad de manchas domésticas) en techos o fachadas.
 */
export function getProblemsForSurface(surfaceId: SurfaceId): ProblemOption[] {
  switch (surfaceId) {
    case "paredes_interiores":
      return [
        {
          id: "manchas_grasa",
          title: "Manchas Frecuentes, Suciedad y Roce (Lavabilidad)",
          description: "Paredes de sala, cuartos o pasillos que requieren lavado continuo con agua y jabón sin perder color ni brillo.",
          tag: "Superlavable CleanGuard (Interior)",
          severity: "baja",
          environment: "interior",
        },
        {
          id: "hongos_moho",
          title: "Hongos o Moho por Condensación Interior",
          description: "Manchas negras o puntos verdes en cielorrasos y esquinas por poca ventilación y condensación.",
          tag: "Antihongos Activo Interior",
          severity: "media",
          environment: "interior",
        },
        {
          id: "humedad_filtraciones",
          title: "Humedad Ascendente o Salitre Interior",
          description: "Pared interna con pintura abombada o polvo blanco proveniente del subsuelo o muros vecinos.",
          tag: "Sellador Antialcalino y Barrera Humedad",
          severity: "alta",
          environment: "interior",
        },
        {
          id: "cambio_estetico",
          title: "Renovación de Color / Obra Nueva Interior",
          description: "Paredes estucadas o en buen estado listas para nuevo estilo con máxima cobertura y tersura.",
          tag: "Acabado Mate Aterciopelado",
          severity: "baja",
          environment: "interior",
        },
      ];

    case "banos_cocinas":
      return [
        {
          id: "hongos_moho",
          title: "Moho, Puntos Negros y Vapor Constante",
          description: "Condensación en techos y muros de ducha o cocción con proliferación de humedad.",
          tag: "Antihongos Grado Sanitario Aquaprotec",
          severity: "alta",
          environment: "interior",
        },
        {
          id: "manchas_grasa",
          title: "Grasa, Salpicaduras y Limpieza Frecuente",
          description: "Zonas de cocción o lavado que requieren alta resistencia a desengrasantes y detergentes.",
          tag: "Ultra Lavable Resistente a Detergentes",
          severity: "media",
          environment: "interior",
        },
        {
          id: "humedad_filtraciones",
          title: "Salpique Continuo de Agua y Humedad",
          description: "Paredes adyacentes a lavamanos o lavaderos con contacto indirecto constante de agua.",
          tag: "Película Impermeable al Vapor",
          severity: "alta",
          environment: "interior",
        },
        {
          id: "cambio_estetico",
          title: "Renovación Higiénica de Color",
          description: "Espacio en buen estado listo para cambio de color con acabado satinado higiénico.",
          tag: "Acabado Satinado Antibacterial",
          severity: "baja",
          environment: "interior",
        },
      ];

    case "fachadas_exteriores":
      return [
        {
          id: "desgaste_intemperie",
          title: "Desgaste, Decoloración o Tiza por Sol",
          description: "La fachada perdió color vivo, presenta cuarteaduras o suelta polvo blanco al tocarla.",
          tag: "Máxima Protección UV Koraza",
          severity: "media",
          environment: "exterior",
        },
        {
          id: "humedad_filtraciones",
          title: "Lluvia Frecuente y Filtraciones de Agua",
          description: "Muros exteriores expuestos que absorben agua de lluvia y causan humedad hacia el interior.",
          tag: "Hidrorepelencia Bio-Shield",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "hongos_moho",
          title: "Hongos, Algas o Verdín en Muro Exterior",
          description: "Presencia de manchas verdes o negras en muros sombríos o expuestos a vegetación.",
          tag: "Tratamiento Alguicida y Fungicida",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "cambio_estetico",
          title: "Renovación de Color Exterior / Estreno",
          description: "Fachada en buen estado lista para actualización estética y valorización del inmueble.",
          tag: "Alta Cobertura Acrílica Exterior",
          severity: "baja",
          environment: "exterior",
        },
      ];

    case "madera_decks":
      return [
        {
          id: "desgaste_intemperie",
          title: "Decoloración Solar, Resecamiento y Lluvia",
          description: "Decks, pérgolas o vigas expuestas agrietadas por sol constante y agua de lluvia.",
          tag: "Filtro Solar UV Microporoso",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "hongos_moho",
          title: "Pudrición o Manchas de Humedad en Madera",
          description: "Madera expuesta que se oscurece y reblandece por esporas biológicas y humedad.",
          tag: "Preservante y Fungicida Maderprotect",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "manchas_grasa",
          title: "Rayones, Desgaste por Roce y Manchas (Muebles/Puertas)",
          description: "Madera interior que requiere acabado de alta dureza resistente a derrames y fricción.",
          tag: "Poliuretano Alta Dureza",
          severity: "media",
          environment: "interior",
        },
        {
          id: "cambio_estetico",
          title: "Protección y Realce Natural de Vetas",
          description: "Madera virgen o restaurada lista para tinte noble traslúcido o barniz transparente.",
          tag: "Realce de Vetas y Brillo Natural",
          severity: "baja",
          environment: "ambos",
        },
      ];

    case "metales_estructuras":
      return [
        {
          id: "oxido_corrosion",
          title: "Óxido Activo, Escamas y Corrosión",
          description: "Rejas, portones o perfiles de acero con herrumbre rojiza y pérdida de espesor.",
          tag: "Sistema 3 en 1 Anticorrosivo",
          severity: "alta",
          environment: "ambos",
        },
        {
          id: "desgaste_intemperie",
          title: "Pérdida de Brillo y Esmalte Cuarteado",
          description: "Pintura vieja descascarada o quemada por el sol en cerramientos metálicos.",
          tag: "Esmalte Alquídico de Larga Duración",
          severity: "media",
          environment: "exterior",
        },
        {
          id: "cambio_estetico",
          title: "Pintura Nueva sobre Metal / Renovación",
          description: "Estructura metálica nueva o decapada lista para recibir color protector duradero.",
          tag: "Anticorrosivo + Esmalte Brillante",
          severity: "baja",
          environment: "ambos",
        },
      ];

    case "pisos_garajes":
      return [
        {
          id: "desgaste_intemperie",
          title: "Desgaste por Tráfico de Llantas y Abrasión",
          description: "Piso de concreto desgastado con huellas de neumáticos, polvo y alto tráfico vehicular.",
          tag: "Alta Resistencia Mecánica Tráfico",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "manchas_grasa",
          title: "Manchas de Aceite, Combustible y Grasa",
          description: "Superficie de garaje o taller manchada por derrames mecánicos e hidrocarburos.",
          tag: "Película Resistente a Químicos",
          severity: "media",
          environment: "ambos",
        },
        {
          id: "cambio_estetico",
          title: "Señalización, Color y Acabado para Concreto",
          description: "Pisos de canchas, parqueaderos o zonas peatonales listos para demarcación y color.",
          tag: "Esmalte Acrílico para Pisos",
          severity: "baja",
          environment: "exterior",
        },
      ];

    case "techos_cubiertas":
      return [
        {
          id: "humedad_filtraciones",
          title: "Goteras, Fisuras y Paso Directo de Agua",
          description: "Lozas de concreto o terrazas transitables con filtraciones que gotean al interior.",
          tag: "Membrana Elastomérica Fibratada",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "desgaste_intemperie",
          title: "Envejecimiento de Placa y Estancamiento",
          description: "Impermeabilización antigua cuarteada por el sol y empozamientos de lluvia.",
          tag: "Resistencia a UV y Encharcamientos",
          severity: "alta",
          environment: "exterior",
        },
        {
          id: "cambio_estetico",
          title: "Mantenimiento Preventivo e Impermeabilización Térmica",
          description: "Techo en buen estado listo para manto reflectivo blanco que reduce el calor interno.",
          tag: "Reflectancia Térmica y Sellado",
          severity: "baja",
          environment: "exterior",
        },
      ];

    default:
      return PROBLEM_OPTIONS;
  }
}

/**
 * Obtiene el rendimiento oficial Pintuco (m² por galón a 2 manos) según superficie y patología
 */
export function getCoverageM2PerGallon(surface: SurfaceId, problem?: ProblemId): number {
  switch (surface) {
    case "paredes_interiores":
      return problem === "humedad_filtraciones" || problem === "hongos_moho" ? 20 : 25;
    case "banos_cocinas":
      return 20;
    case "fachadas_exteriores":
      return 22;
    case "madera_decks":
      return 18;
    case "metales_estructuras":
      return 20;
    case "pisos_garajes":
      return 16;
    case "techos_cubiertas":
      return 10;
    default:
      return 22;
  }
}

/**
 * Motor de recomendación técnica de producto oficial Pintuco.
 * Filtra y asocia exclusivamente el producto exacto del catálogo real
 * según la superficie seleccionada y el reto técnico del cliente.
 */
export function getTechnicalRecommendation(
  needData: ProjectNeedState,
  userType: CustomerType = "hogar"
): TechnicalRecommendation {
  const { surface, problem, areaM2, city, selectedColor } = needData;

  // 1. Resolver producto oficial según la superficie y problema
  let productName = "Pintuco Koraza® Doble Vida";
  let productCategory = "Pintura Acrílica de Alta Resistencia Exterior";
  let warrantyYears = 7;
  let coverageRate = "22 m²/galón a 2 manos";
  let coverageM2PerGallon = 22;
  let pricePerGallon = 79900;
  let pricePerBucket = 359900;
  let systemSteps: string[] = [];
  let explanation = "";
  let technicalNotes = "";
  let benefits: string[] = [];

  switch (surface) {
    case "paredes_interiores": {
      if (problem === "humedad_filtraciones" || problem === "hongos_moho") {
        productName = "Pintuco Aquaprotec® / Viniltex Baños y Cocinas";
        productCategory = "Pintura Acrílica Impermeable y Antihongos para Zonas Húmedas Interiores";
        warrantyYears = 5;
        coverageRate = "20 m²/galón a 2 manos";
        coverageM2PerGallon = 20;
        pricePerGallon = 74900;
        pricePerBucket = 339900;
        systemSteps = [
          "Paso 1: Lavado y remoción de hongos con solución fungicida diluida.",
          "Paso 2: Aplicación de 1 mano de Sellador Antialcalino Pintuco para neutralizar porosidad.",
          "Paso 3: Aplicación de 2 manos de Viniltex Baños y Cocinas Aquaprotec con intervalo de 3 horas.",
        ];
        explanation = `Para tus paredes interiores de ${areaM2} m² en ${city}, el sistema Aquaprotec crea una barrera impermeable y fungicida activa grado hospitalario, diseñada para erradicar y prevenir hongos por condensación sin descascararse.`;
        technicalNotes = "Asegurar secado total de la pared antes de aplicar el sellador fungicida.";
        benefits = [
          "Película impermeable resistente a vapor y condensación",
          "Fungicida y antibacterial grado hospitalario",
          "Máxima lavabilidad sin desprendimiento",
          "Bajo VOC y bajo olor para habitar de inmediato",
        ];
      } else {
        productName = "Pintuco Viniltex® Avanzada";
        productCategory = "Pintura Tipo 1 Superlavable CleanGuard para Interiores";
        warrantyYears = 5;
        coverageRate = "25 m²/galón a 2 manos";
        coverageM2PerGallon = 25;
        pricePerGallon = 68900;
        pricePerBucket = 319900;
        systemSteps = [
          "Paso 1: Limpieza de polvo, grasa superficial y residuos con paño húmedo.",
          "Paso 2: Aplicación de 1 mano de Sellador 501 Pintuco para emparejar absorción.",
          "Paso 3: Aplicación de 2 manos cruzadas de Viniltex® Avanzada con intervalo de 2 horas.",
        ];
        explanation = `Para tus paredes interiores de ${areaM2} m² en ${city}, Viniltex® Avanzada con tecnología CleanGuard permite lavar manchas de manos, comida y roces hasta 5 veces más que pinturas estándar, manteniendo el acabado mate intacto.`;
        technicalNotes = "Dejar curar 14 días para alcanzar la máxima resistencia al lavado con esponja suave.";
        benefits = [
          "Tecnología CleanGuard: ultra lavable sin pérdida de color",
          "Poder cubriente superior a 2 manos",
          "Acabado mate aterciopelado de alta elegancia",
          "Fórmula ecológica certificada de bajo olor",
        ];
      }
      break;
    }

    case "banos_cocinas": {
      productName = "Pintuco Viniltex® Baños y Cocinas Aquaprotec";
      productCategory = "Pintura Antihongos Grado Sanitario y Alta Resistencia al Vapor";
      warrantyYears = 5;
      coverageRate = "20 m²/galón a 2 manos";
      coverageM2PerGallon = 20;
      pricePerGallon = 74900;
      pricePerBucket = 339900;
      systemSteps = [
        "Paso 1: Limpieza y desinfección de zonas afectadas con jabón neutro y fungicida.",
        "Paso 2: Aplicación de 1 mano de Imprimante Fijador Antialcalino Pintuco.",
        "Paso 3: Aplicación de 2 manos de Viniltex Baños y Cocinas con película semi-brillante protectora.",
      ];
      explanation = `Para tu zona húmeda de ${areaM2} m² en ${city}, este recubrimiento formulado para baños y cocinas contiene biocidas activos que impiden la proliferación de moho negro y resisten salpicaduras de grasa y humedad constante.`;
      technicalNotes = "Ventilar el espacio durante la aplicación y secado entre manos.";
      benefits = [
        "Protección activa contra moho y bacterias por 5 años",
        "Resistente a desinfectantes y desengrasantes de cocina",
        "Película hidrófuga que repele vapor de ducha",
        "Excelente adhesión sobre estucos y revoques curados",
      ];
      break;
    }

    case "fachadas_exteriores": {
      productName = "Pintuco Koraza® Doble Vida";
      productCategory = "Pintura Acrílica 100% Alta Resistencia Intemperie Exterior";
      warrantyYears = 7;
      coverageRate = "22 m²/galón a 2 manos";
      coverageM2PerGallon = 22;
      pricePerGallon = 79900;
      pricePerBucket = 359900;
      systemSteps = [
        "Paso 1: Lavado y remoción de partes flojas con espátula.",
        "Paso 2: Aplicación de 1 mano de Sellador Antialcalino Koraza® para neutralizar porosidad.",
        "Paso 3: Aplicación de 2 manos de Koraza® Doble Vida con intervalo de 3 horas.",
      ];
      explanation = `Para tu fachada exterior de ${areaM2} m² en ${city}, el sistema Koraza® Doble Vida ofrece tecnología hidrorepelente con Bio-Shield que crea una barrera impermeable contra la humedad y rayos UV garantizando durabilidad por 7 años.`;
      technicalNotes = "Asegurar que la superficie esté completamente seca antes de aplicar el sellador.";
      benefits = [
        "100% Acrílica con máxima resistencia a la intemperie",
        "Tecnología hidrorepelente que repele agua de lluvia",
        "Antihongos y antialgas activo Bio-Shield",
        "Alta lavabilidad y retención de color con 7 años de garantía",
      ];
      break;
    }

    case "madera_decks": {
      productName = "Pintuco Maderprotect® Filtro UV / Barniz Marino";
      productCategory = "Protector Microporoso y Embellecedor para Madera";
      warrantyYears = 4;
      coverageRate = "18 m²/galón a 2 manos";
      coverageM2PerGallon = 18;
      pricePerGallon = 84900;
      pricePerBucket = 379900;
      systemSteps = [
        "Paso 1: Lijado suave en el sentido de la veta con lija 180-220.",
        "Paso 2: Limpieza de polvillo con Ajustador Pintuco.",
        "Paso 3: Aplicación de 2 a 3 manos de Maderprotect dejando secar 6 horas entre manos.",
      ];
      explanation = `Para tu madera de ${areaM2} m² en ${city}, Maderprotect penetra la fibra sin crear película quebradiza, filtrando los rayos solares UV y protegiendo contra hongos y lluvia.`;
      technicalNotes = "No aplicar sobre maderas verdes o con humedad superior al 18%.";
      benefits = [
        "Filtro solar UV de última generación",
        "Fórmula microporosa: deja respirar la madera sin descascararse",
        "Resalta vetas naturales con brillo satinado elegante",
        "Protección contra pudrición y humedad",
      ];
      break;
    }

    case "metales_estructuras": {
      productName = "Pintuco Pintulux® 3 en 1 Anticorrosivo";
      productCategory = "Esmalte Alquídico Anticorrosivo e Inhibidor de Herrumbre";
      warrantyYears = 5;
      coverageRate = "20 m²/galón a 2 manos";
      coverageM2PerGallon = 20;
      pricePerGallon = 82500;
      pricePerBucket = 369900;
      systemSteps = [
        "Paso 1: Remoción de óxido suelto y cascarilla con cepillo de alambre o lija.",
        "Paso 2: Desengrase profundo con solvente Ajustador Pintuco.",
        "Paso 3: Aplicación de 2 manos directas de Pintulux® 3 en 1 con intervalo de 4 a 6 horas.",
      ];
      explanation = `Para tus estructuras metálicas de ${areaM2} m² en ${city}, Pintulux® 3 en 1 actúa como inhibidor de óxido, anticorrosivo y esmalte de alta durabilidad en una sola aplicación directa.`;
      technicalNotes = "No requiere anticorrosivo previo sobre metales ferrosos estándar.";
      benefits = [
        "Tecnología 3 en 1: neutraliza óxido, sella y da color",
        "Alta resistencia a golpes, raspaduras y corrosión ambiental",
        "Acabado brillante de máxima retención",
        "Apto para rejas, portones, perfiles y ventanas metálicas",
      ];
      break;
    }

    case "pisos_garajes": {
      productName = "Pintuco Pintutráfico® Pisos de Concreto";
      productCategory = "Esmalte Acrílico de Alta Resistencia Mecánica y Tráfico";
      warrantyYears = 3;
      coverageRate = "16 m²/galón a 2 manos";
      coverageM2PerGallon = 16;
      pricePerGallon = 89900;
      pricePerBucket = 399900;
      systemSteps = [
        "Paso 1: Lavado y desengrase de la placa de concreto con detergente industrial.",
        "Paso 2: Apertura de poro químico o mecánico para garantizar anclaje profundo.",
        "Paso 3: Aplicación de 2 manos de Pintutráfico® con rodillo para epóxicos / solventes.",
      ];
      explanation = `Para tu piso de ${areaM2} m² en ${city}, Pintutráfico® ofrece máxima resistencia a la abrasión por tráfico vehicular y peatonal, manchas de aceite automotriz y lavado con hidrolavadora.`;
      technicalNotes = "Dejar curar 72 horas antes de permitir paso vehicular pesado.";
      benefits = [
        "Resistente al arranque de llantas calientes y gasolina",
        "Acabado mate de gran visibilidad y seguridad",
        "Secado rápido al tacto en 30 minutos",
        "Apto para garajes, parqueaderos, canchas y bodegas",
      ];
      break;
    }

    case "techos_cubiertas": {
      productName = "Pintuco Impermeabilizante Fibratado 7 Años";
      productCategory = "Membrana Elastomérica Líquida con Microfibras de Refuerzo";
      warrantyYears = 7;
      coverageRate = "10 m²/galón a 2 manos";
      coverageM2PerGallon = 10;
      pricePerGallon = 89900;
      pricePerBucket = 389900;
      systemSteps = [
        "Paso 1: Lavado a presión y secado de la placa o losa eliminando empozamientos.",
        "Paso 2: Imprimación con 1 mano diluida (3 partes de producto por 1 de agua).",
        "Paso 3: Aplicación de 2 manos cruzadas puras reforzando bajantes y medias cañas.",
      ];
      explanation = `Para tu cubierta o terraza de ${areaM2} m² en ${city}, la membrana elastomérica fibratada sella microfisuras elásticamente y resiste estancamientos continuos de agua de lluvia por 7 años garantizados.`;
      technicalNotes = "No aplicar si hay amenaza de lluvia en las siguientes 4 horas.";
      benefits = [
        "Microfibras incorporadas que reemplazan tela de refuerzo",
        "Elongación superior al 300% para resistir dilatación térmica",
        "Barrera 100% impermeable al agua estancada",
        "Reflectancia solar que disminuye el calor en el interior",
      ];
      break;
    }
  }

  // 2. Cálculos precisos de galones y envases
  const totalGallons = Math.max(1, Math.ceil((areaM2 * 2) / coverageM2PerGallon));
  const bucketsCount = Math.floor(totalGallons / 5);
  const gallonsCount = totalGallons % 5;
  const recommendedFormat =
    bucketsCount > 0
      ? gallonsCount > 0
        ? `${bucketsCount} Cuñete(s) (5 gal) + ${gallonsCount} Galón(es)`
        : `${bucketsCount} Cuñete(s) (5 gal)`
      : `${gallonsCount} Galón(es)`;

  const productEstimatedTotal = bucketsCount * pricePerBucket + gallonsCount * pricePerGallon;
  const laborEstimatedTotal = Math.round(areaM2 * 14500);
  const totalEstimated = productEstimatedTotal + laborEstimatedTotal;

  return {
    productName,
    productCategory,
    warrantyYears,
    systemSteps,
    explanation,
    technicalNotes,
    benefits,
    selectedColor: {
      name: selectedColor.name,
      hex: selectedColor.hex,
    },
    calculation: {
      areaM2,
      recommendedFormat,
      bucketsCount,
      gallonsCount,
      totalGallons,
      litersEstimate: Math.round(totalGallons * 3.785),
      coverageRate,
      coatCount: 2,
    },
    pricing: {
      currency: "COP",
      productEstimatedTotal,
      laborEstimatedTotal,
      totalEstimated,
      deliveryFee: 0,
    },
    supplyChain: {
      status: "in_stock",
      badgeText: "Disponible en Bodega Central y Centro de Tinturado",
      estimatedDispatchHours: "2 a 4 horas",
      nearestStore: `Pintacasa Pintuco ${city.split(" ")[0]}`,
      stockLevel: "Alto (Stock Verificado)",
    },
  };
}

export const PINTUCO_PALETTES: PintucoColor[] = [
  {
    code: "P101",
    name: "Blanco Nieve",
    hex: "#F8F9FA",
    collection: "Neutros Elegantes",
    description: "El blanco más puro y luminoso para sensación de amplitud y limpieza.",
  },
  {
    code: "P102",
    name: "Gris Grafito Urbano",
    hex: "#3E454C",
    collection: "Tendencias 2026",
    description: "Tono sofisticado moderno, ideal para contrastes en fachadas e interiores.",
  },
  {
    code: "P103",
    name: "Azul Caribe Pintuco",
    hex: "#007A87",
    collection: "Tendencias 2026",
    description: "Identidad fresca, balanceada entre serenidad y energía contemporánea.",
  },
  {
    code: "P104",
    name: "Arena Colonial",
    hex: "#E7D8C5",
    collection: "Exteriores",
    description: "Cálido y resistente, disimula el polvo y armoniza con jardines.",
  },
  {
    code: "P105",
    name: "Terracota Andina",
    hex: "#B85D43",
    collection: "Exteriores",
    description: "Tono rústico y acogedor con excelente estabilidad a los rayos solares.",
  },
  {
    code: "P106",
    name: "Verde Palma Real",
    hex: "#2C5E43",
    collection: "Tendencias 2026",
    description: "Aporta conexión biofílica y tranquilidad a salas y patios.",
  },
  {
    code: "P107",
    name: "Almendra Suave",
    hex: "#F1EBE1",
    collection: "Neutros Elegantes",
    description: "Neutro cálido que aporta calidez sin restar luminosidad natural.",
  },
  {
    code: "P108",
    name: "Mostaza Colonial",
    hex: "#D99B26",
    collection: "Vibrantes",
    description: "Acento arquitectónico llamativo para puertas, muros focales o locales.",
  },
  {
    code: "P109",
    name: "Caoba Real Filtro UV",
    hex: "#5C2C16",
    collection: "Madera & Piedra",
    description: "Tinte traslúcido para decks y maderas nobles que resalta vetas.",
  },
];

export const COLOMBIAN_CITIES = [
  "Bogotá D.C.",
  "Medellín (Antioquia)",
  "Cali (Valle)",
  "Barranquilla (Atlántico)",
  "Bucaramanga (Santander)",
  "Cartagena (Bolívar)",
  "Pereira (Risaralda)",
  "Manizales (Caldas)",
  "Ibagué (Tolima)",
  "Santa Marta (Magdalena)",
];

export const PINTUCO_STORES = [
  {
    id: "st-bog-01",
    city: "Bogotá D.C.",
    name: "Tienda Pintacasa Pintuco - Calle 80",
    address: "Calle 80 # 69-45, Ferias",
    phone: "(601) 320 9000",
    distance: "1.8 km",
    stockAvailable: true,
    openingHours: "Hoy abierto: 7:30 AM a 6:00 PM",
  },
  {
    id: "st-bog-02",
    city: "Bogotá D.C.",
    name: "Centro de Experiencia Pintuco - Calle 134",
    address: "Av. Calle 134 # 19-32, Cedritos",
    phone: "(601) 320 9001",
    distance: "3.2 km",
    stockAvailable: true,
    openingHours: "Hoy abierto: 8:00 AM a 6:30 PM",
  },
  {
    id: "st-med-01",
    city: "Medellín (Antioquia)",
    name: "Tienda Pintacasa Pintuco - Guayabal",
    address: "Cra. 52 # 10-70, Guayabal",
    phone: "(604) 444 8000",
    distance: "1.2 km",
    stockAvailable: true,
    openingHours: "Hoy abierto: 7:00 AM a 6:00 PM",
  },
  {
    id: "st-med-02",
    city: "Medellín (Antioquia)",
    name: "Pintuco Store - Poblado Calle 10",
    address: "Calle 10 # 43D-21, El Poblado",
    phone: "(604) 444 8002",
    distance: "2.4 km",
    stockAvailable: true,
    openingHours: "Hoy abierto: 8:00 AM a 7:00 PM",
  },
  {
    id: "st-cali-01",
    city: "Cali (Valle)",
    name: "Tienda Pintacasa Pintuco - Pasoancho",
    address: "Calle 13 # 66-10, Pasoancho",
    phone: "(602) 330 4000",
    distance: "2.1 km",
    stockAvailable: true,
    openingHours: "Hoy abierto: 7:30 AM a 6:00 PM",
  },
];

export const CERTIFIED_PAINTERS: CertifiedPainter[] = [
  {
    id: "pnt-101",
    name: "Carlos Mario Restrepo",
    role: "Maestro Aplicador Certificado Pintuco Nivel Master",
    rating: 4.97,
    reviewsCount: 156,
    completedJobs: 412,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80",
    ],
    experienceYears: 14,
    badges: ["Garantía Pintuco 360", "Especialista en Fachadas", "ARL & Alturas Vigente"],
    availableSlot: "Hoy o Mañana (Disponibilidad Prioritaria)",
    hourlyRate: 35000,
    phone: "+57 312 458 9012",
  },
  {
    id: "pnt-102",
    name: "Diana Marcela Gómez",
    role: "Técnica Especialista en Acabados y Decoración de Interiores",
    rating: 4.94,
    reviewsCount: 112,
    completedJobs: 245,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500&auto=format&fit=crop&q=80",
    ],
    experienceYears: 9,
    badges: ["Top Rated Interior", "Especialista CleanGuard", "Trazabilidad Digital"],
    availableSlot: "En 24 - 48 horas",
    hourlyRate: 32000,
    phone: "+57 315 890 2341",
  },
  {
    id: "pnt-103",
    name: "Andrés Felipe Valencia",
    role: "Especialista en Recubrimientos Industriales, Epóxicos y Pisos",
    rating: 4.89,
    reviewsCount: 84,
    completedJobs: 198,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=500&auto=format&fit=crop&q=80",
    ],
    experienceYears: 16,
    badges: ["Epóxicos de Tráfico", "Equipos Airless Profesionales", "Seguridad Industrial"],
    availableSlot: "Esta misma semana",
    hourlyRate: 38000,
    phone: "+57 320 671 9904",
  },
];

export const DEMO_PRESETS = [
  {
    title: "Caso Fachada con Humedad (Bogotá)",
    subtitle: "Casa familiar en clima frío y lluvioso",
    data: {
      surface: "fachadas_exteriores" as const,
      problem: "humedad_filtraciones" as const,
      areaM2: 55,
      selectedColor: PINTUCO_PALETTES[3], // Arena Colonial
      city: "Bogotá D.C.",
      address: "Calle 134 # 19-45, Barrio Cedritos",
      urgency: "urgente_24h" as const,
      projectNotes: "Filtraciones leves en la pared lateral por lluvias recientes.",
    },
  },
  {
    title: "Caso Renovación Interior (Medellín)",
    subtitle: "Apartamento sala-comedor y cocina",
    data: {
      surface: "paredes_interiores" as const,
      problem: "manchas_grasa" as const,
      areaM2: 38,
      selectedColor: PINTUCO_PALETTES[2], // Azul Caribe Pintuco
      city: "Medellín (Antioquia)",
      address: "Cra. 43A # 18 Sur-30, El Poblado",
      urgency: "esta_semana" as const,
      projectNotes: "Queremos color moderno y pintura superlavable por niños.",
    },
  },
  {
    title: "Caso Piso de Parqueadero (Cali)",
    subtitle: "Garaje residencial con tránsito vehicular",
    data: {
      surface: "pisos_garajes" as const,
      problem: "desgaste_intemperie" as const,
      areaM2: 42,
      selectedColor: PINTUCO_PALETTES[1], // Gris Grafito Urbano
      city: "Cali (Valle)",
      address: "Av. Roosevelt # 34-12, Barrio San Fernando",
      urgency: "esta_semana" as const,
      projectNotes: "Piso de concreto con manchas de llantas, buscamos acabado duradero.",
    },
  },
];
