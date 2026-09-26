import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Award,
  ArrowRight,
  Home,
  Briefcase,
  Building2,
  Lock,
  Mail,
  MapPin,
  Check,
  Eye,
} from "lucide-react";
import { UserProfile, CustomerType } from "../types";
import { COLOMBIAN_CITIES } from "../data/pintucoData";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
  segmentoElegido?: string | null;
  onCambiarSegmento?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  segmentoElegido,
  onCambiarSegmento,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [customerType, setCustomerType] = useState<CustomerType>("hogar");
  const [email, setEmail] = useState("cliente.hogar@ejemplo.com");
  const [password, setPassword] = useState("Pintuco2026*");
  const [name, setName] = useState("Carolina Gómez");
  const [city, setCity] = useState("Bogotá D.C.");
  const [address, setAddress] = useState("Calle 134 # 19-45, Cedritos");
  const [phone, setPhone] = useState("+57 310 987 6543");
  const [companyName, setCompanyName] = useState("Constructora & Diseños S.A.S.");

  // Ajustar perfil sugerido si el usuario eligió un segmento en la barra de navegación
  React.useEffect(() => {
    if (segmentoElegido) {
      if (segmentoElegido === "Contratistas y Maestros") {
        setCustomerType("contratista");
        setName("Arq. Santiago Morales");
        setEmail("smorales.obras@gmail.com");
        setCompanyName("Morales & Asociados Obras");
      } else if (segmentoElegido === "Diseñadores y Arquitectos") {
        setCustomerType("contratista");
        setName("Diseñadora Mariana Varela");
        setEmail("m.varela.estudio@gmail.com");
        setCompanyName("Varela Studio Arquitectura");
      } else if (segmentoElegido === "Fachadas y PH") {
        setCustomerType("empresa");
        setName("Administración Torres del Parque PH");
        setEmail("administracion@torresdelparque.com");
        setCompanyName("Copropiedad Torres del Parque PH");
      }
    }
  }, [segmentoElegido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name: name || (customerType === "hogar" ? "Carolina Gómez" : "Santiago Morales"),
      email: email || "usuario@colorlink.pintuco.com",
      phone: phone || "+57 310 987 6543",
      type: customerType,
      city: city || "Bogotá D.C.",
      address: address || "Calle 134 # 19-45",
      companyName: customerType !== "hogar" ? companyName : undefined,
    };
    onLoginSuccess(profile);
  };

  const handleQuickDemo = (type: CustomerType) => {
    setCustomerType(type);
    if (type === "hogar") {
      setName("Familia Gómez Restrepo");
      setEmail("familia.gomez@gmail.com");
      setCity("Bogotá D.C.");
      setAddress("Calle 134 # 19-45, Cedritos");
    } else if (type === "contratista") {
      setName("Arq. Santiago Morales");
      setEmail("smorales.obras@gmail.com");
      setCity("Medellín (Antioquia)");
      setAddress("Cra. 43A # 18 Sur-30, El Poblado");
      setCompanyName("Morales & Asociados Obras");
    } else {
      setName("Ing. Valentina Pineda");
      setEmail("mantenimiento@inmobiliariapintuco.co");
      setCity("Cali (Valle)");
      setAddress("Av. Roosevelt # 34-12");
      setCompanyName("Gestión de Inmuebles Valle S.A.S.");
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Chip de Sesión o Contexto Profesional Elegido */}
      {segmentoElegido && (
        <div className="bg-teal-50/90 border border-[#00A896]/30 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A896] animate-pulse" />
            <span className="text-xs font-extrabold text-[#001D40]">
              Sesión: <span className="text-[#00A896]">{segmentoElegido}</span>
            </span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              · Configuración personalizada para tu perfil profesional
            </span>
          </div>
          {onCambiarSegmento && (
            <button
              type="button"
              onClick={onCambiarSegmento}
              className="text-xs font-bold text-[#001D40] hover:text-[#00A896] underline cursor-pointer"
            >
              Cambiar
            </button>
          )}
        </div>
      )}

      {/* Zero Friction Guest Option */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#00A896] border border-teal-100 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#00A896]">
                Acceso libre para cotizar
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">Sin registro obligatorio</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917] mt-0.5">
              ¿Deseas calcular metros y simular color antes de registrarte?
            </p>
            <p className="text-xs text-stone-500">
              Puedes continuar directo al asistente. Solo pediremos tus datos si agendas entrega o pintor.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinueAsGuest}
          className="w-full sm:w-auto border border-stone-300 hover:bg-stone-50 text-[#001D40] font-medium px-5 py-2.5 rounded-lg transition inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer text-sm"
          id="btn-guest-explore-top"
        >
          <span>Continuar sin registrarme</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left column: Brand authority & benefits */}
        <div className="lg:col-span-6 bg-[#001D40] text-white p-8 sm:p-10 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#00A896] font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía oficial Pintuco · +80 años en Colombia</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-3">
              Solución técnica exacta para tu proyecto de pintura.
            </h1>

            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              Calcula galones sin desperdicio, recibe tinturado de precisión en tu tienda más cercana y contrata pintores certificados con respaldo de fábrica.
            </p>

            {/* Registered benefits list */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <span className="text-xs font-semibold text-stone-200 block mb-2.5">
                Ventajas al iniciar sesión con tu cuenta:
              </span>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00A896] shrink-0" />
                  <span>Tarifa preferencial con 15% de ahorro en galones y cuñetes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00A896] shrink-0" />
                  <span>Historial de fórmulas, códigos de color y metros cuadrados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00A896] shrink-0" />
                  <span>Emisión automática de póliza digital de garantía Pintuco 360</span>
                </li>
              </ul>
            </div>

            {/* Quick demo roles */}
            <div className="border-t border-white/10 pt-4">
              <span className="text-xs text-stone-400 block mb-2">
                O prueba con un perfil demostrativo prellenado:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("hogar")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer text-center ${
                    customerType === "hogar"
                      ? "bg-[#00A896] text-white border-[#00A896]"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  Hogar
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("contratista")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer text-center ${
                    customerType === "contratista"
                      ? "bg-[#00A896] text-white border-[#00A896]"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  Contratista
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("empresa")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer text-center ${
                    customerType === "empresa"
                      ? "bg-[#00A896] text-white border-[#00A896]"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  Empresa
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>Pintuco S.A.</span>
            <span>Atención técnica nacional</span>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E7E5E4]">
          {/* Segmented tabs */}
          <div className="flex border-b border-[#E7E5E4] mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 mr-6 cursor-pointer ${
                !isRegister
                  ? "border-[#001D40] text-[#001D40]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              id="tab-login"
            >
              Clientes registrados
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${
                isRegister
                  ? "border-[#001D40] text-[#001D40]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              id="tab-register"
            >
              Crear cuenta
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1C1917]">
              {isRegister ? "Crear cuenta de cliente" : "Ingresar a mi cuenta"}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isRegister
                ? "Guarda tus proyectos, órdenes y facturas para futuras compras."
                : "Accede para consultar cotizaciones vigentes y pólizas de garantía."}
            </p>
          </div>

          {/* Persona selector cards */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Tipo de cliente
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCustomerType("hogar")}
                className={`p-3 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  customerType === "hogar"
                    ? "border-[#00A896] bg-[#00A896]/5 text-[#001D40] font-semibold"
                    : "border-[#E7E5E4] text-stone-600 hover:border-stone-300 bg-white"
                }`}
              >
                <Home className="w-4 h-4 text-[#00A896]" />
                <span>Hogar</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("contratista")}
                className={`p-3 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  customerType === "contratista"
                    ? "border-[#00A896] bg-[#00A896]/5 text-[#001D40] font-semibold"
                    : "border-[#E7E5E4] text-stone-600 hover:border-stone-300 bg-white"
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#00A896]" />
                <span>Contratista</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("empresa")}
                className={`p-3 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  customerType === "empresa"
                    ? "border-[#00A896] bg-[#00A896]/5 text-[#001D40] font-semibold"
                    : "border-[#E7E5E4] text-stone-600 hover:border-stone-300 bg-white"
                }`}
              >
                <Building2 className="w-4 h-4 text-[#00A896]" />
                <span>Empresa</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  placeholder="Ej: Carolina Gómez"
                />
              </div>
            )}

            {customerType !== "hogar" && isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Razón social o empresa
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  placeholder="Ej: Constructora Andina S.A.S."
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  placeholder="nombre@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Ciudad principal
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  >
                    {COLOMBIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Dirección o barrio
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white text-[#1C1917]"
                  placeholder="Ej: Calle 134 # 19-45"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#00A896] hover:bg-[#009282] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition inline-flex items-center justify-center gap-2 cursor-pointer text-sm"
              id="btn-submit-auth"
            >
              <span>{isRegister ? "Crear cuenta y continuar" : "Iniciar sesión"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick guest reminder at bottom */}
          <div className="mt-6 pt-4 border-t border-[#E7E5E4] text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-stone-600 hover:text-[#001D40] font-medium transition cursor-pointer"
              id="btn-guest-explore-bottom"
            >
              Prefiero explorar primero sin registrarme →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
