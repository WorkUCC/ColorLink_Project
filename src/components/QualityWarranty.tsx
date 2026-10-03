import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  Star,
  CheckCircle2,
  Printer,
  RotateCcw,
  Sparkles,
  FileCheck,
  Send,
  X,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TechnicalRecommendation,
  ProjectNeedState,
  OrderState,
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

  React.useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#1A1715", "#E2622F", "#10B981"],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleQuickRating = (rating: number) => {
    setFeedbackRating(rating);
    setFeedbackSubmitted(true);
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
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-14 h-14 rounded-xl bg-[#1A1715] text-[#E2622F] flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Award className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold text-[#E2622F] uppercase tracking-wider">
          Paso 6 de 6 · Garantía oficial emitida
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2B211C] mt-1">
          ¡Tu proyecto está protegido con Pintuco 360!
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Completaste el ciclo integral: diagnóstico técnico, formulación de fábrica, aplicación profesional y póliza certificada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Digital Certificate */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border-2 border-[#1A1715] relative overflow-hidden print:shadow-none print:border-black print:m-0">
            {/* Certificate Header */}
            <div className="flex items-start justify-between pb-5 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#1A1715] tracking-tight">PINTUCO</span>
                  <span className="text-xs font-semibold text-[#E2622F] bg-[#E2622F]/10 px-2 py-0.5 rounded">
                    Póliza oficial 360
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Certificado de Calidad y Respaldo de Fábrica
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#1A1715] block">
                  {policyNumber}
                </span>
                <span className="text-[10px] text-stone-400">Emisión: {issueDate}</span>
              </div>
            </div>

            {/* Certificate Body Details */}
            <div className="py-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-400 block font-medium">Titular del proyecto:</span>
                  <span className="font-bold text-[#2B211C] text-sm block">
                    {user?.name || "Cliente verificado ColorLink"}
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    {projectNeed.city} · {projectNeed.address || "Dirección registrada"}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block font-medium">Vigencia de cobertura:</span>
                  <span className="font-bold text-emerald-700 text-sm block">
                    {recommendation.warrantyYears} años de garantía
                  </span>
                  <span className="text-stone-500 text-[11px]">Vence: {expirationDate}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block">Producto formulado:</span>
                  <span className="font-bold text-stone-800">{recommendation.productName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Superficie tratada:</span>
                  <span className="font-bold text-stone-800">
                    {projectNeed.areaM2} m² ({projectNeed.surface.replace("_", " ")})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Tono Pintuco:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0"
                      style={{ backgroundColor: projectNeed.selectedColor.hex }}
                    />
                    <span className="font-bold text-stone-800 truncate">
                      {projectNeed.selectedColor.name} ({projectNeed.selectedColor.code})
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-stone-400 block">Maestro aplicador:</span>
                  <span className="font-bold text-stone-800">
                    {orderState.selectedPainter?.name || "Aplicador certificado Pintuco"}
                  </span>
                </div>
              </div>

              {/* Warranted Terms */}
              <div className="space-y-1.5 pt-2">
                <span className="font-semibold text-stone-700 block">Cobertura garantizada:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2622F] shrink-0" />
                    <span>Resistencia a la intemperie y rayos UV</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2622F] shrink-0" />
                    <span>Poder cubriente y estabilidad del color</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2622F] shrink-0" />
                    <span>Adherencia técnica sin descascaramiento</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2622F] shrink-0" />
                    <span>Inspección técnica gratuita por reclamo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Certificate Footer Signature */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E2622F]" />
                <span className="text-[11px]">Firma digitalizada de calidad Pintuco S.A.</span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Verificado NTC</span>
            </div>
          </div>

          {/* Certificate Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="border border-stone-300 hover:bg-stone-50 text-[#1A1715] font-medium py-2.5 px-4 rounded-lg text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#E2622F]" />
              <span>{downloadSuccess ? "Imprimiendo..." : "Imprimir / Guardar PDF"}</span>
            </button>

            <button
              type="button"
              onClick={() => setClaimModalOpen(true)}
              className="text-xs text-stone-500 hover:text-stone-800 py-2.5 px-3 rounded-lg font-medium transition cursor-pointer"
            >
              ¿Cómo solicitar un retoque de garantía?
            </button>
          </div>
        </div>

        {/* Right Column: Feedback, Satisfaction & New Project */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Rating Widget */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm space-y-3">
            <h3 className="font-bold text-[#2B211C] text-sm">
              ¿Cómo calificarías tu experiencia en ColorLink?
            </h3>
            <p className="text-xs text-stone-500">
              Tu opinión ayuda a mejorar la asignación de maestros pintores y los tiempos de despacho.
            </p>

            {!feedbackSubmitted ? (
              <div className="flex items-center justify-center gap-2 py-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleQuickRating(star)}
                    className="p-2 text-stone-300 hover:text-amber-500 transition-colors transform hover:scale-110 cursor-pointer"
                    title={`${star} estrellas`}
                  >
                    <Star className="w-7 h-7 fill-current" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Gracias por calificar con {feedbackRating} estrellas! Tu reseña quedó registrada.</span>
              </div>
            )}
          </div>

          {/* New Project CTA */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-sm space-y-3">
            <h3 className="font-bold text-[#2B211C] text-sm">
              ¿Deseas iniciar otro proyecto de pintura?
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Puedes realizar una nueva cotización para otra habitación, fachada o área exterior.
            </p>
            <button
              type="button"
              onClick={onResetApp}
              className="w-full bg-gradient-to-br from-[#E2622F] to-[#F2A93C] hover:opacity-95 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition inline-flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-[0.98]"
              id="btn-reset-flow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cotizar un nuevo espacio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E8DFD5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-[#2B211C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E2622F]" />
                Solicitud de asistencia técnica de garantía
              </h3>
              <button
                type="button"
                onClick={() => setClaimModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!claimSubmitted ? (
              <form onSubmit={handleClaimSubmit} className="space-y-3 text-xs">
                <p className="text-stone-600">
                  Un perito técnico de Pintuco revisará el caso y programará una visita de inspección sin costo si corresponde a garantía de producto o aplicación.
                </p>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Motivo de la solicitud
                  </label>
                  <select
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="retoque_detalle">Retoque o detalle de terminación</option>
                    <option value="manchas_humedad">Aparición imprevista de humedad</option>
                    <option value="diferencia_tono">Diferencia notable en el tono del color</option>
                    <option value="desprendimiento">Desprendimiento o ampolla de pintura</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E2622F] hover:bg-[#C95222] text-white rounded-lg font-medium"
                  >
                    Radicar solicitud
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#2B211C]">Solicitud radicada con éxito</h4>
                <p className="text-xs text-stone-500">
                  Número de radicado: #REC-2026-0849. Un asesor técnico se comunicará en menos de 24 horas hábiles.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setClaimSubmitted(false);
                    setClaimModalOpen(false);
                  }}
                  className="mt-2 px-4 py-2 bg-[#1A1715] text-white text-xs rounded-lg font-medium"
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
