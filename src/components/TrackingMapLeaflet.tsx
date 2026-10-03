import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import {
  Truck,
  Store,
  MapPin,
  Phone,
  Clock,
  Layers,
  Globe2,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { TiendaDB } from "../lib/colorlinkApi";
import { GeocodeResult } from "../lib/geocodingService";

// Helper para ajustar encuadre (fitBounds) con animación suave
const FitBoundsHelper: React.FC<{ bounds: L.LatLngBoundsExpression | null }> = ({
  bounds,
}) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [map, bounds]);
  return null;
};

// Helper para refrescar el tamaño del contenedor cuando cambia de pestaña
const ResizeHelper: React.FC<{ triggerKey: string }> = ({ triggerKey }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, triggerKey]);
  return null;
};

// DivIcons personalizados de alta definición
const createStoreDivIcon = (nombre: string) =>
  L.divIcon({
    className: "pintuco-store-pin",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        <div style="background-color:#1A1715; color:#FFFFFF; border:2px solid #E2622F; border-radius:6px; padding:3px 7px; font-weight:700; font-size:10px; font-family:sans-serif; box-shadow:0 3px 8px rgba(0,0,0,0.35); display:flex; align-items:center; gap:4px; white-space:nowrap;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#E2622F;"></span>
          ${nombre.length > 24 ? nombre.substring(0, 22) + "..." : nombre}
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #1A1715; margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [130, 32],
    iconAnchor: [65, 32],
    popupAnchor: [0, -32],
  });

const createDeliveryDivIcon = (direccion: string) =>
  L.divIcon({
    className: "pintuco-delivery-pin",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        <div style="background-color:#E2622F; color:#FFFFFF; border:2px solid #FFFFFF; border-radius:6px; padding:3px 7px; font-weight:700; font-size:10px; font-family:sans-serif; box-shadow:0 3px 8px rgba(0,0,0,0.35); display:flex; align-items:center; gap:4px; white-space:nowrap;">
          <span>📍</span>
          Destino: ${direccion.length > 20 ? direccion.substring(0, 18) + "..." : direccion}
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #E2622F; margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [140, 32],
    iconAnchor: [70, 32],
    popupAnchor: [0, -32],
  });

const createTruckDivIcon = () =>
  L.divIcon({
    className: "pintuco-truck-pin",
    html: `
      <div style="background-color:#E2622F; border:2px solid #FFFFFF; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(0,168,150,0.8); font-size:14px; cursor:pointer;">
        🚚
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const createNetworkStoreDivIcon = (tienda: TiendaDB) =>
  L.divIcon({
    className: "pintuco-network-pin",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;" title="${tienda.nombre}">
        <div style="background-color:#1A1715; color:#E2622F; border:2px solid #E2622F; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.3); font-size:12px;">
          🏢
        </div>
        <div style="width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid #1A1715; margin-top:-1px;"></div>
      </div>
    `,
    iconSize: [26, 31],
    iconAnchor: [13, 31],
    popupAnchor: [0, -31],
  });

interface TrackingMapLeafletProps {
  tiendaAsignada: TiendaDB;
  todasLasTiendas: TiendaDB[];
  ubicacionCliente: GeocodeResult;
  direccionTexto: string;
  ciudadTexto: string;
  tiempoRestanteMin: number;
  pasoActualIndex: number;
}

