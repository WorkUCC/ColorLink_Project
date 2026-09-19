/**
 * Cliente único de Supabase para ColorLink by Pintuco.
 *
 * Las credenciales salen de variables de entorno. NUNCA se escriben
 * aquí directamente (la service_role key jamás debe llegar al frontend:
 * en el navegador solo va la clave anon/publishable).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Vite expone las variables con prefijo VITE_. El segundo valor es el
// respaldo por si AI Studio las inyecta como process.env (ver vite.config.ts).
const clean = (val: unknown): string => {
  if (!val || typeof val !== "string") return "";
  return val.trim().replace(/^["']+|["']+$/g, "").trim();
};

const rawUrl = clean(import.meta.env.VITE_SUPABASE_URL || (import.meta.env as any).SUPABASE_URL);
const rawKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).SUPABASE_ANON_KEY);

const isValidHttpUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isRealConfig =
  isValidHttpUrl(rawUrl) &&
  !rawUrl.includes("xxxxxxxxxxxxxxxx") &&
  !rawUrl.includes("placeholder.supabase.co") &&
  Boolean(rawKey) &&
  rawKey !== "placeholder";

export const supabaseConfigurado = isRealConfig;

const validUrl = isValidHttpUrl(rawUrl) ? rawUrl : "https://placeholder.supabase.co";
const validKey = rawKey || "placeholder-anon-key";

if (!supabaseConfigurado) {
  console.warn(
    "[Supabase] Credenciales no configuradas o en modo placeholder. " +
      "La app seguirá funcionando en modo demo sin persistencia."
  );
}

// Inicialización segura del cliente Supabase
export const supabase: SupabaseClient = (() => {
  try {
    return createClient(validUrl, validKey, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn("[Supabase] Advertencia al inicializar cliente:", err);
    return createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: { persistSession: false },
    });
  }
})();

/** Prueba de conexión: hace un SELECT liviano contra el catálogo. */
export async function probarConexion(): Promise<{ ok: boolean; mensaje: string }> {
  if (!supabaseConfigurado) {
    return { ok: false, mensaje: "Variables de entorno no configuradas (.env.local)" };
  }
  const { error, count } = await supabase
    .from("producto")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { ok: false, mensaje: `${error.code ?? "ERR"}: ${error.message}` };
  }
  return { ok: true, mensaje: `Conexión exitosa. Productos en catálogo: ${count ?? 0}` };
}
