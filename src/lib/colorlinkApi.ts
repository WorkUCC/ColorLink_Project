/**
 * Capa de acceso a datos de ColorLink by Pintuco.
 *
 * Traduce los tipos del frontend (src/types.ts) a las tablas del
 * modelo de datos en Supabase y viceversa.
 */
import { supabase } from "./supabaseClient";
import {
  UserProfile,
  ProjectNeedState,
  TechnicalRecommendation,
  OrderState,
} from "../types";

// ------------------------------------------------------------
// LECTURA (catálogos)
// ------------------------------------------------------------

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from("producto")
    .select("id_producto, nombre, tipo_sistema, precio_galon, anios_garantia")
    .order("nombre");
  if (error) throw error;
  return data;
}

export interface TiendaDB {
  id_tienda: number;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  stock_disponible?: boolean;
  latitud?: number | null;
  longitud?: number | null;
}

export const TIENDAS_FALLBACK: TiendaDB[] = [
  {
    id_tienda: 1,
    nombre: "Tienda Pintacasa Pintuco - Calle 80",
    ciudad: "Bogotá D.C.",
    direccion: "Calle 80 # 69-45, Ferias",
    telefono: "(601) 320 9000",
    stock_disponible: true,
    latitud: 4.6896,
    longitud: -74.0862,
  },
  {
    id_tienda: 2,
    nombre: "Centro de Experiencia Pintuco - Calle 134",
    ciudad: "Bogotá D.C.",
    direccion: "Av. Calle 134 # 19-32, Cedritos",
    telefono: "(601) 320 9001",
    stock_disponible: true,
    latitud: 4.7175,
    longitud: -74.0436,
  },
  {
    id_tienda: 3,
    nombre: "Tienda Pintacasa Pintuco - Guayabal",
    ciudad: "Medellín (Antioquia)",
    direccion: "Cra. 52 # 10-70, Guayabal",
    telefono: "(604) 444 8000",
    stock_disponible: true,
    latitud: 6.2163,
    longitud: -75.5861,
  },
  {
    id_tienda: 4,
    nombre: "Pintuco Store - Poblado Calle 10",
    ciudad: "Medellín (Antioquia)",
    direccion: "Calle 10 # 43D-21, El Poblado",
    telefono: "(604) 444 8002",
    stock_disponible: true,
    latitud: 6.2094,
    longitud: -75.5709,
  },
  {
    id_tienda: 5,
    nombre: "Tienda Pintacasa Pintuco - Pasoancho",
    ciudad: "Cali (Valle)",
    direccion: "Calle 13 # 66-10, Pasoancho",
    telefono: "(602) 330 4000",
    stock_disponible: true,
    latitud: 3.4082,
    longitud: -76.5412,
  },
  {
    id_tienda: 6,
    nombre: "Centro de Pinturas Pintuco - Norte",
    ciudad: "Barranquilla (Atlántico)",
    direccion: "Cra. 53 # 79-120, Alto Prado",
    telefono: "(605) 385 6000",
    stock_disponible: true,
    latitud: 11.0041,
    longitud: -74.8069,
  },
  {
    id_tienda: 7,
    nombre: "Tienda Pintuco Cabecera",
    ciudad: "Bucaramanga (Santander)",
    direccion: "Cra. 33 # 48-112, Cabecera",
    telefono: "(607) 643 8900",
    stock_disponible: true,
    latitud: 7.1192,
    longitud: -73.1095,
  },
  {
    id_tienda: 8,
    nombre: "Pintuco Store - Bocagrande",
    ciudad: "Cartagena (Bolívar)",
    direccion: "Cra. 3 # 8-45, Bocagrande",
    telefono: "(605) 665 4200",
    stock_disponible: true,
    latitud: 10.4042,
    longitud: -75.5539,
  },
  {
    id_tienda: 9,
    nombre: "Tienda Pintuco Circunvalar",
    ciudad: "Pereira (Risaralda)",
    direccion: "Av. Circunvalar # 12-30, Los Alpes",
    telefono: "(606) 324 7000",
    stock_disponible: true,
    latitud: 4.8115,
    longitud: -75.6908,
  },
  {
    id_tienda: 10,
    nombre: "Tienda Pintuco Manizales Centro",
    ciudad: "Manizales (Caldas)",
    direccion: "Cra. 22 # 25-18, Centro",
    telefono: "(606) 884 5500",
    stock_disponible: true,
    latitud: 5.0689,
    longitud: -75.5174,
  },
  {
    id_tienda: 11,
    nombre: "Tienda Pintuco Ibagué Quinta",
    ciudad: "Ibagué (Tolima)",
    direccion: "Cra. 5 # 37-20, La Pola",
    telefono: "(608) 261 3300",
    stock_disponible: true,
    latitud: 4.4389,
    longitud: -75.2322,
  },
  {
    id_tienda: 12,
    nombre: "Pintuco Store Santa Marta El Rodadero",
    ciudad: "Santa Marta (Magdalena)",
    direccion: "Cra. 2 # 9-40, El Rodadero",
    telefono: "(605) 422 9900",
    stock_disponible: true,
    latitud: 11.2062,
    longitud: -74.2255,
  },
];

