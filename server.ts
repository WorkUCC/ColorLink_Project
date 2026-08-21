import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client if key is available
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Pintuco Catalog Knowledge Base for fast fallback and grounded responses
const PINTUCO_PRODUCTS = {
  exterior_facade: {
    name: "Pintuco Koraza® Doble Vida",
    type: "Pintura Acrílica de Alta Resistencia Exterior",
    coveragePerGal: 22, // m² per gallon for 2 coats
    pricePerGal: 89900,
    pricePerBucket: 389900, // 5 galones
    warrantyYears: 7,
    benefits: [
      "100% Acrílica con máxima resistencia a rayos UV e intemperie",
      "Formulación hidrorepelente que evita humedad y filtraciones",
      "Antihongos y antialgas con tecnología Bio-Shield",
      "Lavable y autolimpiable con agua de lluvia",
    ],
    sealant: "Sellador Antialcalino Pintuco Koraza",
    applicationTips: "Aplicar 1 mano de Sellador Antialcalino + 2 manos de Koraza® pura o diluida max 10%.",
  },
  interior_living: {
    name: "Pintuco Viniltex® Avanzada",
    type: "Pintura Premium de Máxima Lavabilidad",
    coveragePerGal: 28, // m² per gallon for 2 coats
    pricePerGal: 67900,
    pricePerBucket: 295000,
    warrantyYears: 5,
    benefits: [
      "Superlavable con tecnología CleanGuard (resiste más de 10,000 ciclos)",
      "Bajo olor y cero VOC para ocupación inmediata",
      "Excelente poder de cubrimiento en primera mano",
      "Acabado mate sedoso de alta elegancia",
    ],
    sealant: "Imprimante Acrílico Viniltex",
    applicationTips: "Lijar suavemente, aplicar 1 mano de imprimante en zonas porosas y 2 manos de Viniltex.",
  },
  interior_moisture: {
    name: "Pintuco Aquaprotec® Baños & Cocinas",
    type: "Recubrimiento Anti-Vapor y Antihongos Activo",
    coveragePerGal: 24,
    pricePerGal: 79900,
    pricePerBucket: 349000,
    warrantyYears: 5,
    benefits: [
      "Barrera impermeable contra condensación y vapor caliente",
      "Protección fungicida reforzada contra moho negro y bacterias",
      "Acabado satinado fácil de desinfectar",
      "Adherencia superior sobre estuco o repinte",
    ],
    sealant: "Imprimante Antihumedad Aquaprotec",
    applicationTips: "Limpiar previamente el moho existente con solución fungicida antes de aplicar 2 manos.",
  },
  wood_deck: {
    name: "Pintuco Barniz Marino Filtro Solar / Maderlux®",
    type: "Protector e Impregnante de Maderas Exteriores/Interiores",
    coveragePerGal: 20,
    pricePerGal: 84900,
    pricePerBucket: 369000,
    warrantyYears: 4,
    benefits: [
      "Filtro UV activo que evita el resecamiento y decoloración",
      "Alta flexibilidad que acompaña la dilatación natural de la madera",
      "Resistencia a humedad, rocío y hongos xilófagos",
      "Resalta las vetas naturales con brillo duradero",
    ],
    sealant: "Tinte Preservante Madex",
    applicationTips: "Madera seca y limpia, aplicar a poro abierto sin exceso.",
  },
  metal_industrial: {
    name: "Pintuco Esmalte Pintulux® 3 en 1 Anticorrosivo",
    type: "Esmalte Alquídico con Neutralizador de Óxido",
    coveragePerGal: 25,
    pricePerGal: 74900,
    pricePerBucket: 325000,
    warrantyYears: 5,
    benefits: [
      "Transforma y neutraliza el óxido existente sin necesidad de arenado pesado",
      "Fórmula 3 en 1: Anticorrosivo + Base + Acabado brillante",
      "Secado rápido y alta adherencia sobre hierro, acero o aluminio",
      "Excelente resistencia al rayado y a la intemperie",
    ],
    sealant: "Fondo Anticorrosivo Pintuco (para corrosión severa)",
    applicationTips: "Retirar escamas sueltas de óxido con cepillo de alambre y aplicar 2 manos uniformes.",
  },
  floor_garage: {
    name: "Pintuco Pisos® Acrílico & Epóxico de Tráfico",
    type: "Recubrimiento de Alto Tráfico Peatonal y Vehicular",
    coveragePerGal: 18,
    pricePerGal: 99900,
    pricePerBucket: 440000,
    warrantyYears: 5,
    benefits: [
      "Soporta paso de llantas calientes y derrames ocasionales de aceite",
      "Antideslizante con textura segura",
      "Fácil de lavar con manguera a presión",
      "Resistente a la abrasión continua",
    ],
    sealant: "Acondicionador de Pisos Pintuco",
    applicationTips: "Asegurar que el concreto esté curado, libre de humedad por capilaridad y desengrasado.",
  },
  roof_waterproof: {
    name: "Pintuco Impermeabilizante Fibratado 7 Años",
    type: "Membrana Líquida Elastomérica con Microfibras",
    coveragePerGal: 12,
    pricePerGal: 92900,
    pricePerBucket: 399000,
    warrantyYears: 7,
    benefits: [
      "Cura formando una membrana continua y elástica sin empates",
      "Fibras estructurales que puentean microfisuras dinámicas",
      "Reduce la temperatura interior gracias a su alta reflectancia térmica (en blanco)",
      "Transitabilidad peatonal para mantenimiento",
    ],
    sealant: "Imprimación con dilución 1:3",
    applicationTips: "Aplicar en capas cruzadas respetando los tiempos de secado de 4 a 6 horas entre manos.",
  },
};

