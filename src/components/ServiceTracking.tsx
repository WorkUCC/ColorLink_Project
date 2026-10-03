import React, { useState, useEffect, useMemo } from "react";
import {
  Paintbrush,
  ShieldCheck,
  Star,
  UserCheck,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  Award,
  PackageCheck,
} from "lucide-react";
import {
  TechnicalRecommendation,
  ProjectNeedState,
  OrderState,
  CertifiedPainter,
  ServiceOption,
  PaymentMethod,
  OrderTrackingStep,
} from "../types";
import { CERTIFIED_PAINTERS } from "../data/pintucoData";
import { obtenerTiendas, TiendaDB, TIENDAS_FALLBACK } from "../lib/colorlinkApi";
import { geocodeAddress, GeocodeResult } from "../lib/geocodingService";
import { TrackingMapLeaflet } from "./TrackingMapLeaflet";

interface ServiceTrackingProps {
  recommendation: TechnicalRecommendation;
  projectNeed: ProjectNeedState;
  orderState: OrderState;
  onUpdateOrder: (updated: Partial<OrderState>) => void;
  onProceedToQuality: () => void;
  onBackToSupply: () => void;
}

export const ServiceTracking: React.FC<ServiceTrackingProps> = ({
  recommendation,
  projectNeed,
  orderState,
  onUpdateOrder,
  onProceedToQuality,
  onBackToSupply,
}) => {
  const [serviceOption, setServiceOption] = useState<ServiceOption>(orderState.serviceOption || "con_aplicador");
  const [selectedPainter, setSelectedPainter] = useState<CertifiedPainter>(
    orderState.selectedPainter || CERTIFIED_PAINTERS[0]
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    orderState.scheduledDate || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>(orderState.scheduledTime || "08:30 AM");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(orderState.paymentMethod || "pse");
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(
    orderState.currentStepIndex > 0 || orderState.trackingStep !== "confirmado"
  );
  const [autoSimulating, setAutoSimulating] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "painter" | "user"; text: string; time: string }[]>([
    {
      sender: "painter",
      text: `¡Hola! Soy ${selectedPainter.name}, maestro certificado Pintuco. Tengo lista la orden de ${recommendation.productName} y estaré puntual en tu dirección.`,
      time: "08:30 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const [tiendas, setTiendas] = useState<TiendaDB[]>(TIENDAS_FALLBACK);
  const [ubicacionCliente, setUbicacionCliente] = useState<GeocodeResult>({
    lat: 4.6782,
    lng: -74.0583,
    source: "city_fallback",
  });

  // Cargar tiendas con latitud/longitud de la BD (con fallback local)
  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      try {
        const datos = await obtenerTiendas();
        if (!cancelado && datos.length > 0) {
          setTiendas(datos);
        }
      } catch (e) {
        console.warn("[ServiceTracking] Usando tiendas locales:", e);
      }
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  // Geocodificar la dirección del cliente usando Nominatim
  useEffect(() => {
    let cancelado = false;
    async function geocodificar() {
      const res = await geocodeAddress(projectNeed.address, projectNeed.city);
      if (!cancelado) {
        setUbicacionCliente(res);
      }
    }
    geocodificar();
    return () => {
      cancelado = true;
    };
  }, [projectNeed.address, projectNeed.city]);

  // Tienda asignada según la selección previa o ciudad del proyecto
  const tiendaActiva: TiendaDB = useMemo(() => {
    if (orderState.storeName) {
      const match = tiendas.find((t) =>
        t.nombre.toLowerCase().includes(orderState.storeName!.toLowerCase())
      );
      if (match) return match;
    }
    const ciudadClean = projectNeed.city.split("(")[0].trim().toLowerCase();
    const matchCiudad = tiendas.find((t) =>
      t.ciudad.toLowerCase().includes(ciudadClean)
    );
    return matchCiudad || tiendas[0] || TIENDAS_FALLBACK[0];
  }, [tiendas, orderState.storeName, projectNeed.city]);

  const trackingSteps: { id: OrderTrackingStep; title: string; desc: string; icon: any }[] = [
    {
      id: "confirmado",
      title: "1. Orden confirmada",
      desc: "Pago y formulación aprobados por el sistema ColorLink.",
      icon: CheckCircle2,
    },
    {
      id: "tinturado_preparacion",
      title: "2. Tinturado en planta",
      desc: `Mezclando código de color ${projectNeed.selectedColor.code} en laboratorio Pintuco.`,
      icon: Paintbrush,
    },
    {
      id: "empacado",
      title: "3. Empacado y listo",
      desc: "Lote verificado, sellado y rotulado con especificaciones técnicas.",
      icon: PackageCheck,
    },
    {
      id: "en_camino",
      title: "4. En camino al sitio",
      desc: `Móvil logístico Pintuco y ${selectedPainter.name} en ruta hacia tu dirección.`,
      icon: Truck,
    },
    {
      id: "en_sitio_aplicacion",
      title: "5. En sitio y aplicación",
      desc: `Preparando superficie y aplicando 2 manos de ${recommendation.productName}.`,
      icon: ShieldCheck,
    },
    {
      id: "completado",
      title: "6. Servicio completado",
      desc: "Inspección de acabado final y activación de póliza de garantía 360.",
      icon: Award,
    },
  ];

  const foundStepIndex = trackingSteps.findIndex((s) => s.id === orderState.trackingStep);
  const currentStepIndex = foundStepIndex >= 0 ? foundStepIndex : 0;

  const handleConfirmOrder = () => {
    setIsOrderConfirmed(true);
    onUpdateOrder({
      serviceOption,
      selectedPainter: serviceOption === "con_aplicador" ? selectedPainter : undefined,
      scheduledDate,
      scheduledTime,
      paymentMethod,
      paymentStatus: "pagado",
      trackingStep: "confirmado",
      currentStepIndex: 0,
      driverEtaMinutes: 28,
    });
  };

  const handleNextStepSim = () => {
    const nextIdx = Math.min(trackingSteps.length - 1, currentStepIndex + 1);
    const nextStep = trackingSteps[nextIdx].id;
    onUpdateOrder({
      trackingStep: nextStep,
      currentStepIndex: nextIdx,
      driverEtaMinutes: Math.max(0, 28 - nextIdx * 7),
    });
    if (nextIdx === trackingSteps.length - 1) {
      setAutoSimulating(false);
    }
  };

  const handleResetSim = () => {
    onUpdateOrder({
      trackingStep: "confirmado",
      currentStepIndex: 0,
      driverEtaMinutes: 28,
    });
  };

  // Auto simulation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoSimulating && isOrderConfirmed) {
      timer = setTimeout(() => {
        if (currentStepIndex < trackingSteps.length - 1) {
          handleNextStepSim();
        } else {
          setAutoSimulating(false);
        }
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [autoSimulating, currentStepIndex, isOrderConfirmed]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const userMsg = { sender: "user" as const, text: newMessage, time: "Ahora" };
    setChatMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "painter",
          text: "¡Enterado! Tengo listos los plásticos de protección, lijas y el sellador para dejar todo impecable.",
          time: "Ahora",
        },
      ]);
    }, 1200);
  };

  const calculatedTotal =
    serviceOption === "con_aplicador"
      ? recommendation.pricing.totalEstimated
      : recommendation.pricing.productEstimatedTotal;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-[#E2622F]">
            Paso 5 de 6
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-500">
            {isOrderConfirmed ? "Monitoreo en tiempo real" : "Servicio y agendamiento"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2B211C]">
          {isOrderConfirmed ? "Seguimiento de orden y aplicación en vivo" : "Servicio de aplicación y agendamiento"}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {isOrderConfirmed
            ? "Monitorea la preparación en planta, el desplazamiento del maestro y el avance de la obra."
            : "Elige si deseas contratar un maestro pintor certificado o recibir solo los materiales."}
        </p>
      </div>

      {!isOrderConfirmed ? (
        /* Configuration Phase: Select Painter + Payment & Schedule */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Service & Painter Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* Service Toggle */}
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#2B211C]">
                Modalidad del servicio
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setServiceOption("con_aplicador")}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    serviceOption === "con_aplicador"
                      ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F] shadow-sm"
                      : "border-[#E8DFD5] hover:border-stone-300 bg-white"
                  }`}
                  id="opt-service-painter"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1A1715] text-white flex items-center justify-center">
                        <Paintbrush className="w-4 h-4 text-[#E2622F]" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Garantía completa
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#2B211C]">Pintura + Maestro certificado</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Un maestro avalado prepara la superficie, aplica las 2 manos y activa la póliza oficial Pintuco.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setServiceOption("solo_materiales")}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    serviceOption === "solo_materiales"
                      ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F] shadow-sm"
                      : "border-[#E8DFD5] hover:border-stone-300 bg-white"
                  }`}
                  id="opt-service-materials-only"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-[#1A1715]" />
                      </div>
                      <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        Solo producto
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#2B211C]">Solo materiales</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Recibes la pintura, sellador y accesorios para aplicar por tu cuenta o con tu propio personal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certified Painters Directory */}
            {serviceOption === "con_aplicador" && (
              <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#2B211C] text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#E2622F]" />
                      Maestros pintores certificados en {projectNeed.city}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Profesionales con antecedentes verificados, seguridad social (ARL) y certificación Pintuco.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {CERTIFIED_PAINTERS.map((painter) => {
                    const isSelected = selectedPainter.id === painter.id;
                    return (
                      <div
                        key={painter.id}
                        onClick={() => setSelectedPainter(painter)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col gap-3 ${
                          isSelected
                            ? "border-[#E2622F] bg-[#E2622F]/5 ring-1 ring-[#E2622F] shadow-sm"
                            : "border-[#E8DFD5] hover:border-stone-300 bg-white"
                        }`}
                        id={`painter-card-${painter.id}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={painter.photo}
                              alt={painter.name}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-200 shadow-sm shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-[#2B211C]">{painter.name}</h4>
                                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{painter.rating}</span>
                                  <span className="text-stone-400 font-normal">({painter.reviewsCount})</span>
                                </div>
                              </div>
                              <p className="text-xs text-stone-500">{painter.role}</p>

                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {painter.badges.map((b, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 text-right shrink-0">
                            <div>
                              <span className="text-[11px] text-stone-400 block">Disponibilidad</span>
                              <span className="text-xs font-semibold text-emerald-700 block">{painter.availableSlot}</span>
                            </div>
                            {isSelected ? (
                              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#E2622F]">
                                <CheckCircle2 className="w-4 h-4" /> Seleccionado
                              </div>
                            ) : (
                              <span className="mt-1 text-xs font-medium text-stone-500 hover:text-stone-800">
                                Elegir este maestro
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Portfolio Gallery */}
                        {painter.portfolioPhotos && painter.portfolioPhotos.length > 0 && (
                          <div className="pt-2 border-t border-stone-100">
                            <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                              Obras previas realizadas:
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              {painter.portfolioPhotos.map((imgUrl, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="relative rounded-lg overflow-hidden aspect-video border border-stone-200"
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Trabajo previo ${pIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Schedule Date & Time */}
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm space-y-4">
              <h3 className="font-bold text-[#2B211C] text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1A1715]" />
                Fecha y horario del servicio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Fecha de inicio</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8DFD5] text-sm focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Jornada</label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8DFD5] text-sm focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
                  >
                    <option value="08:00 AM">Mañana (8:00 AM - 12:00 PM)</option>
                    <option value="01:30 PM">Tarde (1:30 PM - 5:30 PM)</option>
                    <option value="Jornada Completa">Jornada continua</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8DFD5]">
              <h3 className="font-bold text-[#2B211C] text-sm pb-3 border-b border-stone-100">
                Resumen de orden
              </h3>

              <div className="py-3 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Producto:</span>
                  <span className="font-semibold text-stone-900 text-right">{recommendation.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cantidad ({projectNeed.areaM2} m²):</span>
                  <span className="font-semibold text-stone-900">{recommendation.calculation.recommendedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span className="font-semibold text-stone-900">{projectNeed.selectedColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modalidad:</span>
                  <span className="font-semibold text-stone-900">
                    {serviceOption === "con_aplicador" ? "Pintura + Maestro" : "Solo pintura"}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-bold text-stone-800 text-sm">Total final:</span>
                  <span className="text-xl font-bold text-[#1A1715]">
                    ${calculatedTotal.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Método de pago
                </label>
                {[
                  { id: "pse" as const, name: "PSE / Transferencia (Bancolombia, Nequi, Davivienda)" },
                  { id: "tarjeta_credito" as const, name: "Tarjeta de crédito o débito" },
                  { id: "contra_entrega" as const, name: "Pago contra entrega con datáfono" },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition ${
                      paymentMethod === pm.id
                        ? "border-[#E2622F] bg-[#E2622F]/5 text-[#1A1715] font-semibold"
                        : "border-[#E8DFD5] text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="accent-[#E2622F]"
                    />
                    <span>{pm.name}</span>
                  </label>
                ))}
              </div>

              {/* Confirm CTA */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full mt-5 bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition inline-flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-[0.98]"
                id="btn-confirm-order-service"
              >
                <span>Confirmar orden y ver tracking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToSupply}
              className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-900 inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a disponibilidad
            </button>
          </div>
        </div>
      ) : (
        /* Active Live Tracking Interface */
        <div className="space-y-6">
          {/* Tracking Control Simulation Bar */}
          <div className="bg-[#1A1715] text-white p-5 rounded-xl shadow-sm border border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E2622F] text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#E2622F]">
                    Orden #{orderState.orderId}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded">
                    En vivo
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Estado actual: {trackingSteps[currentStepIndex]?.title}
                </h3>
              </div>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextStepSim}
                disabled={currentStepIndex >= trackingSteps.length - 1}
                className="bg-[#E2622F] hover:bg-[#C95222] disabled:opacity-40 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
                id="btn-sim-next-step"
              >
                <span>Avanzar estado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setAutoSimulating(!autoSimulating)}
                className={`text-xs font-medium px-3 py-2 rounded-lg border transition inline-flex items-center gap-1 cursor-pointer ${
                  autoSimulating
                    ? "bg-amber-500 text-stone-950 border-amber-500 font-semibold"
                    : "bg-white/10 text-stone-200 border-white/10 hover:bg-white/20"
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{autoSimulating ? "Pausar avance" : "Avance auto"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetSim}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-xs border border-white/10 cursor-pointer"
                title="Reiniciar simulación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {trackingSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center p-3 rounded-lg transition ${
                      isCurrent
                        ? "bg-[#E2622F]/5 border border-[#E2622F]"
                        : isPassed
                        ? "bg-emerald-50 border border-emerald-200"
                        : "opacity-40 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${
                        isCurrent
                          ? "bg-[#E2622F] text-white"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <h4 className="text-xs font-bold text-[#2B211C] leading-tight">{step.title}</h4>
                    <p className="text-[10px] text-stone-500 mt-1 leading-snug hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map & Technician Dispatch Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Real Leaflet Map (OpenStreetMap) */}
            <div className="lg:col-span-7">
              <TrackingMapLeaflet
                tiendaAsignada={tiendaActiva}
                todasLasTiendas={tiendas}
                ubicacionCliente={ubicacionCliente}
                direccionTexto={projectNeed.address || "Dirección de obra"}
                ciudadTexto={projectNeed.city}
                tiempoRestanteMin={orderState.driverEtaMinutes}
                pasoActualIndex={currentStepIndex}
              />
            </div>

            {/* Assigned Painter Card & Live Chat */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-xs font-semibold text-stone-600">
                    Maestro aplicador asignado
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Certificación Pintuco
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedPainter.photo}
                    alt={selectedPainter.name}
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#2B211C]">{selectedPainter.name}</h4>
                    <p className="text-xs text-stone-500">{selectedPainter.role}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{selectedPainter.rating}</span>
                      <span className="text-stone-400 font-normal">({selectedPainter.completedJobs} obras)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${selectedPainter.phone}`}
                    className="border border-stone-300 hover:bg-stone-50 text-[#1A1715] font-medium py-2 px-3 rounded-lg text-xs transition inline-flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E2622F]" />
                    <span>Llamar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setChatOpen(!chatOpen)}
                    className="bg-[#1A1715] hover:bg-stone-800 text-white font-medium py-2 px-3 rounded-lg text-xs transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{chatOpen ? "Ocultar chat" : "Mensaje"}</span>
                  </button>
                </div>

                {chatOpen && (
                  <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2.5">
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            msg.sender === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg max-w-[85%] ${
                              msg.sender === "user"
                                ? "bg-[#1A1715] text-white"
                                : "bg-white text-stone-800 border border-stone-200 shadow-2xs"
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-stone-400 mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 p-2 text-xs rounded-lg border border-stone-300 bg-white text-[#2B211C]"
                      />
                      <button
                        type="submit"
                        className="bg-[#E2622F] hover:bg-[#C95222] text-white text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Ready for Warranty Next Step CTA */}
              <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#E2622F]" />
                  <h4 className="font-bold text-sm text-[#2B211C]">Póliza de garantía Pintuco 360</h4>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Al completar la aplicación y la entrega, se emite automáticamente el certificado digital oficial.
                </p>
                <button
                  type="button"
                  onClick={onProceedToQuality}
                  className="w-full bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-md transition inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  id="btn-proceed-quality"
                >
                  <span>Finalizar servicio y ver garantía</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
