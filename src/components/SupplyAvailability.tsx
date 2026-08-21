import React, { useState } from "react";
import {
  Truck,
  Store,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  Navigation,
  Sparkles,
} from "lucide-react";
import { TechnicalRecommendation, ProjectNeedState, DeliveryMethod, UserProfile } from "../types";
import { PINTUCO_STORES } from "../data/pintucoData";

interface SupplyAvailabilityProps {
  recommendation: TechnicalRecommendation;
  projectNeed: ProjectNeedState;
  user: UserProfile | null;
  onProceedToService: (deliveryMethod: DeliveryMethod, storeData?: { name: string; address: string }) => void;
  onBackToTechnical: () => void;
}

export const SupplyAvailability: React.FC<SupplyAvailabilityProps> = ({
  recommendation,
  projectNeed,
  user,
  onProceedToService,
  onBackToTechnical,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("domicilio_express");
  const [selectedStoreId, setSelectedStoreId] = useState<string>(PINTUCO_STORES[0]?.id || "st-bog-01");

  // Filter stores by current city if available, otherwise show all
  const filteredStores = PINTUCO_STORES.filter(
    (s) => s.city.toLowerCase().includes(projectNeed.city.split(" ")[0].toLowerCase())
  );
  const displayStores = filteredStores.length > 0 ? filteredStores : PINTUCO_STORES;
  const selectedStore = displayStores.find((s) => s.id === selectedStoreId) || displayStores[0];

  const handleContinue = () => {
    if (deliveryMethod === "retiro_tienda" && selectedStore) {
      onProceedToService(deliveryMethod, {
        name: selectedStore.name,
        address: selectedStore.address,
      });
    } else {
      onProceedToService(deliveryMethod);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Step Header */}
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider uppercase text-[#00A896]">
          Paso 4 de 6 • Abastecimiento Inteligente
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Disponibilidad y Método de Entrega
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Conectamos automáticamente la bodega y planta de tinturado más cercana a tu ubicación en {projectNeed.city}.
        </p>
      </div>

      {/* Real-time inventory status traffic light */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                🟢 Semáforo de Stock: Disponible Inmediato
              </span>
            </div>
            <h3 className="text-base font-bold text-emerald-950 mt-0.5">
              Material listo para tinturado de fábrica ({projectNeed.selectedColor.name})
            </h3>
            <p className="text-xs text-emerald-800">
              {recommendation.calculation.recommendedFormat} de {recommendation.productName} garantizados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white/80 backdrop-blur px-3 py-2 rounded-xl border border-emerald-200 shrink-0">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Tiempo de despacho: {projectNeed.urgency === "urgente_24h" ? "2 a 4 horas" : "24 a 48 horas"}</span>
        </div>
      </div>

      {/* Delivery Method Options */}
      <div className="space-y-4 mb-8">
        <h2 className="text-base font-bold text-slate-900">
          ¿Cómo deseas recibir tu pintura y materiales?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Express Delivery */}
          <div
            onClick={() => setDeliveryMethod("domicilio_express")}
            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col justify-between ${
              deliveryMethod === "domicilio_express"
                ? "border-[#002D62] bg-blue-50/50 shadow-md ring-2 ring-[#002D62]/10"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
            id="opt-delivery-express"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#002D62] text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                {deliveryMethod === "domicilio_express" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#002D62]" />
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Envío Gratis
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base">
                Despacho Express a Domicilio
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Entregamos directamente en tu puerta o en la obra con camión logístico Pintuco climatizado para preservar la mezcla.
              </p>

              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>{projectNeed.address || user?.address || "Dirección del proyecto"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Entrega estimada: {projectNeed.urgency === "urgente_24h" ? "Hoy mismo (Turno tarde)" : "Mañana a primera hora"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#002D62]">
              <span>Costo de flete:</span>
              <span className="text-emerald-700 font-extrabold uppercase">$0 COP (Incluido)</span>
            </div>
          </div>

          {/* Option 2: Store Pickup */}
          <div
            onClick={() => setDeliveryMethod("retiro_tienda")}
            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col justify-between ${
              deliveryMethod === "retiro_tienda"
                ? "border-[#002D62] bg-blue-50/50 shadow-md ring-2 ring-[#002D62]/10"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
            id="opt-delivery-pickup"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                {deliveryMethod === "retiro_tienda" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#002D62]" />
                ) : (
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Retiro en 2 Horas
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base">
                Retiro en Tienda Pintacasa Pintuco
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pasa a recoger tu pedido ya tinturado en la tienda oficial más cercana sin filas ni esperas.
              </p>

              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Store className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>{selectedStore?.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Navigation className="w-3 h-3 text-slate-400" />
                  <span>A {selectedStore?.distance} de tu ubicación • {selectedStore?.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#002D62]">
              <span>Disponibilidad en mostrador:</span>
              <span className="text-[#00A896]">Listo para entrega</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Store Selector if Store Pickup is active */}
      {deliveryMethod === "retiro_tienda" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#002D62]" />
              Tiendas Pintuco con Stock Confirmado en {projectNeed.city}
            </h3>
            <span className="text-xs text-slate-500">
              {displayStores.length} puntos autorizados
            </span>
          </div>

          <div className="space-y-2.5">
            {displayStores.map((st) => {
              const isSelected = selectedStoreId === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStoreId(st.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[#002D62] bg-blue-50/70 shadow-sm font-medium"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#002D62] flex items-center justify-center text-xs font-bold shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{st.name}</h4>
                      <p className="text-[11px] text-slate-500">{st.address} • {st.openingHours}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block">
                      En Stock
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{st.distance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToTechnical}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Solución Técnica</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002D62] hover:bg-[#003882] text-white font-bold text-sm shadow-md transition-all group"
          id="btn-confirm-supply"
        >
          <span>Continuar a Servicio & Aplicador</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