// API: Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "ColorLink API Engine",
    version: "2.4.0",
    geminiConfigured: Boolean(apiKey),
  });
});

// API: AI Diagnostic & Formulation Recommendation
app.post("/api/diagnose", async (req: Request, res: Response) => {
  try {
    const {
      surfaceType = "exterior_facade",
      problemType = "desgaste",
      areaM2 = 45,
      location = "Bogotá D.C.",
      urgency = "media",
      colorName = "Blanco Nieve (P100)",
      colorHex = "#F5F6F8",
      projectDetails = "",
      customerType = "hogar",
    } = req.body;

    const areaNum = Number(areaM2) > 0 ? Number(areaM2) : 40;

    // Pick best matching base product from catalog
    let matchedKey: keyof typeof PINTUCO_PRODUCTS = "exterior_facade";
    if (surfaceType.includes("interior") || surfaceType === "paredes_interiores") {
      matchedKey = problemType.includes("humedad") || problemType.includes("hongos")
        ? "interior_moisture"
        : "interior_living";
    } else if (surfaceType.includes("madera")) {
      matchedKey = "wood_deck";
    } else if (surfaceType.includes("metal") || surfaceType.includes("industrial")) {
      matchedKey = "metal_industrial";
    } else if (surfaceType.includes("piso") || surfaceType.includes("garaje")) {
      matchedKey = "floor_garage";
    } else if (surfaceType.includes("techo") || surfaceType.includes("cubierta") || problemType.includes("goteras")) {
      matchedKey = "roof_waterproof";
    } else {
      matchedKey = "exterior_facade";
    }

    const baseProduct = PINTUCO_PRODUCTS[matchedKey];

    // Mathematical paint calculation
    const gallonsNeededRaw = areaNum / baseProduct.coveragePerGal;
    const bucketsCount = Math.floor(gallonsNeededRaw / 5);
    const remainingGallons = Math.ceil(gallonsNeededRaw % 5);
    const totalGallonsEquiv = (bucketsCount * 5) + remainingGallons;

    // Cost estimation
    const estimatedProductCost = (bucketsCount * baseProduct.pricePerBucket) + (remainingGallons * baseProduct.pricePerGal);
    const estimatedLaborCost = Math.round(areaNum * 14500); // approx $14.500 COP per m2 for professional application

    let aiExplanation = "";
    let technicalNotes = "";
    let systemSteps = [
      "Paso 1: Limpieza y preparación superficial de la zona.",
      `Paso 2: Aplicación del ${baseProduct.sealant} para sellar porosidad.`,
      `Paso 3: Aplicación de 2 manos cruzadas de ${baseProduct.name}.`,
    ];

    if (ai) {
      try {
        const prompt = `Eres el Ingeniero Técnico Consultor Senior de Pintuco para la plataforma ColorLink.
El cliente solicita una recomendación para su proyecto:
- Tipo de Superficie: ${surfaceType}
- Problema o necesidad diagnosticada: ${problemType}
- Área aproximada: ${areaNum} m²
- Ubicación: ${location}
- Urgencia: ${urgency}
- Tipo de cliente: ${customerType}
- Detalles adicionales: ${projectDetails || "Ninguno"}

Por favor, genera un diagnóstico técnico empático, claro, profesional y no intimidante en español.
Explica de manera sencilla por qué el sistema "${baseProduct.name}" es la mejor solución técnica para este caso específico, qué tecnología Pintuco resuelve el problema (ej: Bio-Shield, hidrorepelencia, CleanGuard, polímeros elastoméricos) y las recomendaciones clave de preparación para asegurar la garantía de ${baseProduct.warrantyYears} años.

Devuelve tu respuesta en formato JSON estructurado con las siguientes claves:
{
  "headline": "Frase corta y contundente del diagnóstico (ej: Sistema de protección hidrorepelente de larga duración)",
  "explanation": "Explicación técnica en 2-3 párrafos claros y amigables para el cliente",
  "keyBenefit": "El mayor beneficio práctico que obtendrá el cliente",
  "technicalSteps": ["Paso 1...", "Paso 2...", "Paso 3..."],
  "curationTip": "Consejo experto de aplicación para maximizar la durabilidad"
}`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text);
          aiExplanation = parsed.explanation || "";
          if (parsed.technicalSteps && Array.isArray(parsed.technicalSteps)) {
            systemSteps = parsed.technicalSteps;
          }
          technicalNotes = parsed.curationTip || "";
        }
      } catch (err) {
        console.warn("Gemini diagnosis fallback used:", err);
      }
    }

    if (!aiExplanation) {
      aiExplanation = `Para tu proyecto de ${areaNum} m² en ${location}, el sistema técnico recomendado es ${baseProduct.name}. Su formulación especializada actúa directamente sobre el problema de ${problemType}, creando una barrera de alta adherencia y resistencia química que previene futuros deterioros y garantiza un acabado uniforme y duradero por hasta ${baseProduct.warrantyYears} años.`;
    }

    return res.json({
      success: true,
      recommendation: {
        productName: baseProduct.name,
        productCategory: baseProduct.type,
        warrantyYears: baseProduct.warrantyYears,
        systemSteps,
        explanation: aiExplanation,
        technicalNotes: technicalNotes || baseProduct.applicationTips,
        benefits: baseProduct.benefits,
        selectedColor: {
          name: colorName,
          hex: colorHex,
        },
        calculation: {
          areaM2: areaNum,
          recommendedFormat: bucketsCount > 0
            ? `${bucketsCount} Cuñete(s) (5 gal) ${remainingGallons > 0 ? `+ ${remainingGallons} Galón(es)` : ""}`
            : `${remainingGallons || 1} Galón(es)`,
          bucketsCount,
          gallonsCount: remainingGallons,
          totalGallons: totalGallonsEquiv || 1,
          litersEstimate: Math.round(totalGallonsEquiv * 3.785),
          coverageRate: `${baseProduct.coveragePerGal} m²/galón a 2 manos`,
          coatCount: 2,
        },
        pricing: {
          currency: "COP",
          productEstimatedTotal: estimatedProductCost,
          laborEstimatedTotal: estimatedLaborCost,
          totalEstimated: estimatedProductCost + estimatedLaborCost,
          deliveryFee: 15000,
        },
        supplyChain: {
          status: "in_stock",
          badgeText: "Disponible en Bodega Central y Centro de Distribución",
          estimatedDispatchHours: urgency === "alta" ? "2 a 4 horas" : "24 a 48 horas",
          nearestStore: `Pintuco Store ${location.split(",")[0] || "Centro"}`,
          stockLevel: "Alto (Más de 50 unidades listas para tinturado)",
        },
      },
    });
  } catch (error) {
    console.error("Diagnosis error:", error);
    res.status(500).json({
      success: false,
      error: "Error processing recommendation",
    });
  }
});

