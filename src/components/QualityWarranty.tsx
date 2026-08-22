import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  Star,
  CheckCircle2,
  Download,
  Share2,
  Printer,
  RotateCcw,
  Sparkles,
  Layers,
  Truck,
  Paintbrush,
  FileCheck,
  Send,
  Heart,
  Clock,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TechnicalRecommendation,
  ProjectNeedState,
  OrderState,
  SatisfactionFeedback,
  UserProfile,
} from "../types";

interface QualityWarrantyProps {
  recommendation: TechnicalRecommendation;
  projectNeed: ProjectNeedState;
  orderState: OrderState;
  user: UserProfile | null;
  onResetApp: () => void;
}

export const QualityWarranty: React.FC<QualityWarrantyProps> = ({
  recommendation,
  projectNeed,
  orderState,
  user,
  onResetApp,
}) => {
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [claimModalOpen, setClaimModalOpen] = useState<boolean>(false);
  const [claimSubmitted, setClaimSubmitted] = useState<boolean>(false);
  const [claimReason, setClaimReason] = useState<string>("retoque_detalle");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Trigger confetti effect on initial mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#002D62", "#00A896", "#00E5C9", "#F59E0B"],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleQuickRating = (rating: number) => {
    setFeedbackRating(rating);
    setFeedbackSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // safe
    }
  };

  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
    window.print();
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
  };

  const policyNumber = `POL-PNT-2026-${orderState.orderId || "89421"}`;
  const issueDate = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const expirationDate = new Date(
    Date.now() + recommendation.warrantyYears * 365 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Completion Badge */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 rounded-3xl bg-[#002D62] text-[#00E5C9] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#002D62]/20">
          <Award className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
          Garantía Pintuco 360 Activada
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          ¡Tu Proyecto está Completado y Protegido!
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Has completado el ciclo integral en ColorLink: desde el diagnóstico técnico hasta la aplicación certificada y la emisión de tu póliza de respaldo de fábrica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Digital Certificate */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#002D62] relative overflow-hidden print:shadow-none print:border-black print:m-0">
            {/* Watermark Logo */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <ShieldCheck className="w-72 h-72 text-[#002D62]" />
            </div>

            {/* Certificate Header */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-[#002D62] tracking-tight">PINTUCO</span>
                  <span className="text-xs font-bold text-[#00A896] uppercase bg-teal-50 px-2 py-0.5 rounded">
                    ColorLink 360
                  </span>
                </div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 mt-1">
                  Certificado de Garantía Técnica y Calidad
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">Nº DE PÓLIZA</span>
                <span className="text-xs font-mono font-bold text-[#002D62]">{policyNumber}</span>
              </div>
            </div>

            {/* Certificate Body Details */}
            <div className="py-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-600 leading-relaxed">
                <strong>PINTUCO S.A.S.</strong> certifica que el inmueble ubicado en{" "}
                <span className="text-slate-900 font-semibold">{projectNeed.address || user?.address || "Dirección del Proyecto"}</span> en{" "}
                <span className="text-slate-900 font-semibold">{projectNeed.city}</span> ha sido tratado con el sistema de recubrimientos de alta tecnología:
              </p>

              {/* Highlight System Box */}
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-sm font-black text-[#002D62]">
                    {recommendation.productName}
                  </h3>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {recommendation.warrantyYears} Años de Cobertura
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Color Tinturado: <strong>{projectNeed.selectedColor.name} ({projectNeed.selectedColor.code})</strong> • Área protegida: <strong>{projectNeed.areaM2} m²</strong>
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Titular del Proyecto</span>
                  <strong className="text-slate-900">{user?.name || "Cliente ColorLink"}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Aplicador Certificado</span>
                  <strong className="text-slate-900">
                    {orderState.selectedPainter ? orderState.selectedPainter.name : "Aplicación Técnica Autorizada"}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Fecha de Emisión</span>
                  <strong className="text-slate-900">{issueDate}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Vigencia hasta</span>
                  <strong className="text-emerald-700">{expirationDate}</strong>
                </div>
              </div>
            </div>

            {/* Certificate Footer / Signatures */}
            <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-900 block">Sello Digital de Autenticidad</span>
                  <span className="text-[9px] text-slate-500">Verificable vía QR Pintuco Cloud</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif italic text-xs text-slate-700 block">Dirección Técnica Pintuco</span>
                <span className="text-[9px] text-slate-400">Control de Calidad & Respaldo</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Download PDF / Print / Claim Warranty */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="flex-1 bg-[#002D62] hover:bg-[#003882] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              id="btn-download-cert"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Certificado Oficial</span>
            </button>

            <button
              type="button"
              onClick={() => setClaimModalOpen(true)}
              className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              id="btn-open-claim"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Pedir Retoque / Reclamar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Garantía Pintuco ColorLink",
                    text: `He completado mi proyecto con ${recommendation.productName} y ${recommendation.warrantyYears} años de garantía Pintuco. Póliza: ${policyNumber}`,
                  }).catch(() => {});
                } else {
                  alert(`Póliza copiada al portapapeles: ${policyNumber}`);
                }
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>

          {/* Visual Warranty Expiration & Maintenance Reminder Card */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                Vigencia de Cobertura Activa Pintuco 360
              </span>
              <span className="bg-emerald-200/80 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                {recommendation.warrantyYears} Años
              </span>
            </div>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Tu recubrimiento está cubierto ante ampollamiento, decoloración o desprendimiento hasta el <strong>{expirationDate}</strong>. Te enviaremos un recordatorio por email antes de vencer para agendar tu mantenimiento preventivo oficial.
            </p>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preparando documento para impresión o guardado PDF.</span>
            </div>
          )}
        </div>

        {/* Right Column: 1-Click Satisfaction Feedback & Value Overview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick 1-Click Satisfaction Survey */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              Calificación en 1 Clic
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ¿Cómo calificarías tu experiencia general con ColorLink y el maestro certificado?
            </p>

            {!feedbackSubmitted ? (
              <div className="space-y-4">
                {/* Expressive 1-Click Emoji buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { stars: 1, label: "Mala", emoji: "😞" },
                    { stars: 2, label: "Regular", emoji: "😐" },
                    { stars: 3, label: "Aceptable", emoji: "🙂" },
                    { stars: 4, label: "Muy Buena", emoji: "😊" },
                    { stars: 5, label: "Excelente", emoji: "🤩" },
                  ].map((item) => (
                    <button
                      key={item.stars}
                      type="button"
                      onClick={() => handleQuickRating(item.stars)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 hover:border-[#00A896] hover:bg-teal-50/50 transition-all group cursor-pointer"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">
                        {item.emoji}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-[#002D62] mt-1 text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Or 5-star direct tap */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">O toca las estrellas:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleQuickRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-center space-y-1.5 animate-in fade-in">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs">¡Calificación de {feedbackRating}/5 estrellas guardada!</h4>
                <p className="text-[11px] text-emerald-700">
                  Gracias por ayudarnos a certificar la excelencia del servicio Pintuco ColorLink.
                </p>
              </div>
            )}
          </div>

          {/* ColorLink Competitive Advantage Callout */}
          <div className="bg-gradient-to-br from-[#002D62] to-[#0A2540] text-white p-6 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#00E5C9]">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">El Gran Diferenciador ColorLink</h4>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed font-normal">
              Comex o Sherwin-Williams resuelven bien la selección de producto, y ServiceTitan la gestión de campo. <strong>ColorLink es la primera plataforma en el sector de pinturas que une en un solo flujo continuo:</strong>
            </p>

            <ul className="space-y-2 text-xs text-blue-200 pt-1">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#00A896] text-[#002D62] font-black flex items-center justify-center text-[10px]">1</span>
                <span>Diagnóstico técnico guiado sin tecnicismos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#00A896] text-[#002D62] font-black flex items-center justify-center text-[10px]">2</span>
                <span>Inventario y tinturado conectado a la ubicación</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#00A896] text-[#002D62] font-black flex items-center justify-center text-[10px]">3</span>
                <span>Agenda y tracking en vivo de pintor certificado</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#00A896] text-[#002D62] font-black flex items-center justify-center text-[10px]">4</span>
                <span>Emisión automática de póliza de garantía de fábrica</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={onResetApp}
              className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl border border-white/20 text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="btn-new-project"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00E5C9]" />
              <span>Iniciar Otro Proyecto o Cotización</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim Warranty / Request Touch-up Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Solicitar Retoque o Garantía</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Póliza: {policyNumber}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setClaimModalOpen(false);
                  setClaimSubmitted(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!claimSubmitted ? (
              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Motivo de la solicitud:
                  </label>
                  <select
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                  >
                    <option value="retoque_detalle">Retoque de detalle estético o esquinero</option>
                    <option value="desprendimiento">Desprendimiento o ampollamiento de película</option>
                    <option value="tono_variacion">Variación visual de tono o acabado</option>
                    <option value="revision_tecnica">Visita de inspección técnica preventiva</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Detalle o zona afectada:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ejemplo: Se requiere un pequeño retoque en la pared lateral cerca al marco de la puerta..."
                    defaultValue="Retoque preventivo cubierto por garantía Pintuco 360."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-[11px] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#002D62] shrink-0" />
                  <span>Un asesor técnico Pintuco se comunicará a tu teléfono registrado en menos de <strong>2 horas hábiles</strong>.</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#002D62] hover:bg-[#003882] text-white font-bold transition-all shadow-md"
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-slate-900">¡Solicitud de Retoque Radicada con Éxito!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Radicado Nº <strong>RTQ-2026-0842</strong>. Hemos asignado la revisión al maestro certificado <strong>{orderState.selectedPainter?.name || "Pintuco"}</strong> con cobertura de garantía total sin costo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setClaimModalOpen(false);
                    setClaimSubmitted(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#00A896] text-white font-bold text-xs shadow-md"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
