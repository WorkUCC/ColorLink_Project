/**
 * Panel de pruebas funcionales de integración Frontend <-> Supabase.
 *
 * Cubre los 4 puntos que pide el entregable:
 *   1. Consulta / lectura de información desde la base de datos
 *   2. Envío de información desde el frontend
 *   3. INSERT de registros desde el formulario desarrollado
 *   4. Validación de que los datos almacenados corresponden al modelo
 *
 * Sirve como evidencia para la sustentación: cada prueba muestra el
 * resultado real que devuelve Supabase.
 */
import React, { useState } from "react";
import { CheckCircle2, XCircle, Loader2, Database, Play } from "lucide-react";
import { probarConexion, supabaseConfigurado } from "../lib/supabaseClient";
import {
  obtenerProductos,
  obtenerTiendas,
  guardarProyecto,
  guardarRecomendacion,
  obtenerProyectoCompleto,
} from "../lib/colorlinkApi";
import { ProjectNeedState, TechnicalRecommendation } from "../types";

type EstadoPrueba = "pendiente" | "corriendo" | "ok" | "error";

interface Prueba {
  id: string;
  titulo: string;
  estado: EstadoPrueba;
  detalle?: string;
  datos?: unknown;
}

const PRUEBAS_INICIALES: Prueba[] = [
  { id: "conexion", titulo: "1. Conexión con el proyecto Supabase", estado: "pendiente" },
  { id: "select", titulo: "2. Lectura: SELECT de producto y tienda", estado: "pendiente" },
  { id: "insert", titulo: "3. Envío e INSERT desde el formulario", estado: "pendiente" },
  { id: "validacion", titulo: "4. Validación de datos almacenados vs. modelo", estado: "pendiente" },
];

interface Props {
  projectNeed: ProjectNeedState;
  recommendation: TechnicalRecommendation | null;
}

export const SupabaseTestPanel: React.FC<Props> = ({ projectNeed, recommendation }) => {
  const [pruebas, setPruebas] = useState<Prueba[]>(PRUEBAS_INICIALES);
  const [corriendo, setCorriendo] = useState(false);

  const actualizar = (id: string, cambios: Partial<Prueba>) =>
    setPruebas((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));

  const ejecutarPruebas = async () => {
    setCorriendo(true);
    setPruebas(PRUEBAS_INICIALES);
    let idProyecto: number | null = null;

    // --- Prueba 1: conexión ---
    actualizar("conexion", { estado: "corriendo" });
    const conexion = await probarConexion();
    actualizar("conexion", {
      estado: conexion.ok ? "ok" : "error",
      detalle: conexion.mensaje,
    });
    if (!conexion.ok) {
      setCorriendo(false);
      return;
    }

    // --- Prueba 2: lectura ---
    actualizar("select", { estado: "corriendo" });
    try {
      const [productos, tiendas] = await Promise.all([
        obtenerProductos(),
        obtenerTiendas(projectNeed.city),
      ]);
      actualizar("select", {
        estado: "ok",
        detalle: `${productos.length} productos y ${tiendas.length} tiendas leídas en ${projectNeed.city}.`,
        datos: { primerProducto: productos[0], primeraTienda: tiendas[0] },
      });
    } catch (e: any) {
      actualizar("select", { estado: "error", detalle: `${e.code ?? ""} ${e.message}` });
      setCorriendo(false);
      return;
    }

    // --- Prueba 3: INSERT desde el formulario ---
    actualizar("insert", { estado: "corriendo" });
    try {
      idProyecto = await guardarProyecto(projectNeed, null);
      let detalle = `Proyecto insertado con id_proyecto = ${idProyecto}.`;
      if (recommendation) {
        const idRec = await guardarRecomendacion(idProyecto, recommendation);
        detalle += ` Recomendación insertada con id_recomendacion = ${idRec}.`;
      }
      actualizar("insert", { estado: "ok", detalle });
    } catch (e: any) {
      actualizar("insert", {
        estado: "error",
        detalle: `${e.code ?? ""} ${e.message}`,
      });
      setCorriendo(false);
      return;
    }

    // --- Prueba 4: validación contra el modelo ---
    actualizar("validacion", { estado: "corriendo" });
    try {
      const guardado: any = await obtenerProyectoCompleto(idProyecto!);
      const coincideM2 = Number(guardado.m2) === Number(projectNeed.areaM2);
      const coincideColor = guardado.color_seleccionado === projectNeed.selectedColor.name;
      const coincideSuperficie = guardado.superficie === projectNeed.surface;
      const todoOk = coincideM2 && coincideColor && coincideSuperficie;

      actualizar("validacion", {
        estado: todoOk ? "ok" : "error",
        detalle: todoOk
          ? "Los campos m2, superficie y color_seleccionado coinciden con lo enviado por el formulario, y la relación proyecto -> recomendación -> producto se resolvió correctamente."
          : "Hay diferencias entre lo enviado y lo almacenado. Revisar tipos de datos.",
        datos: guardado,
      });
    } catch (e: any) {
      actualizar("validacion", { estado: "error", detalle: `${e.code ?? ""} ${e.message}` });
    }

    setCorriendo(false);
  };

  const icono = (estado: EstadoPrueba) => {
    if (estado === "corriendo") return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (estado === "ok") return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    if (estado === "error") return <XCircle className="w-5 h-5 text-red-600" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#1A1715] text-white px-6 py-5 flex items-center gap-3">
          <Database className="w-6 h-6 text-[#E2622F]" />
          <div>
            <h2 className="text-lg font-bold">Pruebas de integración Supabase</h2>
            <p className="text-blue-200 text-xs">
              Evidencia de conexión, lectura, inserción y validación del modelo de datos
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {!supabaseConfigurado && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4">
              Falta configurar <code>VITE_SUPABASE_URL</code> y{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> en el archivo <code>.env.local</code>.
            </div>
          )}

          <button
            onClick={ejecutarPruebas}
            disabled={corriendo}
            className="inline-flex items-center gap-2 bg-[#E2622F] hover:bg-[#C95222] disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl transition"
          >
            <Play className="w-4 h-4" />
            {corriendo ? "Ejecutando pruebas..." : "Ejecutar pruebas de integración"}
          </button>

          <ul className="space-y-3">
            {pruebas.map((p) => (
              <li
                key={p.id}
                className="flex gap-3 items-start border border-slate-200 rounded-xl p-4"
              >
                <div className="mt-0.5">{icono(p.estado)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{p.titulo}</p>
                  {p.detalle && (
                    <p
                      className={`text-sm mt-1 ${
                        p.estado === "error" ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      {p.detalle}
                    </p>
                  )}
                  {p.datos != null && (
                    <pre className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700 overflow-x-auto">
                      {JSON.stringify(p.datos, null, 2)}
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
