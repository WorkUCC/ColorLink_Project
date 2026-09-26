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

export async function obtenerTiendas(ciudad?: string) {
  let query = supabase
    .from("tienda")
    .select("id_tienda, nombre, ciudad, direccion, telefono, stock_disponible");
  if (ciudad) query = query.eq("ciudad", ciudad);
  const { data, error } = await query.order("nombre");
  if (error) throw error;
  return data;
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


