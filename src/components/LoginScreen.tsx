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
} from "lucide-react";
import { UserProfile, CustomerType } from "../types";
import { COLOMBIAN_CITIES } from "../data/pintucoData";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
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
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
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

            {/* Feature pillars */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Diagnóstico Técnico Inteligente</h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Recomendamos el producto exacto (Koraza®, Viniltex®, Aquaprotec®) según tu problema real de humedad, sol o desgaste.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Abastecimiento en Tiempo Real</h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Inventario conectado con tinturado de fábrica y despacho express en 2 a 4 horas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#00A896]/30 text-[#00E5C9] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aplicadores Certificados & Póliza 360</h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Maestros evaluados con antecedentes y ARL + certificado de garantía descargable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick preset selector box */}
          <div className="relative z-10 bg-black/20 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-blue-200 font-semibold block mb-2">
              Prueba un perfil rápido con 1 clic:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo("hogar")}
                className={`p-2 rounded-lg border text-center transition-all ${
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
                className={`p-2 rounded-lg border text-center transition-all ${
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
                className={`p-2 rounded-lg border text-center transition-all ${
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

        {/* Right column: Interactive login form */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-center">
          {/* Tabs: Iniciar / Registro */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`pb-3 font-bold text-sm transition-colors border-b-2 mr-6 ${
                !isRegister
                  ? "border-[#002D62] text-[#002D62]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
              id="tab-login"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
                isRegister
                  ? "border-[#002D62] text-[#002D62]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
              id="tab-register"
            >
              Crear Cuenta ColorLink
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {isRegister ? "Registra tu proyecto" : "Bienvenido a ColorLink"}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isRegister
                ? "Cuéntanos tus datos para personalizar tus recomendaciones técnicas."
                : "Ingresa para continuar con tu cotización, pedido o seguimiento de obra."}
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
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
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
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
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
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
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
              className="w-full mt-4 bg-[#002D62] hover:bg-[#003882] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
              id="btn-submit-auth"
            >
              <span>{isRegister ? "Crear Cuenta y Empezar" : "Ingresar a ColorLink"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Social login simulation */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                O continúa con
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                onLoginSuccess({
                  name: "Usuario Google Verificado",
                  email: "usuario.google@pintuco.com",
                  phone: "+57 312 000 9988",
                  type: customerType,
                  city: city,
                  address: address,
                });
              }}
              className="w-full mt-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              id="btn-google-login"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
