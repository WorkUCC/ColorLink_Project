/**
 * Pantalla de login del administrador de ColorLink by Pintuco.
 * Se muestra cuando la URL incluye ?admin=1 (ver instrucciones de
 * integración en App.tsx, dentro del README de esta entrega).
 */
import React, { useState } from "react";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { verificarAdmin, AdministradorAuth } from "../lib/colorlinkApi";

interface Props {
  onLoginExitoso: (admin: AdministradorAuth) => void;
}

export const AdminLoginScreen: React.FC<Props> = ({ onLoginExitoso }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarIngreso = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const admin = await verificarAdmin(correo, contrasena);
      if (!admin) {
        setError("Correo o contraseña incorrectos.");
        return;
      }
      onLoginExitoso(admin);
    } catch (err: any) {
      setError(err.message ?? "No se pudo validar el acceso. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#1A1715] text-white px-6 py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E2622F]/20 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#E2622F]" />
            </div>
            <h1 className="text-xl font-bold">Panel de Administrador</h1>
            <p className="text-blue-200 text-sm">ColorLink by Pintuco</p>
          </div>

          <form onSubmit={manejarIngreso} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@pintuco.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E2622F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E2622F]"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#E2622F] hover:bg-[#C95222] disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl transition"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
          <p className="text-xs text-slate-600">
            Acceso de prueba: <span className="font-mono font-semibold text-slate-800">admin@pintuco.com</span> / <span className="font-mono font-semibold text-slate-800">pintuco2026</span>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          Acceso restringido — solo personal autorizado de Pintuco.
        </p>
      </div>
    </div>
  );
};
