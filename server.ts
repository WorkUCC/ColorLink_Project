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
          model: "gemini-3.8-flash",
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

// API: Asesora Técnica Virtual Sofía (Respuestas reales con IA para Pintuco ColorLink)
app.post("/api/advisor/chat", async (req: Request, res: Response) => {
  try {
    const { question, surface, problem, areaM2, selectedColor, currentStep, history } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ success: false, error: "La pregunta no puede estar vacía" });
    }

    const trimmedQuestion = question.trim();

    // Contexto de proyecto
    const contextInfo = `
- Superficie actual del proyecto: ${surface || "Paredes interiores"}
- Reto técnico identificado: ${problem || "Condición general"}
- Área del proyecto: ${areaM2 || 45} m²
- Color seleccionado: ${selectedColor?.name || "Blanco"} (${selectedColor?.code || "Base"})
- Paso actual del flujo: Paso ${currentStep || 2} de 6 en ColorLink Pintuco
`;

    let advisorAnswer = "";

    // 1. Intentar responder con Gemini 3.8 Flash si la API Key está configurada
    if (ai) {
      try {
        const systemInstruction = `Eres Sofía, Ingeniera de Aplicación y Asesora Técnica Oficial de Pintuco Colombia para la plataforma digital ColorLink.
Tu misión principal es responder de manera DIRECTA, PRECISA, CÁLIDA Y TÉCNICAMENTE RIGUROSA a la pregunta del usuario.

REGLAS FUNDAMENTALES:
1. RESPONDE EXACTAMENTE A LO QUE SE TE PREGUNTA. No te limites a repetir la superficie o reto del cliente. Si pregunta por dilución, explica proporciones y solvente; si pregunta por herramientas, recomienda rodillos/brochas específicos; si pregunta por precios o formatos (galón vs cuñete), explícalo claramente; si pregunta por secado, manos o cielo raso, dale la respuesta concreta.
2. Si la duda es técnica o constructiva (humedad, filtración, grietas, estuco, sellador, metales oxidados, maderas, techos, impermeabilización), proporciona una solución paso a paso con productos Pintuco (Viniltex, Koraza, Aquaprotec, Pintulux, Madex, Sellomax, etc.).
3. Sé concisa y agradable (1 a 3 párrafos cortos o viñetas fáciles de leer en pantalla de celular).
4. Usa un tono cercano y profesional en español colombiano neutral (puedes tratar de "tú").
5. Si preguntan algo totalmente ajeno a pintura o construcción, responde con humor amable y reorienta la charla hacia la pintura de su espacio.`;

        // Construir historial de conversación si existe
        let conversationPrompt = `Contexto del proyecto del cliente:${contextInfo}\n\n`;
        if (Array.isArray(history) && history.length > 0) {
          conversationPrompt += "Historial previo de la conversación:\n";
          history.slice(-4).forEach((h: { sender: string; text: string }) => {
            conversationPrompt += `${h.sender === "user" ? "Cliente" : "Sofía"}: ${h.text}\n`;
          });
          conversationPrompt += "\n";
        }
        conversationPrompt += `Pregunta actual del cliente: "${trimmedQuestion}"\n\nResponde como Sofía directamente a esta pregunta:`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: conversationPrompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        if (aiResponse.text) {
          advisorAnswer = aiResponse.text.trim();
        }
      } catch (err) {
        console.warn("[Sofía Advisor] Error en llamada a Gemini, usando motor de conocimiento técnico de respaldo:", err);
      }
    }

    // 2. Motor de respaldo de conocimiento técnico especializado de Pintuco
    if (!advisorAnswer) {
      const q = trimmedQuestion.toLowerCase();

      if (q.includes("dilu") || q.includes("agua") || q.includes("thinner") || q.includes("disolv") || q.includes("mezcl")) {
        advisorAnswer = `Para las pinturas vinílicas de Pintuco (como Viniltex y Koraza), la dilución recomendada es con **agua potable limpia**:
• Para aplicación con brocha o rodillo: agrega máximo un **10% a 15% de agua** (aproximadamente 1 vaso de agua por galón).
• Para aplicación con pistola o Airless: puedes diluir hasta un **20% de agua**.
⚠️ **Importante:** Nunca diluyas de más, ya que reducirías el espesor de película protectora y el poder cubriente. En esmaltes como Pintulux 3 en 1, no requiere thinner si aplicas con brocha, o usa Thinner Pintuco si usas pistola.`;
      } else if (q.includes("cielo") || q.includes("techo") || q.includes("raso") || q.includes("drywall") || q.includes("yeso")) {
        advisorAnswer = `Para cielos rasos y placas de drywall o yeso, la clave está en el **acabado mate**:
1. Usa **Viniltex Techos o Viniltex Antirreflejo Blanco**: al ser completamente mate, disimula imperfecciones, uniones de cinta y masilla que la luz rasante suele evidenciar.
2. Si el cielo raso es de baño o cocina con vapor, aplica **Aquaprotec Baños y Cocinas**, que cuenta con fungicida activo contra el moho negro por condensación.
3. Se recomienda aplicar primero en los bordes con brocha y luego rodillar en una sola dirección con rodillo de felpa corta (3/8").`;
      } else if (q.includes("precio") || q.includes("cuesta") || q.includes("valor") || q.includes("cuanto vale") || q.includes("cuánto vale") || q.includes("cuñete") || q.includes("galon") || q.includes("galón")) {
        advisorAnswer = `Los precios de referencia oficiales en ColorLink Pintuco son:
• **Galón (3.785 L):** Rinde entre 20 y 28 m² a 2 manos. Precios desde $67.900 (Viniltex) hasta $89.900 (Koraza Doble Vida).
• **Cuñete (5 galones = 18.9 L):** Es la presentación más económica para obras medianas y grandes, con un **ahorro de más del 15% por galón** (desde $295.000 a $389.900).
En el Paso 3 del cotizador puedes ver el desglose exacto de materiales y mano de obra para los ${areaM2 || 45} m² de tu espacio.`;
      } else if (q.includes("lluv") || q.includes("humed") || q.includes("clima") || q.includes("mojad") || q.includes("filtr")) {
        advisorAnswer = `¡Cuidado con el clima y la humedad! 
• **Si va a llover o hay humedad alta (>85%):** No pintes exteriores. La película de pintura acrílica necesita al menos 3 a 4 horas libres de lluvia para secar adecuadamente y anclarse.
• **Si la pared ya tiene humedad:** Primero debes identificar el origen (filtración de tubería, freático o cubierta). Raspa la pintura dañada, deja secar el muro y aplica **Sellomax Antihumedad** antes del color de acabado.`;
      } else if (q.includes("mano") || q.includes("capa") || q.includes("cuantas") || q.includes("cuántas")) {
        advisorAnswer = `Para cualquier línea arquitectónica de Pintuco siempre se deben aplicar **2 manos cruzadas**:
• La 1ra mano sella el sustrato y crea el puente de adherencia.
• La 2da mano proporciona la resistencia lavable, la homogeneidad del tono y el espesor de garantía.
Deja secar entre 2 y 3 horas entre la primera y la segunda mano para obtener el acabado perfecto.`;
      } else if (q.includes("secad") || q.includes("secar") || q.includes("hora") || q.includes("tiempo")) {
        advisorAnswer = `Tiempos de secado con productos base agua Pintuco a temperatura ambiente (20°C - 25°C):
• **Secado al tacto:** 30 a 45 minutos.
• **Segunda mano (repintado):** 2 a 3 horas.
• **Lavabilidad y curado total:** 7 a 14 días. Durante la primera semana no limpies la pared con esponjas ni detergentes fuertes.`;
      } else if (q.includes("herramienta") || q.includes("rodillo") || q.includes("brocha") || q.includes("aplicar")) {
        advisorAnswer = `Herramientas recomendadas según tu espacio:
• **Paredes lisas o estucadas:** Rodillo de microfibra o felpa corta de 3/8" (no salpica y deja textura lisa).
• **Fachadas o superficies rústicas:** Rodillo de lana o felpa larga de 3/4" para penetrar los poros del revoque.
• **Bordes y esquinas:** Brocha de cerda sintética en ángulo de 2" o 2.5".
• **Bandeja plástica:** Para escurrir el exceso y evitar gotas indeseadas.`;
      } else if (q.includes("lija") || q.includes("prepar") || q.includes("estuco") || q.includes("limpi")) {
        advisorAnswer = `El protocolo de preparación Pintuco para un acabado profesional:
1. **Limpieza:** Elimina polvo y grasa con agua y jabón suave.
2. **Lijado:** Si la pared tenía pintura brillante, lija con grano 180 o 220 para abrir poro.
3. **Resanes:** Tapa huecos y fisuras con Estuco Acrílico Pintuco.
4. **Sellado:** Si la masilla o estuco es nuevo, aplica 1 mano de sellador para que la pintura no se absorba de forma dispareja.`;
      } else if (q.includes("garantia") || q.includes("garantía") || q.includes("poliza") || q.includes("póliza")) {
        advisorAnswer = `Nuestra **Garantía Pintuco 360** te otorga entre 3 y 7 años de respaldo oficial según la línea seleccionada (ej. Koraza 7 años, Viniltex 5 años).
Cubre:
• Calidad fisicoquímica (no descascaramiento ni caleo prematuro).
• Solidez de pigmento contra decoloración por luz UV.
• Certificación de aplicación si eliges uno de nuestros maestros certificados en el Paso 5.`;
      } else if (q.includes("olor") || q.includes("ecol") || q.includes("voc") || q.includes("toxic")) {
        advisorAnswer = `Tanto **Viniltex Avanzada** como **Koraza** están formuladas con **Cero VOC y Bajo Olor**. Esto significa que puedes pintar espacios habitados (como dormitorios, salas de bebés o consultorios) sin generar olores molestos ni vapores tóxicos, permitiendo ocupar la habitación el mismo día.`;
      } else {
        // Respuesta técnica directa contextualizada a la consulta
        advisorAnswer = `Respecto a "${trimmedQuestion}": 
En Pintuco recomendamos verificar primero que la superficie esté completamente seca y libre de grasitud o polvo. Para el área de ${areaM2 || 45} m² que estás cotizando, el sistema formulado garantiza una adherencia superior y resistencia al lavado. 

Si requieres una evaluación técnica presencial en tu obra o asesoría para un caso muy específico, nuestro equipo de ingenieros está disponible en la línea gratuita nacional **01 8000 111 404** o mediante nuestro chat de WhatsApp. ¿Deseas que te oriente sobre algún paso de la preparación o aplicación?`;
      }
    }

    return res.json({
      success: true,
      answer: advisorAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  } catch (error) {
    console.error("Advisor chat error:", error);
    res.status(500).json({
      success: false,
      error: "Error procesando la consulta con la asesora virtual",
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
