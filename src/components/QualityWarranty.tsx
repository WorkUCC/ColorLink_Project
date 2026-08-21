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
  const [feedback, setFeedback] = useState<SatisfactionFeedback>({
    productRating: 5,
    serviceRating: 5,
    recommendToFriend: true,
    comments: "Excelente acabado y la atención del maestro aplicador fue impecable.",
    submitted: false,
  });

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

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback((prev) => ({ ...prev, submitted: true }));
    try {
      confetti({
        particleCount: 50,
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

          {/* Action Buttons: Download PDF / Print */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="flex-1 bg-[#002D62] hover:bg-[#003882] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              id="btn-download-cert"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Certificado Oficial</span>
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
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preparando documento para impresión o guardado PDF.</span>
            </div>
          )}
        </div>

        {/* Right Column: Satisfaction Feedback & ColorLink Unique Value Overview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Satisfaction Survey Form */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-rose-500" />
              Encuesta de Satisfacción Rápida
            </h3>

            {!feedback.submitted ? (
              <form onSubmit={handleRatingSubmit} className="space-y-4 text-xs">
                {/* Product Rating */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Calidad y cobertura del producto ({recommendation.productName})
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback((f) => ({ ...f, productRating: star }))}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedback.productRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Rating */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Puntualidad y limpieza del aplicador certificado
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback((f) => ({ ...f, serviceRating: star }))}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedback.serviceRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Comentario u opinión
                  </label>
                  <textarea
                    rows={2}
                    value={feedback.comments}
                    onChange={(e) => setFeedback((f) => ({ ...f, comments: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00A896] hover:bg-[#009282] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  id="btn-submit-feedback"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Calificación</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs">¡Gracias por tu opinión!</h4>
                <p className="text-[11px] text-emerald-700">
                  Tu valoración ayuda a mantener el alto estándar de la red de aplicadores certificados Pintuco.
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
              className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl border border-white/20 text-xs transition-colors flex items-center justify-center gap-2"
              id="btn-new-project"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00E5C9]" />
              <span>Iniciar Otro Proyecto o Cotización</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
