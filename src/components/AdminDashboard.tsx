/**
 * ESTE ARCHIVO REEMPLAZA COMPLETO a tu src/components/AdminDashboard.tsx
 * anterior. Es un rediseño total: ahora es un panel de operaciones con
 * menú lateral, indicadores clave (KPIs), gráfico de pedidos por día,
 * alertas de stock crítico, y tablas con búsqueda/filtro/orden.
 */
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  LogOut,
  Radio,
  RefreshCw,
  PackageSearch,
  Boxes,
  ClipboardList,
  Check,
  LayoutGrid,
  Search,
  ArrowUpDown,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  PaintBucket,
} from "lucide-react";
import {
  obtenerPedidosCompletos,
  suscribirsePedidos,
  actualizarEstadoPedido,
  obtenerInventario,
  actualizarInventario,
  PedidoCompleto,
  AdministradorAuth,
  EstadoPedido,
  ItemInventario,
} from "../lib/colorlinkApi";

interface Props {
  admin: AdministradorAuth;
  onCerrarSesion: () => void;
}

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ESTADOS: { valor: EstadoPedido; etiqueta: string }[] = [
  { valor: "confirmado", etiqueta: "Confirmado" },
  { valor: "tinturado_preparacion", etiqueta: "Alistando / Tinturado" },
  { valor: "empacado", etiqueta: "Empacado y listo para despacho" },
  { valor: "en_camino", etiqueta: "En camino" },
  { valor: "en_sitio_aplicacion", etiqueta: "En sitio de aplicación" },
  { valor: "completado", etiqueta: "Completado" },
  { valor: "cancelado", etiqueta: "Cancelado" },
];

const ESTADO_ESTILOS: Record<string, string> = {
  confirmado: "bg-blue-50 text-blue-700 border-blue-200",
  tinturado_preparacion: "bg-amber-50 text-amber-700 border-amber-200",
  empacado: "bg-sky-50 text-sky-700 border-sky-200",
  en_camino: "bg-indigo-50 text-indigo-700 border-indigo-200",
  en_sitio_aplicacion: "bg-purple-50 text-purple-700 border-purple-200",
  completado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelado: "bg-red-50 text-red-700 border-red-200",
};

const UMBRAL_STOCK_BAJO = 5;
const UMBRAL_STOCK_MAX_REFERENCIA = 35;

type Vista = "resumen" | "pedidos" | "inventario";

