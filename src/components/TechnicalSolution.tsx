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
  DollarSign,
  Droplet,
  Truck,
  RotateCcw,
  Send,
  Loader2,
  AlertCircle,
  Tag,
  Check,
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
  onLoginClick,
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#002D62] text-[#00E5C9] flex items-center justify-center animate-pulse mb-6 shadow-lg shadow-[#002D62]/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Formulando Sistema Técnico Pintuco...
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Evaluando condiciones de {projectNeed.surface.replace("_", " ")}, factor de absorción para {projectNeed.areaM2} m² y formulación con tecnología activa.
          </p>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#002D62] to-[#00A896] h-full w-3/4 animate-[shimmer_1.5s_infinite] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <Info className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No se pudo cargar el diagnóstico</h3>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Ocurrió un inconveniente procesando los datos de tu proyecto.
          </p>
          <button
            onClick={onBackToWizard}
            className="bg-[#002D62] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
          >
            Volver al Asistente
          </button>
        </div>
      </div>
    );
  }

  // Dynamic live recalculations based on coat count
  const area = projectNeed.areaM2 || recommendation.calculation.areaM2;
  // standard 22 m2/gal at 2 coats -> 44 m2/gal at 1 coat
  const totalGallonsRaw = (area / 44) * selectedCoats;
  const totalGallons = Math.max(1, Math.ceil(totalGallonsRaw));
  const litersEstimate = Math.round(totalGallons * 3.785);

  const buckets5Gal = Math.floor(totalGallons / 5);
  const singleGallons = totalGallons % 5;
  let dynamicFormat = "";
  if (buckets5Gal > 0 && singleGallons > 0) {
    dynamicFormat = `${buckets5Gal} Cuñete${buckets5Gal > 1 ? "s" : ""} (5 gal) + ${singleGallons} Galón${singleGallons > 1 ? "es" : ""}`;
  } else if (buckets5Gal > 0) {
    dynamicFormat = `${buckets5Gal} Cuñete${buckets5Gal > 1 ? "s" : ""} (5 gal)`;
  } else {
    dynamicFormat = `${singleGallons} Galón${singleGallons > 1 ? "es" : ""}`;
  }

  // Cost ratio according to coats
  const coatMultiplier = selectedCoats === 1 ? 0.58 : selectedCoats === 3 ? 1.45 : 1;
  const productBasePrice = Math.round(recommendation.pricing.productEstimatedTotal * coatMultiplier);
  const laborMultiplier = selectedCoats === 1 ? 0.65 : selectedCoats === 3 ? 1.35 : 1;
  const dynamicLaborPrice = Math.round(recommendation.pricing.laborEstimatedTotal * laborMultiplier);

  // Calculate member discounts
  const memberDiscountRate = 0.15; // 15% discount for registered customers
  const memberDiscountAmount = Math.round(productBasePrice * memberDiscountRate);
  const finalProductPrice = user ? productBasePrice - memberDiscountAmount : productBasePrice;
  const finalTotalPrice = finalProductPrice + dynamicLaborPrice;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Incentive or VIP Confirmation Banner */}
      {!user ? (
        <div className="mb-6 bg-gradient-to-r from-amber-50/80 via-emerald-50/40 to-slate-50 border border-amber-200 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  Club Pintuco
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Ahorro potencial de ${memberDiscountAmount.toLocaleString("es-CO")} COP (-15%) para cuentas registradas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Los clientes registrados obtienen fórmulas archivadas, tarifas preferenciales y póliza de garantía digital.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  ✨ Tarifa Preferencial Club Pintuco Activa
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  Descuento del 15% aplicado (-${memberDiscountAmount.toLocaleString("es-CO")} COP)
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">
                Cotización técnica personalizada para {user.name} ({user.type === "hogar" ? "Hogar" : user.type === "contratista" ? "Contratista" : "Empresa"})
              </p>
              <p className="text-xs text-slate-600">
                Fórmula archivada en tu cuenta • Despacho prioritario en {user.city} • Póliza Pintuco 360 garantizada.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white/80 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs shrink-0">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Beneficio VIP de Cliente Aplicado</span>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Diagnóstico Técnico Automatizado con IA Pintuco
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Tu Solución Técnica Recomendada
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Diseñada a la medida para {projectNeed.areaM2} m² de {projectNeed.surface.replace("_", " ")} en {projectNeed.city}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full border border-slate-300"
              style={{ backgroundColor: projectNeed.selectedColor.hex }}
            />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Tono Elegido</span>
              <span className="text-xs font-bold text-slate-900">{projectNeed.selectedColor.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Recommendation Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Product Card */}
          <div className="bg-gradient-to-br from-[#002D62] via-[#003A7A] to-[#0A2540] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900 relative overflow-hidden">
            {/* Background badge watermarks */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="bg-[#00A896] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {recommendation.productCategory}
                </span>

                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#00E5C9] border border-white/10">
                  <ShieldCheck className="w-4 h-4" />
                  {recommendation.warrantyYears} Años de Garantía Certificada
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                {recommendation.productName}
              </h2>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {recommendation.explanation}
              </p>

              {/* Product Key Benefits Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-white/10">
                {recommendation.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5C9] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Application Sequence Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#002D62]" />
              Secuencia del Sistema Técnico de Aplicación
            </h3>

            <div className="space-y-3">
              {recommendation.systemSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#002D62] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Tip */}
            {recommendation.technicalNotes && (
              <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Consejo de Maestro Pintor:</strong>{" "}
                  {recommendation.technicalNotes}
                </div>
              </div>
            )}
          </div>

          {/* Ask AI Technical Consultant chatlet */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#00A896]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ¿Tienes una duda técnica adicional sobre tu pared o clima?
              </h4>
            </div>
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ej: ¿Puedo aplicar directamente sobre pintura vieja o debo raspar?"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white"
              />
              <button
                type="submit"
                disabled={isAsking || !userQuery.trim()}
                className="bg-[#002D62] hover:bg-[#003882] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Consultar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Paint Volume Calculation & Pricing Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Material Yield Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#002D62]" />
                <h3 className="font-bold text-slate-900 text-sm">Cálculo de Materiales</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Sin Desperdicio
              </span>
            </div>

            {/* Coat Selector & Recalculation */}
            <div className="py-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Número de Manos a Aplicar
                  </label>
                  <span className="text-[11px] font-bold text-[#00A896]">
                    {selectedCoats === 2 ? "★ Recomendado" : selectedCoats === 1 ? "Retoque leve" : "Alta cobertura"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCoats(1)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedCoats === 1
                        ? "bg-[#002D62] text-white border-[#002D62] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    1 Mano
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCoats(2)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer relative ${
                      selectedCoats === 2
                        ? "bg-[#002D62] text-white border-[#002D62] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    2 Manos
                    <span className="absolute -top-1.5 -right-1 bg-emerald-500 text-white text-[9px] px-1 py-0.2 rounded-full">
                      Pintuco
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCoats(3)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedCoats === 3
                        ? "bg-[#002D62] text-white border-[#002D62] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    3 Manos
                  </button>
                </div>
              </div>

              {/* Visual explanation of 1 vs 2 coats */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Info className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>Criterio técnico de aplicación:</span>
                </div>
                {selectedCoats === 1 ? (
                  <p className="text-slate-600">
                    <strong>1 Mano:</strong> Válido solo para retoque sobre pintura previa del mismo color exacto y sin manchas profundas.
                  </p>
                ) : selectedCoats === 2 ? (
                  <p className="text-slate-600">
                    <strong>2 Manos (Estándar de Fábrica):</strong> Sella porosidad, asegura poder cubriente parejo y activa la <strong>Garantía Oficial Pintuco 360</strong>.
                  </p>
                ) : (
                  <p className="text-slate-600">
                    <strong>3 Manos:</strong> Recomendado para cambios drásticos (de oscuro a claro) o fachadas con alta exposición solar y salitre.
                  </p>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 block">Formato Calculado en Vivo</span>
                <span className="text-lg font-black text-[#002D62] block mt-0.5">
                  {dynamicFormat}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Equivalente a ~{totalGallons} Galón{totalGallons > 1 ? "es" : ""} (~{litersEstimate} Litros para {area} m²)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Área base</span>
                  <span className="font-bold text-slate-800">{area} m²</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Manos seleccionadas</span>
                  <span className="font-bold text-[#00A896]">{selectedCoats} Mano{selectedCoats > 1 ? "s" : ""}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-500 block">Rendimiento estimado</span>
                  <span className="font-semibold text-slate-700">{recommendation.calculation.coverageRate}</span>
                </div>
              </div>

              {/* Estimation Disclaimer */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso:</strong> Este cálculo es una estimación y puede variar según la absorción, rugosidad y el estado real de la superficie.
                </span>
              </div>
            </div>

            {/* Estimated Pricing Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              {/* Product Price */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Pintura Pintuco ({dynamicFormat}):</span>
                <div className="text-right">
                  {user && (
                    <span className="line-through text-slate-400 text-[11px] block">
                      ${productBasePrice.toLocaleString("es-CO")} COP
                    </span>
                  )}
                  <span className="font-semibold text-slate-900">
                    ${finalProductPrice.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              {/* Member Savings Row if User is logged in */}
              {user && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-semibold border border-emerald-100">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Descuento Cliente (-15%):</span>
                  </span>
                  <span>-${memberDiscountAmount.toLocaleString("es-CO")} COP</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Mano de obra certificada ({selectedCoats} manos):</span>
                <span className="font-semibold text-slate-900">
                  ${dynamicLaborPrice.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Envío express a domicilio:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  $0 COP (Gratis)
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Total Estimado Proyecto
                  </span>
                  <span className="text-[10px] text-slate-500">Materiales + Servicio Certificado</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#002D62]">
                    ${finalTotalPrice.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button to proceed */}
            <button
              type="button"
              onClick={onProceedToSupply}
              className="w-full mt-6 bg-[#00A896] hover:bg-[#009282] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-[#00A896]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              id="btn-proceed-supply"
            >
              <span>Verificar Disponibilidad & Entrega</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Secondary reassurance */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3 text-xs text-blue-950">
            <Truck className="w-5 h-5 text-[#00A896] shrink-0" />
            <span>
              Stock confirmado en centros Pintuco de {projectNeed.city}. Despacho programable para entrega en menos de 24 horas.
            </span>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={onBackToWizard}
            className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ajustar datos de necesidad
          </button>
        </div>
      </div>
    </div>
  );
};
