import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ArrowLeft,
  Info,
  Truck,
  RotateCcw,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Award,
} from "lucide-react";
import { TechnicalRecommendation, ProjectNeedState, UserProfile } from "../types";

interface TechnicalSolutionProps {
  recommendation: TechnicalRecommendation | null;
  projectNeed: ProjectNeedState;
  user?: UserProfile | null;
  isLoading: boolean;
  onProceedToSupply: () => void;
  onBackToWizard: () => void;
  onRefineWithAI: (userQuestion: string) => void;
  onLoginClick?: () => void;
}

export const TechnicalSolution: React.FC<TechnicalSolutionProps> = ({
  recommendation,
  projectNeed,
  user,
  isLoading,
  onProceedToSupply,
  onBackToWizard,
  onRefineWithAI,
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [selectedCoats, setSelectedCoats] = useState<number>(
    recommendation?.calculation?.coatCount || 2
  );

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setIsAsking(true);
    await onRefineWithAI(userQuery);
    setUserQuery("");
    setIsAsking(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E7E5E4] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-lg bg-[#001D40] text-[#00A896] flex items-center justify-center mb-5">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-[#1C1917] mb-2">
            Formulando recomendación técnica oficial...
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Evaluando superficie de {projectNeed.surface.replace("_", " ")}, factor de absorción para {projectNeed.areaM2} m² y catálogo de tecnologías Pintuco.
          </p>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#00A896] h-full w-2/3 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-xl border border-[#E7E5E4] shadow-sm">
          <Info className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1C1917]">No se pudo cargar la recomendación</h3>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Ocurrió un problema procesando las especificaciones de tu proyecto.
          </p>
          <button
            onClick={onBackToWizard}
            className="border border-stone-300 hover:bg-stone-50 text-[#001D40] font-medium px-5 py-2.5 rounded-lg text-xs"
          >
            Volver al asistente
          </button>
        </div>
      </div>
    );
  }

  // Live recalculations based on coat count
  const area = projectNeed.areaM2 || recommendation.calculation.areaM2;
  const totalGallonsRaw = (area / 44) * selectedCoats;
  const totalGallons = Math.max(1, Math.ceil(totalGallonsRaw));
  const litersEstimate = Math.round(totalGallons * 3.785);

  const buckets5Gal = Math.floor(totalGallons / 5);
  const singleGallons = totalGallons % 5;
  let dynamicFormat = "";
  if (buckets5Gal > 0 && singleGallons > 0) {
    dynamicFormat = `${buckets5Gal} cuñete${buckets5Gal > 1 ? "s" : ""} (5 gal) + ${singleGallons} galón${singleGallons > 1 ? "es" : ""}`;
  } else if (buckets5Gal > 0) {
    dynamicFormat = `${buckets5Gal} cuñete${buckets5Gal > 1 ? "s" : ""} (5 gal)`;
  } else {
    dynamicFormat = `${singleGallons} galón${singleGallons > 1 ? "es" : ""}`;
  }

  const coatMultiplier = selectedCoats === 1 ? 0.58 : selectedCoats === 3 ? 1.45 : 1;
  const productBasePrice = Math.round(recommendation.pricing.productEstimatedTotal * coatMultiplier);
  const laborMultiplier = selectedCoats === 1 ? 0.65 : selectedCoats === 3 ? 1.35 : 1;
  const dynamicLaborPrice = Math.round(recommendation.pricing.laborEstimatedTotal * laborMultiplier);

  const memberDiscountRate = 0.15;
  const memberDiscountAmount = Math.round(productBasePrice * memberDiscountRate);
  const finalProductPrice = user ? productBasePrice - memberDiscountAmount : productBasePrice;
  const finalTotalPrice = finalProductPrice + dynamicLaborPrice;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A896] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnóstico técnico Pintuco completado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
            Tu solución técnica recomendada
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Formulación oficial para {projectNeed.areaM2} m² de {projectNeed.surface.replace("_", " ")} en {projectNeed.city}.
          </p>
        </div>

        {/* Selected Color badge */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#E7E5E4] shadow-sm flex items-center gap-3 self-start md:self-auto">
          <div
            className="w-6 h-6 rounded-lg border border-black/10 shadow-inner"
            style={{ backgroundColor: projectNeed.selectedColor.hex }}
          />
          <div>
            <span className="text-[10px] text-stone-400 font-semibold uppercase block">
              Color seleccionado
            </span>
            <span className="text-xs font-bold text-[#1C1917]">
              {projectNeed.selectedColor.name}
            </span>
          </div>
        </div>
      </div>

      {/* Member Incentive Notification */}
      {user ? (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Tarifa VIP activa para {user.name}:</strong> 15% de descuento aplicado en pintura (-${memberDiscountAmount.toLocaleString("es-CO")} COP) y garantía directa.
            </span>
          </div>
          <span className="font-bold text-emerald-800 shrink-0 hidden sm:inline">
            Beneficio cliente
          </span>
        </div>
      ) : (
        <div className="mb-6 bg-stone-100 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
            <span>
              Puedes adquirir esta solución como visitante, o iniciar sesión para acceder al 15% de ahorro oficial.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Hero Product & System Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Product Card */}
          <div className="bg-[#001D40] text-white rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-[#00A896] bg-[#00A896]/15 px-2.5 py-1 rounded-md">
                {recommendation.productCategory}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#00A896]" />
                <span>{recommendation.warrantyYears} años de garantía certificada</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {recommendation.productName}
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed mb-6 font-normal">
              {recommendation.explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-white/10">
              {recommendation.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span>Producto certificado Pintuco Colombia</span>
              <span>Cumple norma NTC oficial</span>
            </div>
          </div>

          {/* System Application Steps */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5E4]">
            <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[#001D40]" />
              Secuencia técnica recomendada
            </h3>

            <div className="space-y-3">
              {recommendation.systemSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-stone-50 border border-stone-100"
                >
                  <div className="w-6 h-6 rounded-md bg-[#001D40] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {recommendation.technicalNotes && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Consejo de maestro pintor:</strong> {recommendation.technicalNotes}
                </p>
              </div>
            )}
          </div>

          {/* AI Question Box */}
          <div className="bg-white rounded-xl p-5 border border-[#E7E5E4] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#00A896]" />
              <h4 className="text-xs font-semibold text-[#1C1917]">
                ¿Tienes alguna duda técnica sobre la superficie o preparación?
              </h4>
            </div>
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ej: ¿Debo raspar antes o puedo aplicar sobre pintura vieja?"
                className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
              />
              <button
                type="submit"
                disabled={isAsking || !userQuery.trim()}
                className="bg-[#001D40] hover:bg-stone-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Consultar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Pricing & Calculation Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E7E5E4]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#001D40]" />
                <h3 className="font-bold text-[#1C1917] text-sm">Resumen de materiales</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Sin desperdicio
              </span>
            </div>

            {/* Coat Selector */}
            <div className="py-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Número de manos a aplicar
                  </label>
                  <span className="text-xs font-medium text-[#00A896]">
                    {selectedCoats === 2 ? "Estándar oficial" : selectedCoats === 1 ? "Retoque leve" : "Alta cobertura"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedCoats(num)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition cursor-pointer text-center ${
                        selectedCoats === num
                          ? "bg-[#001D40] text-white border-[#001D40] font-semibold"
                          : "bg-white text-stone-700 border-[#E7E5E4] hover:bg-stone-50"
                      }`}
                    >
                      {num} {num === 1 ? "Mano" : "Manos"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Presentación requerida</span>
                <span className="text-base font-bold text-[#1C1917] block mt-0.5 capitalize">
                  {dynamicFormat}
                </span>
                <span className="text-xs text-stone-400">
                  ~{totalGallons} galones (~{litersEstimate} L) para {area} m²
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-100">
                <div>
                  <span className="text-stone-500 block">Área base</span>
                  <span className="font-semibold text-stone-800">{area} m²</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Manos</span>
                  <span className="font-semibold text-[#00A896]">{selectedCoats} manos</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Pintura ({dynamicFormat}):</span>
                <div className="text-right">
                  {user && (
                    <span className="line-through text-stone-400 text-[11px] block">
                      ${productBasePrice.toLocaleString("es-CO")} COP
                    </span>
                  )}
                  <span className="font-semibold text-stone-900">
                    ${finalProductPrice.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              {user && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-medium">
                  <span>Descuento VIP cliente (-15%):</span>
                  <span>-${memberDiscountAmount.toLocaleString("es-CO")} COP</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Mano de obra sugerida:</span>
                <span className="font-semibold text-stone-900">
                  ${dynamicLaborPrice.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Despacho a domicilio:</span>
                <span className="font-medium text-emerald-700">Gratis</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1C1917] block">
                    Total estimado
                  </span>
                  <span className="text-[11px] text-stone-400">Pintura + Aplicación</span>
                </div>
                <span className="text-xl font-bold text-[#001D40]">
                  ${finalTotalPrice.toLocaleString("es-CO")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToSupply}
              className="w-full mt-6 bg-[#00A896] hover:bg-[#009282] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition inline-flex items-center justify-center gap-2 cursor-pointer text-sm"
              id="btn-proceed-supply"
            >
              <span>Verificar disponibilidad y entrega</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E7E5E4] flex items-center gap-3 text-xs text-stone-600 shadow-sm">
            <Truck className="w-5 h-5 text-[#00A896] shrink-0" />
            <span>
              Tinturado y despacho desde tiendas autorizadas en {projectNeed.city}.
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToWizard}
            className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-900 inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ajustar datos de superficie
          </button>
        </div>
      </div>
    </div>
  );
};