export async function obtenerTiendas(ciudad?: string): Promise<TiendaDB[]> {
  try {
    let query = supabase
      .from("tienda")
      .select("id_tienda, nombre, ciudad, direccion, telefono, stock_disponible, latitud, longitud");
    if (ciudad) query = query.eq("ciudad", ciudad);
    const { data, error } = await query.order("nombre");
    if (error) {
      console.warn("[colorlinkApi] Fallback al catálogo de tiendas:", error.message);
      return obtenerTiendasFallback(ciudad);
    }
    if (data && data.length > 0) {
      // Si alguna tienda vino sin lat/lng, completar con fallback si coincide
      return data.map((t: any) => {
        if (!t.latitud || !t.longitud) {
          const match = TIENDAS_FALLBACK.find(
            (fb) => fb.nombre.toLowerCase() === t.nombre?.toLowerCase() || fb.ciudad.toLowerCase().includes(t.ciudad?.toLowerCase())
          );
          return {
            ...t,
            latitud: t.latitud || match?.latitud || 4.6782,
            longitud: t.longitud || match?.longitud || -74.0583,
          };
        }
        return t;
      }) as TiendaDB[];
    }
    return obtenerTiendasFallback(ciudad);
  } catch (err) {
    console.warn("[colorlinkApi] Error consultando tiendas:", err);
    return obtenerTiendasFallback(ciudad);
  }
}

export function obtenerTiendasFallback(ciudad?: string): TiendaDB[] {
  if (!ciudad) return TIENDAS_FALLBACK;
  const ciudadLimpia = ciudad.split("(")[0].trim().toLowerCase();
  const match = TIENDAS_FALLBACK.filter((t) =>
    t.ciudad.toLowerCase().includes(ciudadLimpia)
  );
  return match.length > 0 ? match : TIENDAS_FALLBACK;
}

export async function obtenerMaestros(ciudad?: string) {
  let query = supabase
    .from("maestro_certificado")
    .select("id_maestro, nombre, calificacion, experiencia_anios, ciudad");
  if (ciudad) query = query.eq("ciudad", ciudad);
  const { data, error } = await query.order("calificacion", { ascending: false });
  if (error) throw error;
  return data;
}