export const TrackingMapLeaflet: React.FC<TrackingMapLeafletProps> = ({
  tiendaAsignada,
  todasLasTiendas,
  ubicacionCliente,
  direccionTexto,
  ciudadTexto,
  tiempoRestanteMin,
  pasoActualIndex,
}) => {
  const [tabActiva, setTabActiva] = useState<"ruta" | "nacional">("ruta");

  // Coordenadas válidas de la tienda asignada
  const storeLat = tiendaAsignada.latitud || 4.6896;
  const storeLng = tiendaAsignada.longitud || -74.0862;
  const storePos: [number, number] = [storeLat, storeLng];

  // Coordenadas del cliente
  const clientPos: [number, number] = [
    ubicacionCliente.lat,
    ubicacionCliente.lng,
  ];

  // Posición simulada del vehículo según el paso
  const truckPos: [number, number] = useMemo(() => {
    if (pasoActualIndex <= 2) return storePos;
    if (pasoActualIndex === 3) {
      // 50% de la ruta
      return [
        storePos[0] + (clientPos[0] - storePos[0]) * 0.55,
        storePos[1] + (clientPos[1] - storePos[1]) * 0.55,
      ];
    }
    if (pasoActualIndex === 4) {
      // 90% de la ruta
      return [
        storePos[0] + (clientPos[0] - storePos[0]) * 0.92,
        storePos[1] + (clientPos[1] - storePos[1]) * 0.92,
      ];
    }
    return clientPos;
  }, [pasoActualIndex, storePos, clientPos]);

  // Línea de ruta entre la tienda y el cliente
  const routePolyline: [number, number][] = useMemo(() => {
    return [storePos, truckPos, clientPos];
  }, [storePos, truckPos, clientPos]);

  // Límites para encuadre automático
  const routeBounds: L.LatLngBoundsExpression = useMemo(() => {
    return L.latLngBounds([storePos, clientPos]);
  }, [storePos, clientPos]);

  // Centro de Colombia para la vista nacional
  const colombiaCenter: [number, number] = [4.5709, -74.2973];

  return (
    <div className="bg-[#1A1715] rounded-xl overflow-hidden shadow-sm border border-stone-800 flex flex-col justify-between">
      {/* Barra superior del mapa con pestañas: Ruta actual vs Red Nacional */}
      <div className="bg-[#00142C] px-3.5 py-2.5 flex items-center justify-between border-b border-stone-800 flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setTabActiva("ruta")}
            className={`px-3 py-1.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              tabActiva === "ruta"
                ? "bg-[#E2622F] text-white shadow-xs"
                : "text-stone-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Ruta de tu despacho</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActiva("nacional")}
            className={`px-3 py-1.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              tabActiva === "nacional"
                ? "bg-[#E2622F] text-white shadow-xs"
                : "text-stone-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Ver red de tiendas a nivel nacional ({todasLasTiendas.length})</span>
          </button>
        </div>

        {tabActiva === "ruta" && (
          <div className="text-[11px] text-stone-300 hidden sm:flex items-center gap-2">
            <span className="text-[#E2622F] font-semibold">
              {ubicacionCliente.source === "nominatim"
                ? "✓ Geocodificación exacta OSM"
                : "◎ Ubicación aproximada"}
            </span>
          </div>
        )}
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-900 overflow-hidden">
        {tabActiva === "ruta" ? (
          <MapContainer
            center={storePos}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            {/* Capa de OpenStreetMap con atribución obligatoria */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            <FitBoundsHelper bounds={routeBounds} />
            <ResizeHelper triggerKey="ruta" />

            {/* Marcador de la TIENDA asignada */}
            <Marker position={storePos} icon={createStoreDivIcon(tiendaAsignada.nombre)}>
              <Popup>
                <div className="p-1 text-slate-900 text-xs">
                  <p className="font-bold text-[#1A1715] text-sm mb-1">{tiendaAsignada.nombre}</p>
                  <p className="text-slate-600 mb-0.5">{tiendaAsignada.direccion}</p>
                  <p className="text-slate-500 mb-1">{tiendaAsignada.ciudad}</p>
                  <p className="text-[#E2622F] font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {tiendaAsignada.telefono}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[10px] text-emerald-700 font-semibold">
                    ✓ Sede de tinturado y preparación asignada
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Marcador de la ENTREGA del cliente */}
            <Marker position={clientPos} icon={createDeliveryDivIcon(direccionTexto)}>
              <Popup>
                <div className="p-1 text-slate-900 text-xs">
                  <p className="font-bold text-[#E2622F] text-sm mb-1">Destino de entrega</p>
                  <p className="text-slate-700 font-medium mb-0.5">{direccionTexto || "Dirección de obra"}</p>
                  <p className="text-slate-500 mb-1">{ciudadTexto}</p>
                  <p className="text-[11px] text-slate-500">
                    {ubicacionCliente.source === "nominatim"
                      ? "Geocodificado con OpenStreetMap Nominatim"
                      : "Punto de referencia urbano"}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Móvil en ruta si va avanzando */}
            {pasoActualIndex >= 3 && pasoActualIndex < 5 && (
              <Marker position={truckPos} icon={createTruckDivIcon()}>
                <Popup>
                  <div className="p-1 text-slate-900 text-xs">
                    <p className="font-bold text-[#1A1715]">Móvil Logístico Pintuco</p>
                    <p className="text-slate-600">En ruta hacia tu dirección</p>
                    <p className="text-[#E2622F] font-bold mt-1">
                      {tiempoRestanteMin} min restantes
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Línea Polyline en color teal (#E2622F) conectando ambos puntos */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: "#E2622F",
                weight: 5,
                opacity: 0.85,
                dashArray: "8 8",
              }}
            />
          </MapContainer>
        ) : (
          /* Vista: Red de tiendas a nivel nacional */
          <MapContainer
            center={colombiaCenter}
            zoom={6}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={18}
            />

            <ResizeHelper triggerKey="nacional" />

            {todasLasTiendas.map((t) => {
              const lat = t.latitud || 4.6896;
              const lng = t.longitud || -74.0862;
              const isAssigned = t.id_tienda === tiendaAsignada.id_tienda;

              return (
                <Marker
                  key={t.id_tienda}
                  position={[lat, lng]}
                  icon={
                    isAssigned
                      ? createStoreDivIcon(t.nombre)
                      : createNetworkStoreDivIcon(t)
                  }
                >
                  <Popup>
                    <div className="p-1 text-slate-900 text-xs">
                      <p className="font-bold text-[#1A1715] text-sm mb-1">{t.nombre}</p>
                      <p className="text-slate-700 font-medium">{t.ciudad}</p>
                      <p className="text-slate-600 mb-1">{t.direccion}</p>
                      <p className="text-[#E2622F] font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {t.telefono}
                      </p>
                      {isAssigned && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-white bg-[#E2622F] px-1.5 py-0.5 rounded">
                          Sede asignada a tu pedido
                        </span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}

        {/* Tarjeta flotante en esquina: resumen de despacho */}
        {tabActiva === "ruta" && (
          <div className="absolute top-3 left-3 z-[400] bg-[#1A1715]/90 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-white/20 text-white text-xs shadow-md max-w-[260px] pointer-events-none">
            <span className="text-[10px] text-[#E2622F] font-bold uppercase tracking-wider block">
              Despacho Pintuco
            </span>
            <span className="font-bold block truncate">{tiendaAsignada.nombre}</span>
            <span className="text-[11px] text-stone-300 block truncate">
              → {direccionTexto || "Dirección del proyecto"}
            </span>
          </div>
        )}

        {/* Tarjeta flotante en esquina: tiempo estimado */}
        {tabActiva === "ruta" && (
          <div className="absolute bottom-6 left-3 z-[400] bg-slate-950/85 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-white text-xs shadow-md pointer-events-none">
            <span className="text-[10px] text-stone-400 block uppercase font-medium">
              Tiempo estimado
            </span>
            <span className="text-xs font-bold text-[#E2622F]">
              {pasoActualIndex >= 4
                ? "En sitio · En aplicación"
                : `${tiempoRestanteMin} min restantes`}
            </span>
          </div>
        )}
      </div>

      {/* Pie inferior informativo */}
      <div className="p-3 bg-slate-950 text-xs text-stone-300 flex flex-wrap items-center justify-between border-t border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#E2622F] shrink-0" />
          <span className="text-xs">
            {tabActiva === "ruta"
              ? `Ruta oficial con sede ${tiendaAsignada.nombre}`
              : `Red de tiendas autorizadas Pintuco en Colombia (${todasLasTiendas.length} sedes)`}
          </span>
        </div>
        <div className="text-[11px] text-stone-400">
          OpenStreetMap & Leaflet · Sin cargos de API
        </div>
      </div>
    </div>
  );
};
