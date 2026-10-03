import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Check,
  Home,
  Briefcase,
  Building2,
  Lock,
  Mail,
  User,
  MapPin,
  Sparkles,
} from "lucide-react";
import { UserProfile, CustomerType } from "../types";
import { COLOMBIAN_CITIES } from "../data/pintucoData";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  segmentoElegido?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  segmentoElegido,
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

  // Pre-cargar perfil si hay un segmento profesional activo
  useEffect(() => {
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

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    onClose();
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
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E2622F] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Acceso oficial ColorLink by Pintuco</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#2B211C]">
          {isRegister ? "Crear cuenta de cliente" : "Iniciar sesión en mi cuenta"}
        </h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          {isRegister
            ? "Regístrate para guardar fórmulas de color, órdenes y acceder al 15% de descuento VIP."
            : "Accede para consultar tus cotizaciones vigentes, histórico y garantías de fábrica."}
        </p>

        {/* Tabs: Login / Registro */}
        <div className="flex border-b border-stone-200 mb-5">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`pb-2.5 font-semibold text-xs transition-colors border-b-2 mr-6 cursor-pointer ${
              !isRegister
                ? "border-[#1A1715] text-[#1A1715]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Clientes registrados
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`pb-2.5 font-semibold text-xs transition-colors border-b-2 cursor-pointer ${
              isRegister
                ? "border-[#1A1715] text-[#1A1715]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Crear cuenta nueva
          </button>
        </div>

        {/* Selector de tipo de cliente */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Tipo de perfil
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCustomerType("hogar")}
              className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                customerType === "hogar"
                  ? "border-[#E2622F] bg-[#E2622F]/5 text-[#1A1715] font-semibold"
                  : "border-stone-200 text-stone-600 hover:border-stone-300 bg-white"
              }`}
            >
              <Home className="w-4 h-4 text-[#E2622F]" />
              <span>Hogar</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomerType("contratista")}
              className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                customerType === "contratista"
                  ? "border-[#E2622F] bg-[#E2622F]/5 text-[#1A1715] font-semibold"
                  : "border-stone-200 text-stone-600 hover:border-stone-300 bg-white"
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#E2622F]" />
              <span>Contratista</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomerType("empresa")}
              className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                customerType === "empresa"
                  ? "border-[#E2622F] bg-[#E2622F]/5 text-[#1A1715] font-semibold"
                  : "border-stone-200 text-stone-600 hover:border-stone-300 bg-white"
              }`}
            >
              <Building2 className="w-4 h-4 text-[#E2622F]" />
              <span>Empresa</span>
            </button>
          </div>
        </div>

        {/* Demo rápido con un clic */}
        <div className="mb-5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
            Rellenar perfil demo para prueba rápida:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("hogar")}
              className="text-[11px] px-2.5 py-1 rounded bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
            >
              Hogar
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("contratista")}
              className="text-[11px] px-2.5 py-1 rounded bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
            >
              Contratista
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("empresa")}
              className="text-[11px] px-2.5 py-1 rounded bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
            >
              Empresa
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                placeholder="Ej: Carolina Gómez"
              />
            </div>
          )}

          {customerType !== "hogar" && isRegister && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Razón Social / Empresa
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                placeholder="Ej: Morales Obras S.A.S."
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                placeholder="tu.correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Ciudad
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] bg-white text-[#2B211C]"
                >
                  {COLOMBIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                  placeholder="+57 312..."
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#E2622F] hover:bg-[#C95222] text-white font-semibold py-2.5 rounded-lg transition shadow-sm cursor-pointer text-sm"
            >
              {isRegister ? "Crear cuenta y continuar" : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
