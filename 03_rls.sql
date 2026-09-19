-- ============================================================
-- ColorLink by Pintuco — Row Level Security (RLS)
-- Ejecutar DESPUÉS de 01_schema.sql
--
-- IMPORTANTE (ponlo en la sustentación):
-- Supabase crea las tablas con RLS activo. Si NO defines políticas,
-- el frontend con la clave anon recibe:
--   - SELECT -> [] (arreglo vacío, sin error)
--   - INSERT -> error 42501 "new row violates row-level security policy"
-- Este script abre el acceso a la clave anon porque es un PROTOTIPO
-- académico sin autenticación real. En producción se restringiría
-- con auth.uid() por usuario.
-- ============================================================

alter table public.usuario             enable row level security;
alter table public.producto            enable row level security;
alter table public.tienda              enable row level security;
alter table public.maestro_certificado enable row level security;
alter table public.proyecto            enable row level security;
alter table public.recomendacion       enable row level security;
alter table public.pedido              enable row level security;
alter table public.servicio            enable row level security;
alter table public.garantia            enable row level security;

-- Catálogos: solo lectura pública
create policy "catalogo_producto_lectura" on public.producto
  for select to anon, authenticated using (true);
create policy "catalogo_tienda_lectura" on public.tienda
  for select to anon, authenticated using (true);
create policy "catalogo_maestro_lectura" on public.maestro_certificado
  for select to anon, authenticated using (true);

-- Tablas transaccionales: lectura y escritura abiertas (solo prototipo)
create policy "demo_usuario_all" on public.usuario
  for all to anon, authenticated using (true) with check (true);
create policy "demo_proyecto_all" on public.proyecto
  for all to anon, authenticated using (true) with check (true);
create policy "demo_recomendacion_all" on public.recomendacion
  for all to anon, authenticated using (true) with check (true);
create policy "demo_pedido_all" on public.pedido
  for all to anon, authenticated using (true) with check (true);
create policy "demo_servicio_all" on public.servicio
  for all to anon, authenticated using (true) with check (true);
create policy "demo_garantia_all" on public.garantia
  for all to anon, authenticated using (true) with check (true);