// API: Nearby Certified Painters Directory (ServiceTitan inspiration)
app.get("/api/painters", (_req: Request, res: Response) => {
  const painters = [
    {
      id: "pnt-101",
      name: "Carlos Mario Restrepo",
      role: "Maestro Aplicador Certificado Pintuco Nivel Master",
      rating: 4.96,
      reviewsCount: 142,
      completedJobs: 380,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      experienceYears: 12,
      badges: ["Garantía Pintuco 360", "Especialista en Fachadas", "Verificado Antecedentes & ARL"],
      availableSlot: "Hoy o Mañana (Disponibilidad Inmediata)",
      hourlyRate: 35000,
    },
    {
      id: "pnt-102",
      name: "Diana Marcela Gómez",
      role: "Técnica Especialista en Acabados y Decoración Interior",
      rating: 4.92,
      reviewsCount: 98,
      completedJobs: 215,
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      experienceYears: 8,
      badges: ["Top Rated Interior", "Manejo de Acabados Especiales", "Certificación Pintuco Pro"],
      availableSlot: "En 48 horas",
      hourlyRate: 32000,
    },
    {
      id: "pnt-103",
      name: "Andrés Felipe Valencia",
      role: "Especialista en Recubrimientos Industriales y Pisos",
      rating: 4.88,
      reviewsCount: 76,
      completedJobs: 190,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      experienceYears: 15,
      badges: ["Epóxicos & Impermeabilización", "Equipos Airless", "Seguridad en Alturas"],
      availableSlot: "Esta semana",
      hourlyRate: 38000,
    },
  ];

  res.json({ success: true, painters });
});

// Setup Vite development middleware or production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ColorLink Server running on http://localhost:${PORT}`);
  });
}

startServer();
