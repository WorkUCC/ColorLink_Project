import React from "react";
import {
  Paintbrush,
  ShieldCheck,
  PhoneCall,
  User,
  Sparkles,
  Layers,
  Truck,
  Award,
  CheckCircle2,
} from "lucide-react";
import { UserProfile, ProjectNeedState } from "../types";
import { DEMO_PRESETS } from "../data/pintucoData";

interface HeaderProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onLoadPreset: (preset: typeof DEMO_PRESETS[0]) => void;
  projectNeed: ProjectNeedState;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateStep,
  user,
  onLogout,
  onLoadPreset,
}) => {
  const steps = [
    { num: 1, label: "Acceso / Clientes", icon: User },
    { num: 2, label: "Diagnóstico", icon: Layers },
    { num: 3, label: "Solución IA", icon: Sparkles },
    { num: 4, label: "Disponibilidad", icon: Truck },
    { num: 5, label: "Servicio & Tracking", icon: Paintbrush },
    { num: 6, label: "Garantía 360", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#002D62] text-white border-b border-blue-900 shadow-md">
      {/* Top micro bar */}
      <div className="bg-[#001D40] px-4 py-1 text-xs text-blue-200 border-b border-blue-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[#00A896]/20 text-[#00E5C9] font-medium px-2 py-0.5 rounded-full text-[11px] border border-[#00A896]/40">
            <ShieldCheck className="w-3.5 h-3.5" /> Ecosistema Oficial Pintuco
          </span>
          <span className="hidden sm:inline text-blue-300">
            Diagnóstico técnico • Abastecimiento inteligente • Aplicadores certificados
          </span>
        </div>

        {/* Quick Demo Preset Selector for fast evaluation */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-blue-300 hidden md:inline">Cargar caso demo:</span>
          <div className="flex items-center gap-1">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onLoadPreset(preset)}
                className="text-[11px] bg-blue-900/80 hover:bg-[#00A896] hover:text-white text-blue-100 px-2 py-0.5 rounded transition-colors border border-blue-800 cursor-pointer"
                title={preset.subtitle}
              >
                {idx === 0 ? "Fachada Bogotá" : idx === 1 ? "Interior Medellín" : "Piso Cali"}
              </button>
            ))}
          </div>

          <a
            href="tel:018000111404"
            className="hidden lg:flex items-center gap-1 text-blue-200 hover:text-white ml-2 text-[11px]"
          >
            <PhoneCall className="w-3 h-3 text-[#00E5C9]" /> Línea Técnica: 018000 111 404
          </a>
        </div>
      </div>

      {/* Main navigation & brand bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigateStep(2)}
          className="flex items-center gap-3 cursor-pointer group"
          id="btn-brand-home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A896] to-[#00E5C9] flex items-center justify-center shadow-lg shadow-[#00A896]/30 text-[#002D62] font-black tracking-tight group-hover:scale-105 transition-transform">
            <Paintbrush className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">ColorLink</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-1.5 py-0.5 rounded text-blue-100">
                by Pintuco
              </span>
            </div>
            <p className="text-[11px] text-blue-200 font-medium tracking-wide">
              Solución Técnica, Servicio y Calidad Integrada
            </p>
          </div>
        </div>

        {/* User status & role pill */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* VIP Member Discount Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cliente VIP: 15% DCTO Activo</span>
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-[#00E5C9] font-medium capitalize">
                {user.type === "hogar"
                  ? "Cliente Hogar"
                  : user.type === "contratista"
                  ? "Maestro / Contratista"
                  : "Cliente Corporativo"} • {user.city.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium transition-colors border border-white/10 cursor-pointer"
              id="btn-logout"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free guest badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/20 text-[#00E5C9] text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Modo Visitante</span>
            </div>

            {/* Single clean Iniciar Sesión button */}
            <button
              onClick={() => onNavigateStep(1)}
              className="bg-[#00A896] hover:bg-[#009282] text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              id="btn-login-header"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Process Progress Stepper */}
      <div className="bg-[#00244F] border-t border-blue-900/60 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[620px] gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.num;
            const isPassed = currentStep > step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => onNavigateStep(step.num)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#00A896] text-white shadow-md shadow-[#00A896]/30 font-semibold"
                      : isPassed
                      ? "text-blue-100 hover:bg-white/10 hover:text-white"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                  id={`step-nav-${step.num}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#002D62]"
                        : isPassed
                        ? "bg-[#00E5C9]/20 text-[#00E5C9]"
                        : "bg-blue-900 text-blue-200"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span className="flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                    {step.label}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] min-w-[16px] rounded ${
                      currentStep > step.num ? "bg-[#00A896]" : "bg-blue-900"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
