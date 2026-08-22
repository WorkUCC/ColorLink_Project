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
  UserCheck,
  HelpCircle,
} from "lucide-react";
import { UserProfile, CustomerType } from "../types";
import { COLOMBIAN_CITIES } from "../data/pintucoData";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
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
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        {/* Visitor Friendly Banner - Zero Friction Entry */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A896] text-white flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Acceso 100% Libre
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  • Sin necesidad de ingresar tus datos
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                ¿Solo estás visitando la página y viendo opciones?
              </p>
              <p className="text-xs text-slate-600">
                Puedes probar el simulador de color, calculadora de pintura y diagnóstico técnico sin registrarte.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full sm:w-auto bg-[#00A896] hover:bg-[#009282] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
            id="btn-guest-explore-top"
          >
            <span>Explorar sin registrarse</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left column: Value proposition & Pintuco trust */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#002D62] via-[#003882] to-[#0A2540] text-white p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden border border-blue-900">
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#00A896]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#00E5C9]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#00E5C9] text-xs font-semibold mb-6 border border-white/10">
                <ShieldCheck className="w-4 h-4" /> Plataforma Oficial de Pinturas Pintuco
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Pintar bien tu espacio nunca fue tan simple ni seguro.
              </h1>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8">
                ColorLink transforma lo que necesitas en una fórmula técnica exacta, disponibilidad garantizada en tienda o despacho, y aplicación certificada con póliza de garantía Pintuco.
              </p>

              {/* Exclusive Registered Member Perks Banner */}
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent p-4 rounded-xl border border-amber-400/30 mb-6">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Beneficios y Ofertas Exclusivas al Iniciar Sesión</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span><strong>15% DCTO</strong> en pinturas y tinturado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span><strong>Opciones personalizadas</strong> a tu espacio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span><strong>Historial técnico</strong> y colores guardados</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span><strong>Póliza digital 360</strong> con garantía directa</span>
                  </div>
                </div>
              </div>

              {/* Feature pillars */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Diagnóstico y Formulación a la Medida</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Recomendación exacta (Koraza®, Viniltex®, Aquaprotec®) según tu necesidad de humedad o clima.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Abastecimiento y Despacho Prioritario</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Inventario directo de planta con entrega express y tinturado de precisión.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Maestros Certificados & Póliza Pintuco</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Aplicadores calificados con ARL y certificado de garantía oficial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick preset selector box */}
            <div className="relative z-10 bg-black/20 p-4 rounded-xl border border-white/10">
              <span className="text-xs text-blue-200 font-semibold block mb-2">
                O ingresa con un usuario de prueba rápido:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("hogar")}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    customerType === "hogar"
                      ? "bg-[#00A896] text-white border-[#00A896] font-bold"
                      : "bg-white/5 text-blue-200 border-white/10 hover:bg-white/10"
                  }`}
                >
                  🏡 Hogar
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("contratista")}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    customerType === "contratista"
                      ? "bg-[#00A896] text-white border-[#00A896] font-bold"
                      : "bg-white/5 text-blue-200 border-white/10 hover:bg-white/10"
                  }`}
                >
                  👷 Contratista
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("empresa")}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    customerType === "empresa"
                      ? "bg-[#00A896] text-white border-[#00A896] font-bold"
                      : "bg-white/5 text-blue-200 border-white/10 hover:bg-white/10"
                  }`}
                >
                  🏢 Empresa
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Interactive login form for existing clients */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-center">
            {/* Tabs: Iniciar / Registro */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setIsRegister(false)}
                className={`pb-3 font-bold text-sm transition-colors border-b-2 mr-6 cursor-pointer ${
                  !isRegister
                    ? "border-[#002D62] text-[#002D62]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
                id="tab-login"
              >
                Clientes Registrados
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`pb-3 font-bold text-sm transition-colors border-b-2 cursor-pointer ${
                  isRegister
                    ? "border-[#002D62] text-[#002D62]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
                id="tab-register"
              >
                Crear Cuenta (Opcional)
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isRegister ? "Registra tu cuenta" : "Acceso para Clientes"}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {isRegister
                  ? "Crea una cuenta si deseas guardar tu historial de obras, facturación o proyectos recurrentes."
                  : "Ingresa con tu usuario para ver tus cotizaciones guardadas, pedidos anteriores y pólizas activas."}
              </p>
            </div>

            {/* Persona selector pills */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Tipo de Perfil
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerType("hogar")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    customerType === "hogar"
                      ? "bg-blue-50 border-[#002D62] text-[#002D62] shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" /> Hogar
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("contratista")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    customerType === "contratista"
                      ? "bg-blue-50 border-[#002D62] text-[#002D62] shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Contratista
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("empresa")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    customerType === "empresa"
                      ? "bg-blue-50 border-[#002D62] text-[#002D62] shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Empresa
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo o Contacto
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent bg-white"
                    placeholder="Ej: Carolina Gómez"
                  />
                </div>
              )}

              {customerType !== "hogar" && isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre de la Empresa o Razón Social
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent bg-white"
                    placeholder="Ej: Constructora Andina S.A.S."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent bg-white"
                    placeholder="nombre@correo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ciudad Principal
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white appearance-none"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dirección o Barrio
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-white"
                    placeholder="Ej: Calle 134 # 19-45"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#002D62] hover:bg-[#003882] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                id="btn-submit-auth"
              >
                <span>{isRegister ? "Crear Cuenta" : "Ingresar con mi Usuario"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Direct Guest Explorer Action at bottom */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-2">
                ¿No tienes cuenta y solo quieres cotizar o explorar?
              </p>
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full border-2 border-[#00A896] text-[#00A896] hover:bg-[#00A896] hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="btn-guest-explore-bottom"
              >
                <Eye className="w-4 h-4" />
                <span>Continuar como Visitante (Sin datos ni registro)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

