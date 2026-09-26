import React, { useState } from "react";
import {
  Truck,
  Store,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Phone,
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

  const filteredStores = PINTUCO_STORES.filter(
    (s) => s.city.toLowerCase().includes(projectNeed.city.split(" ")[0].toLowerCase())
  );
  const baseStores = filteredStores.length > 0 ? filteredStores : PINTUCO_STORES;
  
  const displayStores = [...baseStores].sort((a, b) => {
    const distA = parseFloat(a.distance.replace(/[^\d.]/g, "")) || 999;
    const distB = parseFloat(b.distance.replace(/[^\d.]/g, "")) || 999;
    return distA - distB;
  });

  const [selectedStoreId, setSelectedStoreId] = useState<string>(displayStores[0]?.id || "st-bog-01");
  const selectedStore = displayStores.find((s) => s.id === selectedStoreId) || displayStores[0];

  const getEstimatedDateString = () => {
    const targetDate = new Date();
    const daysToAdd = projectNeed.urgency === "urgente_24h" ? 1 : 2;
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const concreteEstimatedDate = getEstimatedDateString();

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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-[#00A896]">
            Paso 4 de 6
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-500">Abastecimiento y despacho</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
          Disponibilidad y método de entrega
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Coordinamos la preparación en planta de tinturado y la sede Pintuco más cercana en {projectNeed.city}.
        </p>
      </div>

      {/* Stock Traffic Light Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800">
                Disponibilidad inmediata de base y tinturado
              </span>
            </div>
            <h3 className="text-sm font-bold text-emerald-950 mt-0.5">
              Material listo para formulación: {projectNeed.selectedColor.name}
            </h3>
            <p className="text-xs text-emerald-800">
              {recommendation.calculation.recommendedFormat} de {recommendation.productName} · Entrega programable desde el <strong>{concreteEstimatedDate}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-white/80 px-3 py-2 rounded-lg border border-emerald-200 shrink-0">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Plazo: {projectNeed.urgency === "urgente_24h" ? "2 a 4 horas" : "24 a 48 horas"}</span>
        </div>
      </div>

      {/* Delivery Method Selector */}
      <div className="space-y-4 mb-8">
        <h2 className="text-base font-bold text-[#1C1917]">
          Selecciona cómo deseas recibir el pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Express Delivery */}
          <div
            onClick={() => setDeliveryMethod("domicilio_express")}
            className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
              deliveryMethod === "domicilio_express"
                ? "border-[#00A896] bg-[#00A896]/5 ring-1 ring-[#00A896] shadow-sm"
                : "border-[#E7E5E4] hover:border-stone-300 bg-white"
            }`}
            id="opt-delivery-express"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-stone-100 text-[#001D40] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#00A896]" />
                </div>
                {deliveryMethod === "domicilio_express" && (
                  <CheckCircle2 className="w-5 h-5 text-[#00A896]" />
                )}
              </div>
              <h3 className="font-bold text-sm text-[#1C1917]">
                Despacho directo a la obra o domicilio
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Entrega técnica protegida hasta la puerta de tu espacio en {projectNeed.city}.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400">Costo de envío:</span>
              <span className="font-semibold text-emerald-700">Gratis por ColorLink</span>
            </div>
          </div>

          {/* Option 2: Store Pickup */}
          <div
            onClick={() => setDeliveryMethod("retiro_tienda")}
            className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
              deliveryMethod === "retiro_tienda"
                ? "border-[#00A896] bg-[#00A896]/5 ring-1 ring-[#00A896] shadow-sm"
                : "border-[#E7E5E4] hover:border-stone-300 bg-white"
            }`}
            id="opt-delivery-pickup"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-stone-100 text-[#001D40] flex items-center justify-center">
                  <Store className="w-5 h-5 text-[#00A896]" />
                </div>
                {deliveryMethod === "retiro_tienda" && (
                  <CheckCircle2 className="w-5 h-5 text-[#00A896]" />
                )}
              </div>
              <h3 className="font-bold text-sm text-[#1C1917]">
                Retiro en tienda autorizada Pintuco
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Recoge en el mostrador cuando el tinturado esté listo, sin filas ni esperas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400">Sedes disponibles:</span>
              <span className="font-semibold text-[#001D40]">{displayStores.length} tiendas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store list if pickup selected */}
      {deliveryMethod === "retiro_tienda" && (
        <div className="bg-white rounded-xl border border-[#E7E5E4] p-5 shadow-sm mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C1917]">
              Selecciona la sede de retiro
            </h3>
            <span className="text-xs text-stone-400">
              Ordenadas por cercanía a {projectNeed.city}
            </span>
          </div>

          <div className="space-y-2.5">
            {displayStores.map((store) => {
              const isSelected = selectedStoreId === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#00A896] bg-[#00A896]/5 ring-1 ring-[#00A896]"
                      : "border-[#E7E5E4] hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1917]">{store.name}</h4>
                      <p className="text-xs text-stone-500">{store.address} · {store.city}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Horario: {store.openingHours} · Tel: {store.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-[#001D40] block">
                      {store.distance}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      Stock confirmado
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-[#E7E5E4] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToTechnical}
          className="border border-stone-300 hover:bg-stone-50 text-[#001D40] font-medium px-5 py-2.5 rounded-lg transition inline-flex items-center gap-2 cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a formulación</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="bg-[#00A896] hover:bg-[#009282] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition inline-flex items-center gap-2 cursor-pointer text-sm"
          id="btn-proceed-service"
        >
          <span>Continuar a servicio y agendamiento</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
