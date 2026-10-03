import React from "react";
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Eye,
  User,
  Sparkles,
  Calculator,
  Paintbrush,
  Truck,
  Award,
} from "lucide-react";

interface LoginScreenProps {
  onContinueAsGuest: () => void;
  onOpenLoginModal: () => void;
  segmentoElegido?: string | null;
  onCambiarSegmento?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinueAsGuest,
  onOpenLoginModal,
  segmentoElegido,
  onCambiarSegmento,
}) => {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Chip de Sesión o Contexto Profesional Elegido */}
      {segmentoElegido && (
        <div className="bg-teal-50/90 border border-[#E2622F]/30 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2622F] animate-pulse" />
            <span className="text-xs font-extrabold text-[#1A1715]">
              Sesión: <span className="text-[#E2622F]">{segmentoElegido}</span>
            </span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              · Configuración personalizada para tu perfil profesional
            </span>
          </div>
          {onCambiarSegmento && (
            <button
              type="button"
              onClick={onCambiarSegmento}
              className="text-xs font-bold text-[#1A1715] hover:text-[#E2622F] underline cursor-pointer"
            >
              Cambiar
            </button>
          )}
        </div>
      )}

      {/* Tarjeta de bienvenida y selección de acceso */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-sm overflow-hidden mb-8">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-[#1A1715] to-[#0A2E5C] text-white">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#E2622F] bg-white/10 px-3 py-1 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Paso 1: Acceso y configuración de proyecto</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl leading-tight">
            Bienvenido a ColorLink by Pintuco
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Diagnostica tu superficie, simula colores oficiales en vivo, calcula galones exactos y recibe tinturado de fábrica con entrega prioritaria.
          </p>
        </div>

        {/* Las dos opciones limpias de acceso (sin formulario duplicado) */}
        <div className="p-6 sm:p-8 bg-stone-50 border-t border-[#E8DFD5] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: Modo Visitante (Principal) */}
          <div className="bg-white p-6 rounded-xl border-2 border-[#E2622F] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#E2622F] border border-teal-100 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E2622F]">
                Recomendado para explorar
              </span>
              <h2 className="text-lg font-bold text-[#2B211C] mt-1 mb-2">
                Modo Visitante (Sin registro)
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Cotiza libremente sin crear cuenta ni ingresar contraseñas. Puedes calcular metros cuadrados, probar el simulador de color y ver la formulación técnica de inmediato.
              </p>
            </div>

            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full bg-[#E2622F] hover:bg-[#C95222] text-white font-semibold py-3 px-5 rounded-lg transition inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
              id="btn-guest-explore-top"
            >
              <span>Comenzar en Modo Visitante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Opción 2: Clientes Registrados (Abre el modal de login) */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-[#1A1715] flex items-center justify-center mb-4">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Para usuarios frecuentes
              </span>
              <h2 className="text-lg font-bold text-[#2B211C] mt-1 mb-2">
                Iniciar sesión con mi cuenta
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Accede a tu historial de compras, fórmulas de tinturado guardadas, pólizas de garantía emitidas y activa tu <strong className="text-[#1A1715]">15% de ahorro VIP</strong> en galones y cuñetes.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLoginModal}
              className="w-full bg-white hover:bg-stone-50 text-[#1A1715] border border-stone-300 font-semibold py-3 px-5 rounded-lg transition inline-flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xs"
              id="btn-open-login-modal-step1"
            >
              <User className="w-4 h-4 text-[#E2622F]" />
              <span>Abrir ventana de inicio de sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Beneficios y Respaldo Oficial Pintuco */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#E2622F] flex items-center justify-center mb-3">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#2B211C] mb-1">Cálculo sin desperdicio</h3>
          <p className="text-xs text-stone-500">
            Algoritmo calibrado con rendimiento real por galón a dos manos según tu superficie.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#E2622F] flex items-center justify-center mb-3">
            <Paintbrush className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#2B211C] mb-1">Color computarizado</h3>
          <p className="text-xs text-stone-500">
            Tinturado oficial de fábrica conectado con las tiendas Pintuco más cercanas.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#E2622F] flex items-center justify-center mb-3">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#2B211C] mb-1">Garantía Pintuco 360</h3>
          <p className="text-xs text-stone-500">
            Emisión de póliza digital oficial al completar la aplicación con maestros certificados.
          </p>
        </div>
      </div>
    </div>
  );
};
