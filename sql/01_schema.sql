-- ============================================================
-- ColorLink by Pintuco — Modelo de datos (Supabase / PostgreSQL)
-- Basado en el diagrama entidad-relación del equipo.
-- Ejecutar en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- Limpieza para poder re-ejecutar el script durante las pruebas.
drop table if exists public.garantia cascade;
drop table if exists public.servicio cascade;
drop table if exists public.pedido cascade;
drop table if exists public.recomendacion cascade;
drop table if exists public.proyecto cascade;
drop table if exists public.maestro_certificado cascade;
drop table if exists public.tienda cascade;
drop table if exists public.producto cascade;
drop table if exists public.usuario cascade;

-- ------------------------------------------------------------
-- 1. USUARIO
-- ------------------------------------------------------------
create table public.usuario (
  id_usuario      bigint generated always as identity primary key,
  nombre          text        not null,
  correo          text        not null unique,
  telefono        text,
  tipo_perfil     text        not null default 'hogar'
                  check (tipo_perfil in ('hogar', 'contratista', 'empresa')),
  es_registrado   boolean     not null default false,
  contrasena_hash text,
  ciudad          text,
  direccion       text,
  creado_en       timestamptz not null default now()
);

comment on table public.usuario is 'Clientes del ecosistema ColorLink (visitantes y registrados).';

-- ------------------------------------------------------------
-- 2. PRODUCTO  (catálogo técnico Pintuco)
-- ------------------------------------------------------------
create table public.producto (
  id_producto   bigint generated always as identity primary key,
  nombre        text           not null unique,
  tipo_sistema  text           not null,
  precio_galon  numeric(12,2)  not null check (precio_galon >= 0),
  precio_cunete numeric(12,2)  check (precio_cunete >= 0),
  rendimiento_m2_galon numeric(6,2),
  anios_garantia int,
  descripcion   text
);

comment on table public.producto is 'Catálogo de sistemas y pinturas recomendables por el motor técnico.';

-- ------------------------------------------------------------
-- 3. TIENDA
-- ------------------------------------------------------------
create table public.tienda (
  id_tienda        bigint generated always as identity primary key,
  nombre           text    not null,
  ciudad           text    not null,
  direccion        text    not null,
  telefono         text,
  stock_disponible boolean not null default true
);

-- ------------------------------------------------------------
-- 4. MAESTRO CERTIFICADO
-- ------------------------------------------------------------
-- Nota: el diagrama dice "experiencia_años"; en PostgreSQL se evita la "ñ"
-- en nombres de columna, por eso queda como experiencia_anios.
create table public.maestro_certificado (
  id_maestro        bigint generated always as identity primary key,
  nombre            text          not null,
  calificacion      numeric(3,2)  check (calificacion between 0 and 5),
  experiencia_anios int           check (experiencia_anios >= 0),
  ciudad            text,
  telefono          text
);

-- ------------------------------------------------------------
-- 5. PROYECTO  (lo que captura el NeedWizard)
-- ------------------------------------------------------------
create table public.proyecto (
  id_proyecto       bigint generated always as identity primary key,
  id_usuario        bigint references public.usuario(id_usuario) on delete set null,
  superficie        text        not null,
  problema          text        not null,
  m2                numeric(8,2) not null check (m2 > 0),
  urgencia          text        not null
                    check (urgencia in ('urgente_24h', 'esta_semana', 'proximo_mes')),
  color_seleccionado text,
  color_hex         text,
  ciudad            text,
  direccion         text,
  notas             text,
  creado_en         timestamptz not null default now()
);

create index on public.proyecto (id_usuario);

-- ------------------------------------------------------------
-- 6. RECOMENDACION  (resultado del motor de diagnóstico)
-- ------------------------------------------------------------
create table public.recomendacion (
  id_recomendacion  bigint generated always as identity primary key,
  id_proyecto       bigint not null references public.proyecto(id_proyecto) on delete cascade,
  id_producto       bigint references public.producto(id_producto) on delete set null,
  cantidad_galones  int           not null default 0 check (cantidad_galones >= 0),
  cantidad_cunetes  int           not null default 0 check (cantidad_cunetes >= 0),
  costo_estimado    numeric(12,2) not null default 0 check (costo_estimado >= 0),
  explicacion       text,
  creado_en         timestamptz   not null default now()
);

create index on public.recomendacion (id_proyecto);
create index on public.recomendacion (id_producto);

-- ------------------------------------------------------------
-- 7. PEDIDO
-- ------------------------------------------------------------
create table public.pedido (
  id_pedido        bigint generated always as identity primary key,
  id_usuario       bigint references public.usuario(id_usuario) on delete set null,
  id_recomendacion bigint references public.recomendacion(id_recomendacion) on delete set null,
  id_tienda        bigint references public.tienda(id_tienda) on delete set null,
  fecha_pedido     timestamptz   not null default now(),
  metodo_entrega   text          not null
                   check (metodo_entrega in ('domicilio_express', 'retiro_tienda')),
  metodo_pago      text          not null
                   check (metodo_pago in ('tarjeta_credito', 'pse', 'contra_entrega')),
  estado           text          not null default 'confirmado'
                   check (estado in ('confirmado', 'tinturado_preparacion', 'en_camino',
                                     'en_sitio_aplicacion', 'completado', 'cancelado')),
  total            numeric(12,2) not null default 0 check (total >= 0)
);

create index on public.pedido (id_usuario);
create index on public.pedido (id_recomendacion);

-- ------------------------------------------------------------
-- 8. SERVICIO  (agendamiento del maestro aplicador)
-- ------------------------------------------------------------
create table public.servicio (
  id_servicio     bigint generated always as identity primary key,
  id_pedido       bigint not null references public.pedido(id_pedido) on delete cascade,
  id_maestro      bigint references public.maestro_certificado(id_maestro) on delete set null,
  fecha_agendada  timestamptz,
  estado_tracking text not null default 'confirmado'
                  check (estado_tracking in ('confirmado', 'tinturado_preparacion', 'en_camino',
                                             'en_sitio_aplicacion', 'completado'))
);

create index on public.servicio (id_pedido);

-- ------------------------------------------------------------
-- 9. GARANTIA
-- ------------------------------------------------------------
create table public.garantia (
  id_garantia       bigint generated always as identity primary key,
  id_pedido         bigint not null references public.pedido(id_pedido) on delete cascade,
  numero_poliza     text   not null unique,
  fecha_inicio      date   not null default current_date,
  fecha_vencimiento date   not null,
  constraint garantia_fechas_validas check (fecha_vencimiento > fecha_inicio)
);

create index on public.garantia (id_pedido);
