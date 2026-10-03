-- ============================================================
-- ColorLink by Pintuco — Módulo de Inventario y Trigger de Descuento
-- Archivo: sql/05_inventario.sql
-- Ejecutar en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA INVENTARIO (Stock por tienda y producto)
-- ------------------------------------------------------------
create table if not exists public.inventario (
  id_tienda      bigint not null references public.tienda(id_tienda) on delete cascade,
  id_producto    bigint not null references public.producto(id_producto) on delete cascade,
  cantidad       int not null default 0 check (cantidad >= 0),
  actualizado_en timestamptz not null default now(),
  constraint pk_inventario primary key (id_tienda, id_producto)
);

comment on table public.inventario is 'Control de existencias físicas por tienda y producto en ColorLink.';

-- Índices para optimizar las consultas de la capa de datos
create index if not exists idx_inventario_tienda on public.inventario (id_tienda);
create index if not exists idx_inventario_producto on public.inventario (id_producto);

-- ------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
alter table public.inventario enable row level security;

-- Políticas de lectura y actualización
drop policy if exists "inventario_lectura" on public.inventario;
create policy "inventario_lectura" on public.inventario
  for select to anon, authenticated using (true);

drop policy if exists "inventario_actualizacion" on public.inventario;
create policy "inventario_actualizacion" on public.inventario
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "inventario_insercion" on public.inventario;
create policy "inventario_insercion" on public.inventario
  for insert to anon, authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 3. SEED INICIAL DE CANTIDADES
-- ------------------------------------------------------------
-- Pobla el inventario inicial cruzando todas las tiendas con todos los productos
insert into public.inventario (id_tienda, id_producto, cantidad, actualizado_en)
select 
  t.id_tienda,
  p.id_producto,
  case 
    when p.id_producto in (1, 2) then 35 -- Líneas de alta demanda (Koraza, Viniltex)
    when p.id_producto in (3, 5) then 20 -- Líneas intermedias (Aquaprotec, Pintulux)
    when p.id_producto = 6 then 12       -- Pisos / Epóxicos
    else 15                              -- Maderas / Techos
  end as cantidad,
  now() as actualizado_en
from public.tienda t
cross join public.producto p
on conflict (id_tienda, id_producto) do update 
set cantidad = excluded.cantidad, actualizado_en = now();

-- ------------------------------------------------------------
-- 4. TRIGGER: DESCUENTO AUTOMÁTICO DE INVENTARIO POR PEDIDO
-- ------------------------------------------------------------
-- Cada vez que entra un nuevo registro a la tabla pedido, esta función
-- descuenta las unidades equivalentes del producto en la tienda asignada.
create or replace function public.descontar_inventario_por_pedido()
returns trigger
language plpgsql
security definer
as $$
declare
  v_id_producto bigint;
  v_cantidad_descontar int;
  v_id_tienda bigint;
begin
  -- Si el pedido no está enlazado a una recomendación, continuar sin descontar
  if NEW.id_recomendacion is null then
    return NEW;
  end if;

  -- Obtener el producto y la cantidad total en galones equivalentes
  select 
    r.id_producto, 
    coalesce(r.cantidad_galones, 0) + (coalesce(r.cantidad_cunetes, 0) * 5)
  into v_id_producto, v_cantidad_descontar
  from public.recomendacion r
  where r.id_recomendacion = NEW.id_recomendacion;

  -- Si la cantidad no está definida o es 0, descontar al menos 1 unidad
  if v_cantidad_descontar is null or v_cantidad_descontar <= 0 then
    v_cantidad_descontar := 1;
  end if;

  -- Asignar tienda del pedido o fallback a la primera tienda registrada
  v_id_tienda := coalesce(NEW.id_tienda, (select id_tienda from public.tienda order by id_tienda limit 1));

  -- Descontar del inventario de forma segura (sin números negativos)
  if v_id_producto is not null and v_id_tienda is not null then
    update public.inventario
    set cantidad = greatest(0, cantidad - v_cantidad_descontar),
        actualizado_en = now()
    where id_tienda = v_id_tienda
      and id_producto = v_id_producto;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_descontar_inventario on public.pedido;
create trigger trg_descontar_inventario
  after insert on public.pedido
  for each row
  execute function public.descontar_inventario_por_pedido();