/** Trae el proyecto guardado con su recomendación y producto (prueba de las FK). */
export async function obtenerProyectoCompleto(idProyecto: number) {
  const { data, error } = await supabase
    .from("proyecto")
    .select(
      `id_proyecto, superficie, problema, m2, urgencia, color_seleccionado, ciudad, creado_en,
       usuario:usuario ( id_usuario, nombre, correo, tipo_perfil ),
       recomendacion:recomendacion (
         id_recomendacion, cantidad_galones, cantidad_cunetes, costo_estimado,
         producto:producto ( id_producto, nombre, tipo_sistema, precio_galon )
       )`
    )
    .eq("id_proyecto", idProyecto)
    .single();
  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// ESCRITURA (INSERT desde el formulario)
// ------------------------------------------------------------

/** Crea o reutiliza el usuario por correo. Devuelve id_usuario. */
export async function guardarUsuario(perfil: UserProfile): Promise<number> {
  const { data, error } = await supabase
    .from("usuario")
    .upsert(
      {
        nombre: perfil.name,
        correo: perfil.email,
        telefono: perfil.phone,
        tipo_perfil: perfil.type,
        es_registrado: true,
        ciudad: perfil.city,
        direccion: perfil.address,
      },
      { onConflict: "correo" }
    )
    .select("id_usuario")
    .single();

  if (error) throw error;
  return data.id_usuario;
}

/** INSERT del formulario del NeedWizard. Devuelve id_proyecto. */
export async function guardarProyecto(
  necesidad: ProjectNeedState,
  idUsuario: number | null
): Promise<number> {
  const { data, error } = await supabase
    .from("proyecto")
    .insert({
      id_usuario: idUsuario,
      superficie: necesidad.surface,
      problema: necesidad.problem,
      m2: necesidad.areaM2,
      urgencia: necesidad.urgency,
      color_seleccionado: necesidad.selectedColor.name,
      color_hex: necesidad.selectedColor.hex,
      ciudad: necesidad.city,
      direccion: necesidad.address,
      notas: necesidad.projectNotes,
    })
    .select("id_proyecto")
    .single();

  if (error) throw error;
  return data.id_proyecto;
}

/** Guarda la recomendación del motor técnico enlazada al proyecto. */
export async function guardarRecomendacion(
  idProyecto: number,
  recomendacion: TechnicalRecommendation
): Promise<number> {
  // Busca el producto del catálogo por nombre; si no existe, deja la FK en null.
  const { data: producto } = await supabase
    .from("producto")
    .select("id_producto")
    .eq("nombre", recomendacion.productName)
    .maybeSingle();

  const { data, error } = await supabase
    .from("recomendacion")
    .insert({
      id_proyecto: idProyecto,
      id_producto: producto?.id_producto ?? null,
      cantidad_galones: recomendacion.calculation.gallonsCount,
      cantidad_cunetes: recomendacion.calculation.bucketsCount,
      costo_estimado: recomendacion.pricing.totalEstimated,
      explicacion: recomendacion.explanation,
    })
    .select("id_recomendacion")
    .single();

  if (error) throw error;
  return data.id_recomendacion;
}

/** Registra el pedido. Devuelve id_pedido. */
export async function guardarPedido(
  orden: OrderState,
  idUsuario: number | null,
  idRecomendacion: number | null,
  idTienda: number | null,
  total: number
): Promise<number> {
  const { data, error } = await supabase
    .from("pedido")
    .insert({
      id_usuario: idUsuario,
      id_recomendacion: idRecomendacion,
      id_tienda: idTienda,
      metodo_entrega: orden.deliveryMethod,
      metodo_pago: orden.paymentMethod,
      estado: orden.trackingStep,
      total,
    })
    .select("id_pedido")
    .single();

  if (error) throw error;
  return data.id_pedido;
}

/** Agenda el servicio del maestro aplicador. */
export async function guardarServicio(
  idPedido: number,
  idMaestro: number | null,
  fechaAgendada: string,
  estadoTracking: OrderState["trackingStep"]
): Promise<number> {
  const { data, error } = await supabase
    .from("servicio")
    .insert({
      id_pedido: idPedido,
      id_maestro: idMaestro,
      fecha_agendada: fechaAgendada,
      estado_tracking: estadoTracking,
    })
    .select("id_servicio")
    .single();

  if (error) throw error;
  return data.id_servicio;
}

/** Emite la póliza de garantía del pedido. */
export async function guardarGarantia(
  idPedido: number,
  aniosGarantia: number
): Promise<{ id_garantia: number; numero_poliza: string }> {
  const inicio = new Date();
  const vence = new Date(inicio);
  vence.setFullYear(vence.getFullYear() + (aniosGarantia || 1));

  const numeroPoliza = `PIN-${inicio.getFullYear()}-${String(idPedido).padStart(6, "0")}`;

  const { data, error } = await supabase
    .from("garantia")
    .insert({
      id_pedido: idPedido,
      numero_poliza: numeroPoliza,
      fecha_inicio: inicio.toISOString().split("T")[0],
      fecha_vencimiento: vence.toISOString().split("T")[0],
    })
    .select("id_garantia, numero_poliza")
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// ORQUESTADOR
// ------------------------------------------------------------

export interface ResultadoPersistencia {
  idUsuario: number | null;
  idProyecto: number;
  idRecomendacion: number | null;
}

/**
 * Guarda de una sola vez usuario -> proyecto -> recomendación.
 * Se llama cuando el usuario termina el wizard y llega el diagnóstico.
 */
export async function persistirFlujoDiagnostico(
  perfil: UserProfile | null,
  necesidad: ProjectNeedState,
  recomendacion: TechnicalRecommendation | null
): Promise<ResultadoPersistencia> {
  const idUsuario = perfil ? await guardarUsuario(perfil) : null;
  const idProyecto = await guardarProyecto(necesidad, idUsuario);
  const idRecomendacion = recomendacion
    ? await guardarRecomendacion(idProyecto, recomendacion)
    : null;

  return { idUsuario, idProyecto, idRecomendacion };
}

// ------------------------------------------------------------
// ADMINISTRADOR
// ------------------------------------------------------------

export interface AdministradorAuth {
  id_admin: number;
  nombre: string;
  correo: string;
}

/** Valida las credenciales contra la tabla `administrador`. Devuelve null si no coinciden. */
export async function verificarAdmin(
  correo: string,
  contrasena: string
): Promise<AdministradorAuth | null> {
  const { data, error } = await supabase
    .from("administrador")
    .select("id_admin, nombre, correo")
    .eq("correo", correo.trim().toLowerCase())
    .eq("contrasena", contrasena)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

// ------------------------------------------------------------
// PEDIDOS (vista de administrador)
// ------------------------------------------------------------

export interface PedidoCompleto {
  id_pedido: number;
  fecha_pedido: string;
  metodo_entrega: string;
  metodo_pago: string;
  estado: string;
  total: number;
  usuario: { nombre: string; correo: string; telefono: string | null } | null;
  recomendacion: {
    producto: { nombre: string; tipo_sistema: string } | null;
  } | null;
  tienda: { nombre: string; ciudad: string } | null;
}

/** Trae todos los pedidos con cliente, producto recomendado y tienda, del más nuevo al más viejo. */
export async function obtenerPedidosCompletos(): Promise<PedidoCompleto[]> {
  const { data, error } = await supabase
    .from("pedido")
    .select(
      `id_pedido, fecha_pedido, metodo_entrega, metodo_pago, estado, total,
       usuario:usuario ( nombre, correo, telefono ),
       recomendacion:recomendacion (
         producto:producto ( nombre, tipo_sistema )
       ),
       tienda:tienda ( nombre, ciudad )`
    )
    .order("fecha_pedido", { ascending: false });

  if (error) throw error;
  return (data as unknown as PedidoCompleto[]) ?? [];
}

/**
 * Se suscribe a nuevos pedidos en tiempo real (Supabase Realtime).
 * Cada vez que un cliente hace un pedido nuevo, se llama a `onCambio`
 * (sin argumentos: el componente debe volver a pedir la lista completa,
 * porque el evento de Realtime no trae los datos de usuario/producto/tienda).
 *
 * Devuelve una función para cancelar la suscripción (úsala en el cleanup
 * de tu useEffect).
 */
export function suscribirsePedidos(onCambio: () => void): () => void {
  const canal = supabase
    .channel("pedidos-en-vivo")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "pedido" },
      () => onCambio()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}

// ------------------------------------------------------------
// INVENTARIO
// ------------------------------------------------------------

export interface ItemInventario {
  id_tienda: number;
  tienda: string;
  ciudad: string;
  id_producto: number;
  producto: string;
  cantidad: number;
}

/** Trae el inventario completo (todas las tiendas x todos los productos). */
export async function obtenerInventario(): Promise<ItemInventario[]> {
  const { data, error } = await supabase
    .from("inventario")
    .select(
      `cantidad,
       tienda:tienda ( id_tienda, nombre, ciudad ),
       producto:producto ( id_producto, nombre )`
    );

  if (error) throw error;

  return (data ?? []).map((fila: any) => ({
    id_tienda: fila.tienda?.id_tienda,
    tienda: fila.tienda?.nombre ?? "—",
    ciudad: fila.tienda?.ciudad ?? "—",
    id_producto: fila.producto?.id_producto,
    producto: fila.producto?.nombre ?? "—",
    cantidad: fila.cantidad,
  }));
}

/** Actualiza manualmente la cantidad de un producto en una tienda. */
export async function actualizarInventario(
  idTienda: number,
  idProducto: number,
  nuevaCantidad: number
): Promise<void> {
  const { error } = await supabase
    .from("inventario")
    .update({ cantidad: nuevaCantidad, actualizado_en: new Date().toISOString() })
    .eq("id_tienda", idTienda)
    .eq("id_producto", idProducto);

  if (error) throw error;
}

// ------------------------------------------------------------
// ESTADO DEL PEDIDO
// ------------------------------------------------------------

export type EstadoPedido =
  | "confirmado"
  | "tinturado_preparacion"
  | "empacado"
  | "en_camino"
  | "en_sitio_aplicacion"
  | "completado"
  | "cancelado";

/** Cambia el estado de un pedido (lo usa el panel de administrador). */
export async function actualizarEstadoPedido(
  idPedido: number,
  nuevoEstado: EstadoPedido
): Promise<void> {
  const { error } = await supabase
    .from("pedido")
    .update({ estado: nuevoEstado })
    .eq("id_pedido", idPedido);

  if (error) throw error;
}


