import React, { useState, useEffect } from "react";
import {
  Paintbrush,
  ShieldCheck,
  Star,
  UserCheck,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
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
  FileCheck,
  Award,
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
      text: `¡Hola! Soy ${selectedPainter.name}, tu maestro aplicador certificado Pintuco. Ya recibí la orden técnica de ${recommendation.productName} y estaré puntual en tu dirección.`,
      time: "08:32 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const trackingSteps: { id: OrderTrackingStep; title: string; desc: string; icon: any }[] = [
    {
      id: "confirmado",
      title: "1. Orden Confirmada",
      desc: "Pago y formulación aprobados por el sistema ColorLink.",
      icon: CheckCircle2,
    },
    {
      id: "tinturado_preparacion",
      title: "2. Tinturado en Planta",
      desc: `Mezclando código de color ${projectNeed.selectedColor.code} en laboratorio Pintuco.`,
      icon: Paintbrush,
    },
    {
      id: "en_camino",
      title: "3. En Camino al Sitio",
      desc: `Móvil logístico Pintuco y ${selectedPainter.name} en ruta hacia tu dirección.`,
      icon: Truck,
    },
    {
      id: "en_sitio_aplicacion",
      title: "4. En Sitio / Aplicación",
      desc: `Preparando superficie y aplicando 2 manos de ${recommendation.productName}.`,
      icon: ShieldCheck,
    },
    {
      id: "completado",
      title: "5. Servicio Completado",
      desc: "Inspección de acabado final y activación de póliza de garantía 360.",
      icon: Award,
    },
  ];

  const currentStepIndex = trackingSteps.findIndex((s) => s.id === orderState.trackingStep);

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
          text: "¡Enterado! Tengo listos los plásticos de protección, lijas y el sellador antialcalino para dejar todo impecable.",
          time: "Ahora",
        },
      ]);
    }, 1200);
  };

  // Calculate final total based on service choice
  const calculatedTotal =
    serviceOption === "con_aplicador"
      ? recommendation.pricing.totalEstimated
      : recommendation.pricing.productEstimatedTotal;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider uppercase text-[#00A896]">
          Paso 5 de 6 • Servicio, Aplicación & Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {isOrderConfirmed ? "Seguimiento de tu Servicio en Tiempo Real" : "Servicio de Aplicación y Agendamiento"}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Inspirado en el modelo ServiceTitan + Uber: el cliente monitorea la preparación, llegada del aplicador y garantía desde una sola pantalla.
        </p>
      </div>

      {!isOrderConfirmed ? (
        /* Configuration Phase: Select Painter + Payment & Schedule */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Service & Painter Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* Service Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                ¿Deseas incluir la aplicación con un Maestro Certificado Pintuco?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setServiceOption("con_aplicador")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    serviceOption === "con_aplicador"
                      ? "border-[#002D62] bg-blue-50/60 shadow-sm ring-2 ring-[#002D62]/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  id="opt-service-painter"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#002D62] text-white flex items-center justify-center">
                      <Paintbrush className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Garantía Total 360
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Pintura + Aplicador Certificado</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Un maestro verificado por Pintuco prepara la superficie, aplica las 2 manos y activa la póliza oficial.
                  </p>
                </div>

                <div
                  onClick={() => setServiceOption("solo_materiales")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    serviceOption === "solo_materiales"
                      ? "border-[#002D62] bg-blue-50/60 shadow-sm ring-2 ring-[#002D62]/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  id="opt-service-materials-only"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      Auto-aplicación
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Solo Materiales (Pintura)</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Pides los galones y el sellador para aplicarlo tú mismo o con tu propio equipo de confianza.
                  </p>
                </div>
              </div>
            </div>

            {/* Certified Painters Directory (Inspirado en Comex & ServiceTitan) */}
            {serviceOption === "con_aplicador" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#00A896]" />
                      Buscador de Maestros Pintores Certificados en {projectNeed.city}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Profesionales evaluados por Pintuco con antecedentes legales, ARL y certificación técnica al día.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {CERTIFIED_PAINTERS.map((painter) => {
                    const isSelected = selectedPainter.id === painter.id;
                    return (
                      <div
                        key={painter.id}
                        onClick={() => setSelectedPainter(painter)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected
                            ? "border-[#002D62] bg-blue-50/50 shadow-md ring-2 ring-[#002D62]/15"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        id={`painter-card-${painter.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={painter.photo}
                            alt={painter.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#002D62]/20 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{painter.name}</h4>
                              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-200">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{painter.rating}</span>
                                <span className="text-[10px] text-amber-700">({painter.reviewsCount})</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{painter.role}</p>

                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {painter.badges.map((b, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 text-right shrink-0">
                          <div>
                            <span className="text-[11px] text-slate-500 block">Disponibilidad</span>
                            <span className="text-xs font-bold text-emerald-700 block">{painter.availableSlot}</span>
                          </div>
                          {isSelected ? (
                            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#002D62]">
                              <CheckCircle2 className="w-4 h-4" /> Seleccionado
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="mt-2 text-xs font-bold text-[#00A896] hover:underline"
                            >
                              Seleccionar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Schedule Date & Time */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#002D62]" />
                Fecha y Hora Sugerida para el Servicio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#00A896] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#00A896] bg-white"
                  >
                    <option value="08:00 AM">Mañana (8:00 AM - 12:00 PM)</option>
                    <option value="01:30 PM">Tarde (1:30 PM - 5:30 PM)</option>
                    <option value="Jornada Completa">Jornada Completa (Obra Continua)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                Resumen del Pedido
              </h3>

              <div className="py-3 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Producto:</span>
                  <strong className="text-slate-900 text-right">{recommendation.productName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Volumen ({projectNeed.areaM2} m²):</span>
                  <span className="font-semibold text-slate-900">{recommendation.calculation.recommendedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tono Pintuco:</span>
                  <span className="font-semibold text-slate-900">{projectNeed.selectedColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Servicio:</span>
                  <span className="font-semibold text-slate-900">
                    {serviceOption === "con_aplicador" ? "Pintura + Maestro Certificado" : "Solo Materiales"}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-800 text-sm">Total a Pagar:</span>
                  <span className="text-xl font-black text-[#002D62]">
                    ${calculatedTotal.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Método de Pago Seguro
                </label>
                {[
                  { id: "pse" as const, name: "PSE / Transferencia Bancaria (Bancolombia, Davivienda, Nequi)" },
                  { id: "tarjeta_credito" as const, name: "Tarjeta de Crédito / Débito (Visa, Master, Amex)" },
                  { id: "contra_entrega" as const, name: "Pago Contra Entrega en Sitio / Datáfono" },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      paymentMethod === pm.id
                        ? "border-[#002D62] bg-blue-50 text-[#002D62] font-bold"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="accent-[#002D62]"
                    />
                    <span>{pm.name}</span>
                  </label>
                ))}
              </div>

              {/* Confirm CTA */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full mt-6 bg-[#002D62] hover:bg-[#003882] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-[#002D62]/20 transition-all flex items-center justify-center gap-2"
                id="btn-confirm-order-service"
              >
                <span>Confirmar y Ver Tracking en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToSupply}
              className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a Disponibilidad
            </button>
          </div>
        </div>
      ) : (
        /* Active Live Tracking Interface (ServiceTitan & Uber Style) */
        <div className="space-y-8">
          {/* Tracking Control Simulation Bar */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00A896] text-white flex items-center justify-center font-black">
                <Truck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00E5C9] uppercase tracking-wider">
                    Orden #{orderState.orderId}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    En Vivo (Live GPS)
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Estado actual: {trackingSteps[currentStepIndex]?.title}
                </h3>
              </div>
            </div>

            {/* Interactive simulation buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextStepSim}
                disabled={currentStepIndex >= trackingSteps.length - 1}
                className="bg-[#00A896] hover:bg-[#008f80] disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                id="btn-sim-next-step"
              >
                <span>Avanzar Estado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setAutoSimulating(!autoSimulating)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors flex items-center gap-1 ${
                  autoSimulating
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{autoSimulating ? "Pausar Auto-Play" : "Auto-Play"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetSim}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                title="Reiniciar Simulación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {trackingSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                      isCurrent
                        ? "bg-blue-50 border-2 border-[#002D62] shadow-sm"
                        : isPassed
                        ? "bg-emerald-50/50 border border-emerald-200"
                        : "opacity-40 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 font-bold ${
                        isCurrent
                          ? "bg-[#002D62] text-white ring-4 ring-blue-100"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{step.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map & Technician Dispatch Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Map Visualizer */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative flex flex-col justify-between min-h-[360px]">
              {/* Simulated Map Graphic */}
              <div className="relative w-full h-64 bg-[#1E293B] overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 600 300" className="w-full h-full object-cover opacity-80">
                  {/* Grid / Roads */}
                  <line x1="50" y1="0" x2="50" y2="300" stroke="#334155" strokeWidth="12" />
                  <line x1="200" y1="0" x2="200" y2="300" stroke="#334155" strokeWidth="8" />
                  <line x1="400" y1="0" x2="400" y2="300" stroke="#334155" strokeWidth="16" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#334155" strokeWidth="10" />
                  <line x1="0" y1="200" x2="600" y2="200" stroke="#334155" strokeWidth="14" />
                  <path d="M 50,80 Q 200,120 400,200" fill="none" stroke="#00A896" strokeWidth="6" strokeDasharray="8 6" />

                  {/* Route trajectory */}
                  {currentStepIndex >= 2 && (
                    <circle cx={currentStepIndex === 2 ? "260" : "400"} cy={currentStepIndex === 2 ? "140" : "200"} r="10" fill="#00E5C9">
                      <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Warehouse Point */}
                  <rect x="35" y="65" width="30" height="30" rx="6" fill="#002D62" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="40" y="85" fill="#FFFFFF" fontSize="10" fontWeight="bold">PT</text>

                  {/* Customer Destination Point */}
                  <circle cx="400" cy="200" r="14" fill="#E11D48" stroke="#FFFFFF" strokeWidth="3" />
                  <text x="394" y="204" fill="#FFFFFF" fontSize="11" fontWeight="bold">📍</text>
                </svg>

                {/* Map Floating Status Card */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-white text-xs shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold">Despacho Pintuco Centro</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-0.5">
                    Hacia: {projectNeed.address || "Dirección de Obra"} ({projectNeed.city})
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-white text-xs shadow-md">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Tiempo estimado</span>
                  <span className="text-sm font-black text-[#00E5C9]">
                    {currentStepIndex >= 4 ? "En Sitio • Completado" : `${orderState.driverEtaMinutes} min restantes`}
                  </span>
                </div>
              </div>

              {/* Bottom bar of map */}
              <div className="p-4 bg-slate-950 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#00A896]" />
                  <span>Ruta optimizada con Centro de Tinturado Pintuco</span>
                </div>
                <span className="text-slate-400">Lote de fabricación: #PNT-8942-A</span>
              </div>
            </div>

            {/* Assigned Painter Card & Live Chat */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Técnico / Aplicador Asignado
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Certificación Vigente
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedPainter.photo}
                    alt={selectedPainter.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{selectedPainter.name}</h4>
                    <p className="text-xs text-slate-500">{selectedPainter.role}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{selectedPainter.rating}</span>
                      <span className="text-slate-400">({selectedPainter.completedJobs} obras concluidas)</span>
                    </div>
                  </div>
                </div>

                {/* Direct action buttons: Call / Chat */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${selectedPainter.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#002D62]" />
                    <span>Llamar Técnico</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setChatOpen(!chatOpen)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#002D62] text-white text-xs font-bold hover:bg-[#003882] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{chatOpen ? "Cerrar Chat" : "Mensaje Directo"}</span>
                  </button>
                </div>

                {/* Inline chat drawer */}
                {chatOpen && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            msg.sender === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl max-w-[85%] ${
                              msg.sender === "user"
                                ? "bg-[#002D62] text-white rounded-br-none"
                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs"
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-1.5">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje al pintor..."
                        className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-[#00A896] text-white text-xs px-3 py-1.5 rounded-xl font-bold"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Ready for Warranty Next Step CTA */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-200" />
                  <h4 className="font-bold text-sm">Garantía Pintuco 360 Lista</h4>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Al completar el servicio, se emite automáticamente la póliza digital de garantía y la encuesta de satisfacción.
                </p>
                <button
                  type="button"
                  onClick={onProceedToQuality}
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 group"
                  id="btn-proceed-quality"
                >
                  <span>Finalizar Servicio y Ver Garantía 360</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
