-- ============================================================
-- ColorLink by Pintuco — Módulo de Administración y Realtime
-- Archivo: sql/04_admin_y_realtime.sql
-- Ejecutar en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA ADMINISTRADOR
-- ------------------------------------------------------------
create table if not exists public.administrador (
  id_admin    bigint generated always as identity primary key,
  nombre      text        not null,
  correo      text        not null unique,
  contrasena  text        not null,
  creado_en   timestamptz not null default now()
);

comment on table public.administrador is 'Usuarios administradores del Centro de Operaciones ColorLink.';

-- ------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
alter table public.administrador enable row level security;

-- Política de lectura para permitir verificación de credenciales desde el login administrativo
drop policy if exists "administrador_lectura" on public.administrador;
create policy "administrador_lectura" on public.administrador
  for select to anon, authenticated using (true);

-- ------------------------------------------------------------
-- 3. USUARIO DE PRUEBA INICIAL
-- ------------------------------------------------------------
insert into public.administrador (nombre, correo, contrasena)
values ('Administrador ColorLink', 'admin@pintuco.com', 'pintuco2026')
on conflict (correo) do nothing;

-- ------------------------------------------------------------
-- 4. SUPABASE REALTIME (pedidos en vivo)
-- ------------------------------------------------------------
-- Activa la replicación en tiempo real para la tabla pedido,
-- permitiendo que el Centro de Operaciones reciba eventos INSERT al instante
-- mediante supabase.channel().on('postgres_changes', ...).
alter publication supabase_realtime add table public.pedido;