export const AdminDashboard: React.FC<Props> = ({ admin, onCerrarSesion }) => {
  const [vista, setVista] = useState<Vista>("resumen");

  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [enVivo, setEnVivo] = useState(false);
  const [ultimoIdVisto, setUltimoIdVisto] = useState<number | null>(null);
  const primerCargaPedidos = useRef(true);

  const cargarPedidos = useCallback(async () => {
    try {
      const data = await obtenerPedidosCompletos();
      if (!primerCargaPedidos.current && data.length > 0) {
        setUltimoIdVisto(data[0].id_pedido);
        setTimeout(() => setUltimoIdVisto(null), 4000);
      }
      setPedidos(data);
    } catch (e) {
      console.error("[Admin] Error cargando pedidos:", e);
    } finally {
      setCargandoPedidos(false);
      primerCargaPedidos.current = false;
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
    setEnVivo(true);
    const cancelar = suscribirsePedidos(() => cargarPedidos());
    return () => {
      cancelar();
      setEnVivo(false);
    };
  }, [cargarPedidos]);

  const [inventario, setInventario] = useState<ItemInventario[]>([]);
  const [cargandoInventario, setCargandoInventario] = useState(true);

  const cargarInventario = useCallback(async () => {
    setCargandoInventario(true);
    try {
      const data = await obtenerInventario();
      setInventario(data);
    } catch (e) {
      console.error("[Admin] Error cargando inventario:", e);
    } finally {
      setCargandoInventario(false);
    }
  }, []);

  useEffect(() => {
    cargarInventario();
  }, [cargarInventario]);

  return (
    <div className="min-h-screen bg-[#F3F5F7] flex">
      <BarraLateral
        vista={vista}
        setVista={setVista}
        admin={admin}
        onCerrarSesion={onCerrarSesion}
        alertasStock={inventario.filter((i) => i.cantidad <= UMBRAL_STOCK_BAJO).length}
      />

      <div className="flex-1 min-w-0">
        <BarraSuperior vista={vista} enVivo={enVivo} />

        <main className="p-6 max-w-6xl mx-auto">
          {vista === "resumen" && (
            <VistaResumen
              pedidos={pedidos}
              inventario={inventario}
              cargando={cargandoPedidos || cargandoInventario}
            />
          )}
          {vista === "pedidos" && (
            <VistaPedidos
              pedidos={pedidos}
              cargando={cargandoPedidos}
              enVivo={enVivo}
              ultimoIdVisto={ultimoIdVisto}
              onRecargar={cargarPedidos}
              onCambioLocal={setPedidos}
            />
          )}
          {vista === "inventario" && (
            <VistaInventario
              items={inventario}
              cargando={cargandoInventario}
              onRecargar={cargarInventario}
              onCambioLocal={setInventario}
            />
          )}
        </main>
      </div>
    </div>
  );
};

const BarraLateral: React.FC<{
  vista: Vista;
  setVista: (v: Vista) => void;
  admin: AdministradorAuth;
  onCerrarSesion: () => void;
  alertasStock: number;
}> = ({ vista, setVista, admin, onCerrarSesion, alertasStock }) => {
  const item = (v: Vista, icono: React.ReactNode, etiqueta: string, contador?: number) => (
    <button
      onClick={() => setVista(v)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition relative ${
        vista === v
          ? "bg-white/10 text-white"
          : "text-blue-200/70 hover:text-white hover:bg-white/5"
      }`}
    >
      {vista === v && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#00A896] rounded-r" />
      )}
      {icono}
      <span className="flex-1 text-left">{etiqueta}</span>
      {!!contador && (
        <span className="text-[11px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          {contador}
        </span>
      )}
    </button>
  );

  return (
    <aside className="w-60 shrink-0 bg-[#001D40] text-white flex flex-col">
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[#00A896] flex items-center justify-center shrink-0">
          <PaintBucket className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold leading-tight">ColorLink</p>
          <p className="text-[11px] text-blue-200/70 leading-tight">
            Centro de Operaciones
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {item("resumen", <LayoutGrid className="w-4 h-4" />, "Resumen")}
        {item("pedidos", <ClipboardList className="w-4 h-4" />, "Pedidos")}
        {item("inventario", <Boxes className="w-4 h-4" />, "Inventario", alertasStock)}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-sm font-medium truncate">{admin.nombre}</p>
        <p className="text-xs text-blue-200/60 truncate mb-3">{admin.correo}</p>
        <button
          onClick={onCerrarSesion}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

const TITULOS: Record<Vista, { titulo: string; subtitulo: string }> = {
  resumen: { titulo: "Resumen", subtitulo: "Cómo va la operación hoy" },
  pedidos: { titulo: "Pedidos", subtitulo: "Todos los pedidos de clientes" },
  inventario: { titulo: "Inventario", subtitulo: "Existencias por tienda" },
};

const BarraSuperior: React.FC<{ vista: Vista; enVivo: boolean }> = ({ vista, enVivo }) => (
  <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
    <div>
      <h1 className="text-lg font-bold text-slate-800">{TITULOS[vista].titulo}</h1>
      <p className="text-xs text-slate-400">{TITULOS[vista].subtitulo}</p>
    </div>
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
        enVivo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <Radio className={`w-3 h-3 ${enVivo ? "animate-pulse" : ""}`} />
      {enVivo ? "Datos en vivo" : "Desconectado"}
    </span>
  </div>
);

const VistaResumen: React.FC<{
  pedidos: PedidoCompleto[];
  inventario: ItemInventario[];
  cargando: boolean;
}> = ({ pedidos, inventario, cargando }) => {
  const hoyStr = new Date().toDateString();

  const pedidosHoy = pedidos.filter(
    (p) => new Date(p.fecha_pedido).toDateString() === hoyStr
  );
  const ingresosHoy = pedidosHoy.reduce((acc, p) => acc + Number(p.total), 0);
  const pendientes = pedidos.filter(
    (p) => p.estado !== "completado" && p.estado !== "cancelado"
  ).length;
  const stockBajo = inventario.filter((i) => i.cantidad <= UMBRAL_STOCK_BAJO);

  const ultimosDias = Array.from({ length: 7 }).map((_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - (6 - i));
    return fecha;
  });
  const conteosPorDia = ultimosDias.map(
    (fecha) =>
      pedidos.filter((p) => new Date(p.fecha_pedido).toDateString() === fecha.toDateString())
        .length
  );
  const maxConteo = Math.max(1, ...conteosPorDia);

  if (cargando) {
    return <div className="text-center py-16 text-slate-400">Cargando resumen...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaKpi
          icono={<DollarSign className="w-4 h-4" />}
          etiqueta="Ingresos hoy"
          valor={formatoCOP.format(ingresosHoy)}
          color="text-[#00A896]"
        />
        <TarjetaKpi
          icono={<PackageSearch className="w-4 h-4" />}
          etiqueta="Pedidos hoy"
          valor={String(pedidosHoy.length)}
          color="text-[#001D40]"
        />
        <TarjetaKpi
          icono={<Clock className="w-4 h-4" />}
          etiqueta="Pedidos pendientes"
          valor={String(pendientes)}
          color="text-amber-600"
        />
        <TarjetaKpi
          icono={<AlertTriangle className="w-4 h-4" />}
          etiqueta="Alertas de stock"
          valor={String(stockBajo.length)}
          color={stockBajo.length > 0 ? "text-red-600" : "text-slate-400"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#00A896]" />
            <h3 className="font-semibold text-slate-800 text-sm">
              Pedidos de los últimos 7 días
            </h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {ultimosDias.map((fecha, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-[#00A896]/20 rounded-t-md relative group"
                    style={{
                      height: `${Math.max(6, (conteosPorDia[i] / maxConteo) * 100)}%`,
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-[#00A896] rounded-t-md" />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600">
                      {conteosPorDia[i]}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 capitalize">
                  {fecha.toLocaleDateString("es-CO", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-slate-800 text-sm">Stock crítico</h3>
          </div>
          {stockBajo.length === 0 ? (
            <p className="text-sm text-slate-400">
              Ninguna referencia está por debajo del umbral. Todo en orden.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {stockBajo
                .sort((a, b) => a.cantidad - b.cantidad)
                .slice(0, 6)
                .map((item) => (
                  <li
                    key={`${item.id_tienda}-${item.id_producto}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-slate-700 truncate">{item.producto}</p>
                      <p className="text-xs text-slate-400 truncate">{item.tienda}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded shrink-0">
                      {item.cantidad} gal
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">Últimos pedidos</h3>
        {pedidos.length === 0 ? (
          <p className="text-sm text-slate-400">Todavía no hay pedidos registrados.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {pedidos.slice(0, 5).map((p) => (
              <div key={p.id_pedido} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-slate-400 shrink-0">
                    #{p.id_pedido}
                  </span>
                  <span className="text-slate-700 truncate">
                    {p.usuario?.nombre ?? "Cliente sin registrar"}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                      ESTADO_ESTILOS[p.estado] ?? "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {p.estado.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold text-[#001D40] w-24 text-right">
                    {formatoCOP.format(p.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TarjetaKpi: React.FC<{
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  color: string;
}> = ({ icono, etiqueta, valor, color }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4">
    <div className={`inline-flex items-center gap-1.5 text-xs text-slate-400 mb-2`}>
      {icono}
      {etiqueta}
    </div>
    <p className={`text-2xl font-bold ${color}`}>{valor}</p>
  </div>
);

const VistaPedidos: React.FC<{
  pedidos: PedidoCompleto[];
  cargando: boolean;
  enVivo: boolean;
  ultimoIdVisto: number | null;
  onRecargar: () => void;
  onCambioLocal: React.Dispatch<React.SetStateAction<PedidoCompleto[]>>;
}> = ({ pedidos, cargando, ultimoIdVisto, onRecargar, onCambioLocal }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [orden, setOrden] = useState<"reciente" | "antiguo" | "mayor_total">("reciente");
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  const cambiarEstado = async (idPedido: number, nuevoEstado: EstadoPedido) => {
    setGuardandoId(idPedido);
    onCambioLocal((prev) =>
      prev.map((p) => (p.id_pedido === idPedido ? { ...p, estado: nuevoEstado } : p))
    );
    try {
      await actualizarEstadoPedido(idPedido, nuevoEstado);
    } catch (e) {
      console.error("[Admin] Error actualizando estado:", e);
      onRecargar();
    } finally {
      setGuardandoId(null);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    let lista = [...pedidos];

    if (filtroEstado !== "Todos") {
      lista = lista.filter((p) => p.estado === filtroEstado);
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (p) =>
          String(p.id_pedido).includes(q) ||
          p.usuario?.nombre?.toLowerCase().includes(q) ||
          p.usuario?.correo?.toLowerCase().includes(q) ||
          p.recomendacion?.producto?.nombre?.toLowerCase().includes(q)
      );
    }

    lista.sort((a, b) => {
      if (orden === "reciente") return +new Date(b.fecha_pedido) - +new Date(a.fecha_pedido);
      if (orden === "antiguo") return +new Date(a.fecha_pedido) - +new Date(b.fecha_pedido);
      return Number(b.total) - Number(a.total);
    });

    return lista;
  }, [pedidos, busqueda, filtroEstado, orden]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, correo, producto o # de pedido..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
        >
          <option value="Todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.etiqueta}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setOrden((o) =>
              o === "reciente" ? "antiguo" : o === "antiguo" ? "mayor_total" : "reciente"
            )
          }
          className="inline-flex items-center gap-1.5 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {orden === "reciente" ? "Más recientes" : orden === "antiguo" ? "Más antiguos" : "Mayor total"}
        </button>
        <button
          onClick={onRecargar}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-16 text-slate-400">Cargando pedidos...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
          <PackageSearch className="w-10 h-10" />
          No hay pedidos que coincidan con la búsqueda o el filtro.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Pedido</th>
                <th className="text-left px-4 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Tienda</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr
                  key={p.id_pedido}
                  className={`border-t border-slate-100 transition-colors ${
                    p.id_pedido === ultimoIdVisto ? "bg-[#00A896]/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500">#{p.id_pedido}</span>
                    <p className="text-[11px] text-slate-400">
                      {new Date(p.fecha_pedido).toLocaleDateString("es-CO")}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700 font-medium">
                      {p.usuario?.nombre ?? "Cliente sin registrar"}
                    </p>
                    <p className="text-[11px] text-slate-400">{p.usuario?.correo ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.recomendacion?.producto?.nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.tienda?.nombre ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {guardandoId === p.id_pedido && (
                        <span className="text-[11px] text-slate-400">...</span>
                      )}
                      <select
                        value={p.estado}
                        onChange={(e) =>
                          cambiarEstado(p.id_pedido, e.target.value as EstadoPedido)
                        }
                        className={`text-xs font-medium pl-2.5 pr-6 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00A896] ${
                          ESTADO_ESTILOS[p.estado] ?? "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {ESTADOS.map((e) => (
                          <option key={e.valor} value={e.valor}>
                            {e.etiqueta}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#001D40]">
                    {formatoCOP.format(p.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const VistaInventario: React.FC<{
  items: ItemInventario[];
  cargando: boolean;
  onRecargar: () => void;
  onCambioLocal: React.Dispatch<React.SetStateAction<ItemInventario[]>>;
}> = ({ items, cargando, onRecargar, onCambioLocal }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTienda, setFiltroTienda] = useState("Todas");
  const [guardadoClave, setGuardadoClave] = useState<string | null>(null);

  const tiendas = ["Todas", ...Array.from(new Set(items.map((i) => i.tienda)))];

  const itemsFiltrados = useMemo(() => {
    let lista = [...items];
    if (filtroTienda !== "Todas") lista = lista.filter((i) => i.tienda === filtroTienda);
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (i) =>
          i.producto.toLowerCase().includes(q) ||
          i.tienda.toLowerCase().includes(q) ||
          i.ciudad.toLowerCase().includes(q)
      );
    }
    return lista;
  }, [items, filtroTienda, busqueda]);

  const manejarCambio = async (item: ItemInventario, nuevaCantidad: number) => {
    const clave = `${item.id_tienda}-${item.id_producto}`;
    onCambioLocal((prev) =>
      prev.map((i) =>
        i.id_tienda === item.id_tienda && i.id_producto === item.id_producto
          ? { ...i, cantidad: nuevaCantidad }
          : i
      )
    );
    try {
      await actualizarInventario(item.id_tienda, item.id_producto, nuevaCantidad);
      setGuardadoClave(clave);
      setTimeout(() => setGuardadoClave(null), 1500);
    } catch (e) {
      console.error("[Admin] Error actualizando inventario:", e);
      onRecargar();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por producto, tienda o ciudad..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
        </div>
        <select
          value={filtroTienda}
          onChange={(e) => setFiltroTienda(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
        >
          {tiendas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={onRecargar}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-16 text-slate-400">Cargando inventario...</div>
      ) : itemsFiltrados.length === 0 ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
          <PackageSearch className="w-10 h-10" />
          No hay productos que coincidan con la búsqueda o el filtro.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tienda</th>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Nivel de stock</th>
                <th className="text-right px-4 py-3 font-medium">Cantidad (galones)</th>
                <th className="px-4 py-3 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {itemsFiltrados.map((item) => {
                const clave = `${item.id_tienda}-${item.id_producto}`;
                const bajoStock = item.cantidad <= UMBRAL_STOCK_BAJO;
                const porcentaje = Math.min(
                  100,
                  Math.round((item.cantidad / UMBRAL_STOCK_MAX_REFERENCIA) * 100)
                );
                return (
                  <tr key={clave} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-700">
                      {item.tienda}
                      <span className="text-slate-400"> ({item.ciudad})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {item.producto}
                    </td>
                    <td className="px-4 py-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bajoStock ? "bg-red-500" : "bg-[#00A896]"
                            }`}
                            style={{ width: `${Math.max(5, porcentaje)}%` }}
                          />
                        </div>
                        {bajoStock && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            Bajo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min={0}
                        defaultValue={item.cantidad}
                        onBlur={(e) => {
                          const valor = Math.max(0, Number(e.target.value) || 0);
                          if (valor !== item.cantidad) manejarCambio(item, valor);
                        }}
                        className={`w-20 text-right border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A896] ${
                          bajoStock
                            ? "border-red-300 text-red-600 bg-red-50 font-bold"
                            : "border-slate-200 text-slate-700"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 w-8">
                      {guardadoClave === clave && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-xs text-slate-400">
          Las cantidades en rojo indican stock crítico ({UMBRAL_STOCK_BAJO} galones o menos).
          Se descuentan automáticamente cuando un cliente completa un pedido, o puedes
          editarlas aquí manualmente (haz clic fuera del campo para guardar cambios).
        </p>
      </div>
    </div>
  );
};
