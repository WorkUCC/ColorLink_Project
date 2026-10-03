import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Phone,
  ChevronDown,
  Layers,
  Paintbrush,
  Clock,
  Droplets,
  AlertCircle,
  ThumbsUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  ProjectNeedState,
  TechnicalRecommendation,
  UserProfile,
  SurfaceId,
  ProblemId,
} from "../types";
import { SURFACE_OPTIONS, PROBLEM_OPTIONS } from "../data/pintucoData";

interface VirtualAdvisorProps {
  currentStep: number;
  projectNeed: ProjectNeedState;
  recommendation: TechnicalRecommendation | null;
  user: UserProfile | null;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "advisor" | "user";
  text: string;
  timestamp: string;
  badge?: string;
  options?: string[];
}

const AVATAR_IMG = "/src/assets/images/asesor_avatar_1791011367910.jpg";

export const VirtualAdvisor: React.FC<VirtualAdvisorProps> = ({
  currentStep,
  projectNeed,
  recommendation,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadTip, setHasUnreadTip] = useState(true);
  const [userQuestion, setUserQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Verificación de compatibilidad con APIs nativas del navegador (Web Speech API)
  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const hasSpeechSynthesis =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Limpieza de formato markdown para que la síntesis de voz suene natural
  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[\*\•\-]\s*/gm, "")
      .replace(/💡|👉|⭐|✅|🛡️|⚠️/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#+\s/g, "")
      .replace(/\n+/g, ". ")
      .trim();
  };

  // Carga previa de voces del sistema para navegadores Chromium
  useEffect(() => {
    if (hasSpeechSynthesis) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [hasSpeechSynthesis]);

  // Cancelar voz y dictado al cerrar el widget
  useEffect(() => {
    if (!isOpen) {
      if (hasSpeechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        setIsListening(false);
      }
    }
  }, [isOpen, hasSpeechSynthesis]);

  // Función para reproducir en voz alta la respuesta de Sofía
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !hasSpeechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "es-CO";
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice =
        voices.find((v) => v.lang === "es-CO" || v.lang === "es_CO") ||
        voices.find((v) => v.lang.startsWith("es-")) ||
        voices.find((v) => v.lang.startsWith("es"));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("[Sofía Voice TTS] Notificación de audio:", e.error);
        }
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[Sofía Voice TTS] Fallback:", err);
      setIsSpeaking(false);
    }
  };

  // Alternar dictado por voz (Speech-to-Text nativo)
  const toggleListening = () => {
    if (!hasSpeechRecognition) return;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    // Detener la voz de Sofía si estaba hablando
    if (hasSpeechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      const recognition = new SpeechRecognitionClass();
      recognition.lang = "es-CO";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        if (transcript.trim()) {
          setUserQuestion(transcript);
          // Envío automático inmediato para una experiencia de conversación fluida
          sendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.warn("[Sofía Voice STT] Notificación de micrófono:", event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("[Sofía Voice STT] Error al iniciar reconocimiento:", err);
      setIsListening(false);
    }
  };

  // Alternar silencio de voz de Sofía
  const toggleVoiceOutput = () => {
    setIsVoiceEnabled((prev) => {
      const next = !prev;
      if (!next && hasSpeechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  };

  // Obtener contexto de la superficie actual
  const currentSurfaceObj = SURFACE_OPTIONS.find((s) => s.id === projectNeed.surface);
  const currentProblemObj = PROBLEM_OPTIONS.find((p) => p.id === projectNeed.problem);

  // Mensaje contextual dinámico según el paso y elecciones del usuario
  const getContextualTip = (): { title: string; tip: string; highlight: string } => {
    switch (currentStep) {
      case 1:
        return {
          title: "Acceso y Perfil de Obra",
          tip: user
            ? `¡Hola ${user.name.split(" ")[0]}! Tienes activada tu tarifa con 15% de descuento cliente.`
            : "¡Hola! Soy Sofía, tu asesora técnica Pintuco. Puedes formular tu obra como invitado o iniciar sesión para acceder a precios preferenciales.",
          highlight: "Canal oficial Pintuco",
        };
      case 2:
        if (projectNeed.surface === "fachadas_exteriores") {
          return {
            title: "Recomendación para Fachadas",
            tip: "En exteriores, la intemperie y los rayos UV son el mayor reto. Te recomendaré Koraza con polímeros elastoméricos que repelen agua y no se decoloran.",
            highlight: "Protección UV 5+ años",
          };
        }
        if (projectNeed.surface === "banos_cocinas" || projectNeed.problem === "humedad_filtraciones") {
          return {
            title: "Prevención de Humedad",
            tip: "Detecto reto por humedad. El secreto es sellar con un fondo antihumedad antes del acabado con Viniltex Baños & Cocinas para evitar hongos.",
            highlight: "Fórmula Fungicida Activa",
          };
        }
        if (projectNeed.surface === "madera_decks") {
          return {
            title: "Tratamiento de Maderas",
            tip: "Para decks y muebles expuestos, Maderprotect penetra el poro sin cuartearse, protegiendo contra xilófagos y humedad.",
            highlight: "Filtro Solar para Madera",
          };
        }
        if (projectNeed.surface === "metales_estructuras") {
          return {
            title: "Protección Anticorrosiva",
            tip: "Con Pintulux 3 en 1 no requieres anticorrosivo previo ni thinner costoso. Neutraliza el óxido y deja acabado brillante.",
            highlight: "Acción Directa al Metal",
          };
        }
        return {
          title: "Paredes Interiores Impecables",
          tip: `Para ${currentSurfaceObj?.title || "paredes"}, te sugiero acabado lavable de alta resistencia. ¿Tienes dudas sobre el cálculo de metros cuadrados?`,
          highlight: "Rendimiento Certificado",
        };
      case 3:
        return {
          title: "Solución Técnica Formulada",
          tip: recommendation
            ? `Hemos formulado ${recommendation.productName} a 2 manos para ${projectNeed.areaM2} m². Incluye especificación de sellado y secado.`
            : "Formulando el sistema técnico exacto con la resina recomendada...",
          highlight: "Norma Técnica Colombiana",
        };
      case 4:
        return {
          title: "Disponibilidad de Inventario",
          tip: "Comprobamos el inventario en tiempo real en las tiendas Pintacasa Pintuco más cercanas con opción de retiro o despacho.",
          highlight: "Lote verificado de fábrica",
        };
      case 5:
        return {
          title: "Seguimiento y Cuadrilla",
          tip: "En este paso puedes rastrear la ruta en vivo del móvil logístico en el mapa de Leaflet y coordinar con el maestro certificado.",
          highlight: "Ruta en Vivo",
        };
      case 6:
        return {
          title: "Póliza de Garantía 360",
          tip: "Tu certificación Pintuco 360 respalda la adherencia, estabilidad de color y durabilidad durante los años garantizados.",
          highlight: "Garantía Total",
        };
      default:
        return {
          title: "Asesoría Técnica Pintuco",
          tip: "Estoy aquí para resolver cualquier duda sobre rendimiento, preparación de superficie o colores.",
          highlight: "En línea",
        };
    }
  };

  const currentTip = getContextualTip();

  // Historial de mensajes
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "advisor",
      text: "¡Hola! Soy Sofía, ingeniera técnica de Pintuco. Estoy aquí para acompañarte paso a paso: desde elegir la resina ideal hasta calcular tus galones y coordinar el maestro certificado.",
      timestamp: "Ahora",
      badge: "Asesora Oficial Pintuco",
      options: [
        "¿Cuántas manos debo aplicar?",
        "¿Cómo preparar la superficie?",
        "¿Cuál es el tiempo de secado?",
        "¿Cómo funciona la garantía?",
      ],
    },
  ]);

  // Actualizar tip cuando cambie el paso
  useEffect(() => {
    setHasUnreadTip(true);
  }, [currentStep, projectNeed.surface, projectNeed.problem]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Preguntas rápidas
  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  // Generador de respuestas técnicas instantáneas de Pintuco
  const generateTechnicalResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("mano") || q.includes("capa") || q.includes("cuantas")) {
      return `Para garantizar la cobertura, opacidad y durabilidad oficial de Pintuco, siempre recomendamos **2 manos cruzadas**. 
• La primera mano sella la porosidad del sustrato.
• La segunda mano nivela la película y desarrolla el color final con toda su resistencia.
Para ${currentSurfaceObj?.title || "tu superficie"} de ${projectNeed.areaM2} m², los galones calculados en tu diagnóstico ya cubren ambas manos con holgura del 10%.`;
    }

    if (q.includes("preparar") || q.includes("limpiar") || q.includes("antes")) {
      return `La preparación representa el 80% del éxito en pintura:
1. **Limpieza:** Retira polvo, grasa o partículas sueltas con trapo húmedo.
2. **Lijado suave:** Si la pared anterior tenía brillo, pasa una lija grano 180 para crear anclaje.
3. **Imprimación:** Si hay absorción irregular o masilla fresca, aplica una mano de *Sellomax Pintuco* antes del color final.`;
    }

    if (q.includes("secar") || q.includes("secado") || q.includes("tiempo") || q.includes("hora")) {
      return `Tiempos de secado estándar para líneas base agua Pintuco (25°C y 60% humedad):
• **Al tacto:** 30 a 45 minutos.
• **Segunda mano (repintado):** 2 a 3 horas.
• **Curado total y lavabilidad:** 7 a 14 días (durante esta semana no se debe frotar con químicos abrasivos).`;
    }

    if (q.includes("dilu") || q.includes("agua") || q.includes("thinner") || q.includes("disolv") || q.includes("mezcl")) {
      return `Para las pinturas vinílicas de Pintuco (como Viniltex y Koraza), la dilución recomendada es con **agua potable limpia**:
• Para brocha o rodillo: diluye máximo un **10% a 15% de agua** (aprox. 1 vaso de agua por galón).
• Para pistola o Airless: hasta un **20% de agua**.
⚠️ No diluyas en exceso para no perder poder cubriente ni lavabilidad. En esmaltes como Pintulux 3 en 1 se aplica directo o con Thinner Pintuco si usas soplete.`;
    }

    if (q.includes("cielo") || q.includes("techo") || q.includes("raso") || q.includes("drywall") || q.includes("yeso")) {
      return `Para cielos rasos y placas de drywall:
1. Usa pintura de **acabado mate absoluto** (como Viniltex Antirreflejo o Viniltex Techos) para no evidenciar empates de masilla ni cinta con la luz.
2. Si es en baño o cocina con vapor constante, aplica **Aquaprotec Baños y Cocinas** con fungicida activo.
3. Aplica primero con brocha en las molduras y luego rodilla en una sola dirección con rodillo de felpa corta (3/8").`;
    }

    if (q.includes("precio") || q.includes("cuesta") || q.includes("valor") || q.includes("cuánto") || q.includes("cuanto") || q.includes("cuñete") || q.includes("galon") || q.includes("galón")) {
      return `Formatos oficiales y rendimiento Pintuco:
• **Galón (3.785 L):** Rinde de 20 a 28 m² a 2 manos. Rango desde $67.900 (Viniltex) hasta $89.900 (Koraza Doble Vida).
• **Cuñete (5 galones = 18.9 L):** Ofrece un **ahorro de más del 15%** por galón (desde $295.000 hasta $389.900).
En el Paso 3 de tu cotización tienes el desglose exacto de cuántos cuñetes o galones necesitas para tus ${projectNeed.areaM2} m².`;
    }

    if (q.includes("lluv") || q.includes("clima") || q.includes("sol") || q.includes("viento")) {
      return `En exteriores, el clima es determinante:
• **Nunca pintes con amenaza de lluvia o humedad relativa superior a 85%**. La pintura acrílica requiere al menos 3 a 4 horas de sol o ventilación para anclarse antes de recibir agua.
• Evita pintar bajo sol directo de mediodía porque el secado acelerado puede dejar marcas de rodillo; la mejor hora es en la mañana o media tarde.`;
    }

    if (q.includes("herramienta") || q.includes("rodillo") || q.includes("brocha")) {
      return `Herramientas recomendadas por Pintuco:
• **Paredes lisas y drywall:** Rodillo de microfibra de 3/8" (no salpica y no deja piel de naranja).
• **Fachadas o revoque rústico:** Rodillo de lana larga de 3/4" para penetrar los poros.
• **Recortes y esquinas:** Brocha sintética de 2" o 2.5" en ángulo.`;
    }

    if (q.includes("mano") || q.includes("capa") || q.includes("cuantas") || q.includes("cuántas")) {
      return `Para garantizar la cobertura, opacidad y durabilidad oficial de Pintuco, siempre recomendamos **2 manos cruzadas**. 
• La primera mano sella la porosidad del sustrato.
• La segunda mano nivela la película y desarrolla el color final con toda su resistencia lavable.
Para ${currentSurfaceObj?.title || "tu superficie"} de ${projectNeed.areaM2} m², los galones calculados en tu diagnóstico ya cubren ambas manos con holgura del 10%.`;
    }

    if (q.includes("preparar") || q.includes("limpiar") || q.includes("antes") || q.includes("lija") || q.includes("estuco")) {
      return `La preparación representa el 80% del éxito en pintura:
1. **Limpieza:** Retira polvo, grasa o partículas sueltas con trapo húmedo.
2. **Lijado suave:** Si la pared anterior tenía brillo, pasa una lija grano 180 para crear anclaje.
3. **Imprimación:** Si hay absorción irregular o masilla fresca, aplica una mano de *Sellomax Pintuco* antes del color final.`;
    }

    if (q.includes("secar") || q.includes("secado") || q.includes("tiempo") || q.includes("hora")) {
      return `Tiempos de secado estándar para líneas base agua Pintuco (25°C y 60% humedad):
• **Al tacto:** 30 a 45 minutos.
• **Segunda mano (repintado):** 2 a 3 horas.
• **Curado total y lavabilidad:** 7 a 14 días (durante esta semana no se debe frotar con químicos abrasivos).`;
    }

    if (q.includes("garantia") || q.includes("garantía") || q.includes("poliza")) {
      return `La Póliza Pintuco 360 cubre tanto la calidad fisicoquímica de la pintura formulada como la técnica de aplicación cuando la realiza un maestro certificado de nuestra red.
Incluye certificado digital de autenticidad, garantía de no descascaramiento y estabilidad del pigmento de 3 a 7 años según la línea elegida.`;
    }

    if (q.includes("humed") || q.includes("hongo") || q.includes("moho") || q.includes("agua")) {
      return `¡Atención con la humedad! Nunca apliques pintura directamente sobre una pared húmeda.
1. Elimina el moho lavando con una solución de hipoclorito de sodio al 10% y agua, dejando secar por completo.
2. Aplica *Aquaprotec o Sellador Antihumedad Pintuco* para bloquear la capilaridad.
3. Termina con *Viniltex Baños y Cocinas* que posee fungicida activo de larga duración.`;
    }

    if (q.includes("color") || q.includes("tono") || q.includes("muestra")) {
      return `Todos los tonos seleccionados en ColorLink se preparan mediante el sistema tintométrico computarizado de Pintuco en planta. Esto asegura que el código seleccionado (${projectNeed.selectedColor.code} - ${projectNeed.selectedColor.name}) sea 100% fiel al simulador arquitectónico.`;
    }

    return `Para tu consulta sobre "${query}":
En especificación Pintuco recomendamos verificar que la base esté completamente curada, limpia y seca. Si requieres orientación específica sobre tu obra, puedes consultarme por dilución, herramientas, tiempos de secado, o contactar a nuestra Línea Técnica Gratuita: **01 8000 111 404**.`;
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: "Ahora",
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserQuestion("");
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          surface: currentSurfaceObj?.title || projectNeed.surface,
          problem: currentProblemObj?.title || projectNeed.problem,
          areaM2: projectNeed.areaM2,
          selectedColor: projectNeed.selectedColor,
          currentStep,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.answer) {
          const advisorMsg: ChatMessage = {
            id: `advisor-${Date.now()}`,
            sender: "advisor",
            text: data.answer,
            timestamp: data.timestamp || "Ahora",
            badge: "Ingeniera Técnica Pintuco",
          };
          setMessages((prev) => [...prev, advisorMsg]);
          setIsTyping(false);
          speakText(data.answer);
          return;
        }
      }
    } catch (err) {
      console.warn("[Sofía Advisor Client] Fallback técnico:", err);
    }

    // Fallback técnico local inteligente
    const responseText = generateTechnicalResponse(textToSend);
    const advisorMsg: ChatMessage = {
      id: `advisor-${Date.now()}`,
      sender: "advisor",
      text: responseText,
      timestamp: "Ahora",
      badge: "Respuesta Técnica Oficial",
    };
    setMessages((prev) => [...prev, advisorMsg]);
    setIsTyping(false);
    speakText(responseText);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("• ") || line.trim().startsWith("- ");
      const cleanLine = isBullet ? line.trim().replace(/^[\*\•\-]\s*/, "") : line;
      const cleanParts = cleanLine.split(/(\*\*.*?\*\*)/g);

      return (
        <div key={idx} className={isBullet ? "flex items-start gap-1.5 pl-1 my-0.5" : "my-0.5"}>
          {isBullet && <span className="text-[#E2622F] font-bold shrink-0">•</span>}
          <span>
            {cleanParts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-bold text-[#1A1715]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </span>
        </div>
      );
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(userQuestion);
  };

  return (
    <>
      {/* Botón Flotante con Avatar y Burbuja de Consejo (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {/* Burbuja informativa si está minimizado */}
        {!isOpen && hasUnreadTip && (
          <div
            onClick={() => {
              setIsOpen(true);
              setHasUnreadTip(false);
            }}
            className="mb-2 max-w-[280px] sm:max-w-xs bg-[#FBF7F0] text-[#2B211C] p-3 rounded-2xl shadow-xl border border-[#E8DFD5] cursor-pointer animate-fadeIn hover:border-[#E2622F] transition flex items-start gap-2.5 group"
          >
            <div className="w-2 h-2 rounded-full bg-[#E2622F] mt-1.5 shrink-0 animate-ping" />
            <div className="text-xs">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-bold text-[#1A1715] text-[11px]">
                  Sofía · Asesora Pintuco
                </span>
                <span className="text-[10px] text-[#E2622F] font-bold bg-[#F5EFE6] px-1.5 py-0.5 rounded border border-[#E8DFD5]">
                  {currentTip.highlight}
                </span>
              </div>
              <p className="text-[#7A6A5D] line-clamp-2 leading-relaxed">
                {currentTip.tip}
              </p>
              <span className="text-[10px] text-[#E2622F] font-bold group-hover:underline block mt-1">
                Toca para consultar o preguntar →
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadTip(false);
              }}
              className="text-stone-400 hover:text-stone-600 p-0.5 -mr-1 -mt-1 cursor-pointer"
              title="Ocultar consejo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Botón Principal del Avatar */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnreadTip(false);
          }}
          className={`group flex items-center gap-3 p-2 pr-4 rounded-full shadow-xl transition-all duration-300 cursor-pointer border ${
            isOpen
              ? "bg-[#1A1715] text-[#FBF7F0] border-white/20 shadow-md"
              : "bg-gradient-to-br from-[#E2622F] to-[#F2A93C] text-white border-transparent hover:shadow-2xl hover:scale-102"
          }`}
          aria-label="Abrir asesor técnico virtual Sofía"
          id="btn-virtual-advisor"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#E2622F] shadow-sm shrink-0">
            <img
              src={AVATAR_IMG}
              alt="Sofía, Asesora Técnica Pintuco"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            {/* Punto verde en vivo */}
            <span
              className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
              title="Asesora en línea"
            />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold leading-tight">Sofía</span>
              <span className="text-[10px] text-[#E2622F] font-semibold bg-[#E2622F]/10 px-1 rounded">
                Asesora 360
              </span>
            </div>
            <span className="text-[10px] text-[#7A6A5D] block leading-tight">
              {isOpen ? "Cerrar asistente" : "¿Dudas técnicas? Clic aquí"}
            </span>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-white/10 text-white" : "bg-[#E2622F] text-white"
            }`}
          >
            {isOpen ? <X className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>

      {/* Ventana de Asesoría Interactiva (Panel Flotante) */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 w-[92vw] sm:w-[390px] max-h-[82vh] bg-[#FBF7F0] rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col animate-scaleUp"
          role="dialog"
          aria-label="Asesoría Técnica Pintuco con Sofía"
        >
          {/* Header del Panel */}
          <div className="bg-[#1A1715] text-[#FBF7F0] p-4 flex items-center justify-between border-b border-[#2B211C]">
            <div className="flex items-center gap-3">
              <div
                className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                  isSpeaking
                    ? "border-emerald-400 ring-4 ring-emerald-400/40 shadow-lg scale-105"
                    : "border-[#E2622F]"
                }`}
              >
                <img
                  src={AVATAR_IMG}
                  alt="Sofía - Asesora Técnica Pintuco"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1A1715] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#FBF7F0]">Sofía</h3>
                  <span className="text-[10px] font-semibold bg-[#E2622F] text-white px-1.5 py-0.2 rounded">
                    Ingeniera Pintuco
                  </span>

                  {/* Indicador visual cuando Sofía está hablando en voz alta */}
                  {isSpeaking && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 animate-pulse">
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <span className="text-[9px] uppercase tracking-wide">Hablando</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#CDBEAF]">
                  {isSpeaking ? "Respondiendo por voz en vivo..." : "Asistencia técnica oficial en tiempo real"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Botón Silenciar / Activar Voz de Sofía (SpeechSynthesis nativo) */}
              {hasSpeechSynthesis && (
                <button
                  type="button"
                  onClick={toggleVoiceOutput}
                  className={`p-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 border ${
                    isVoiceEnabled
                      ? "bg-white/15 hover:bg-white/25 text-[#FBF7F0] border-white/20"
                      : "bg-white/5 hover:bg-white/10 text-stone-400 border-white/10"
                  }`}
                  title={
                    isVoiceEnabled
                      ? "Silenciar voz de Sofía (modo solo texto)"
                      : "Activar voz de Sofía (lectura en voz alta)"
                  }
                  aria-label={isVoiceEnabled ? "Silenciar voz" : "Activar voz"}
                >
                  {isVoiceEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400" />
                  )}
                  <span className="text-[10px] hidden sm:inline">
                    {isVoiceEnabled ? "Voz activa" : "Silenciada"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner de contexto actual */}
          <div className="bg-[#F5EFE6] px-3.5 py-2 border-b border-[#E8DFD5] flex items-center justify-between text-xs text-[#2B211C]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E2622F]" />
              <span className="font-semibold text-[#1A1715]">Contexto:</span>
              <span className="text-[#7A6A5D] truncate max-w-[190px]">
                {currentSurfaceObj?.title || "Superficie"} · Paso {currentStep} de 6
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#E2622F] bg-white px-2 py-0.5 rounded border border-[#E8DFD5]">
              {currentTip.highlight}
            </span>
          </div>

          {/* Área de mensajes con scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF6F0] text-xs max-h-[380px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {m.sender === "advisor" && (
                  <span className="text-[10px] font-bold text-[#7A6A5D] mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#6B7C59]" /> Sofía (Pintuco)
                  </span>
                )}

                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#E2622F] text-white rounded-br-none shadow-xs whitespace-pre-line"
                      : "bg-white text-[#2B211C] border border-[#E8DFD5] rounded-bl-none shadow-xs"
                  }`}
                >
                  {m.sender === "user" ? m.text : renderFormattedText(m.text)}
                </div>

                {/* Preguntas rápidas si el mensaje las incluye */}
                {m.options && m.options.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickQuestion(opt)}
                        className="text-[11px] bg-white hover:bg-[#F5EFE6] border border-[#E8DFD5] hover:border-[#E2622F] text-[#1A1715] font-medium px-2.5 py-1.5 rounded-lg transition shadow-2xs text-left cursor-pointer"
                      >
                        💡 {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-[#7A6A5D] text-xs italic bg-white p-2.5 rounded-xl border border-[#E8DFD5] w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#E2622F] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#E2622F] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#E2622F] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Sofía está escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de entrada de texto con dictado por voz */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-white border-t border-[#E8DFD5] flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder={
                  isListening
                    ? "Escuchando tu voz... habla ahora"
                    : "Pregunta técnica o pulsa el micrófono..."
                }
                className={`w-full bg-[#FBF7F0] hover:bg-white focus:bg-white text-xs text-[#2B211C] pl-3.5 ${
                  hasSpeechRecognition ? "pr-10" : "pr-3.5"
                } py-2.5 rounded-xl border transition ${
                  isListening
                    ? "border-red-500 ring-2 ring-red-400/30 bg-red-50/40 placeholder-red-600 font-medium"
                    : "border-[#E8DFD5] focus:border-[#E2622F] focus:ring-1 focus:ring-[#E2622F] focus:outline-hidden"
                }`}
              />

              {/* Botón de Micrófono nativo (Speech-to-Text) */}
              {hasSpeechRecognition && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-1.5 p-1.5 rounded-lg transition-all cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white shadow-md animate-pulse ring-2 ring-red-300"
                      : "text-[#7A6A5D] hover:text-[#E2622F] hover:bg-[#F5EFE6]"
                  }`}
                  title={
                    isListening
                      ? "Detener dictado por voz"
                      : "Hablar con Sofía (Dictado por voz nativo)"
                  }
                  aria-label={isListening ? "Detener dictado" : "Activar dictado por voz"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!userQuestion.trim() || isTyping}
              className="bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 disabled:opacity-40 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-sm active:scale-95"
              aria-label="Enviar pregunta"
              title="Enviar pregunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Pie de contacto directo con humanos */}
          <div className="bg-[#F5EFE6] px-3.5 py-2 flex items-center justify-between text-[11px] text-[#7A6A5D] border-t border-[#E8DFD5]">
            <span className="text-[10px]">¿Prefieres llamada técnica?</span>
            <a
              href="tel:018000111404"
              className="font-bold text-[#1A1715] hover:text-[#E2622F] inline-flex items-center gap-1 transition"
            >
              <Phone className="w-3 h-3 text-[#E2622F]" />
              <span>01 8000 111 404 (Gratis)</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
