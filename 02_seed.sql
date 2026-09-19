-- ============================================================
-- ColorLink by Pintuco — Datos semilla
-- Los nombres coinciden EXACTAMENTE con los del motor técnico
-- (server.ts -> PINTUCO_PRODUCTS), para poder enlazar la
-- recomendación de la IA con el id_producto real.
-- Ejecutar DESPUÉS de 01_schema.sql
-- ============================================================

insert into public.producto (nombre, tipo_sistema, precio_galon, precio_cunete, rendimiento_m2_galon, anios_garantia, descripcion) values
('Pintuco Koraza® Doble Vida',                     'Pintura Acrílica de Alta Resistencia Exterior',      89900, 389900, 22, 7, 'Hidrorepelente con Bio-Shield, resistencia UV e intemperie para fachadas.'),
('Pintuco Viniltex® Avanzada',                     'Pintura Premium de Máxima Lavabilidad',              67900, 295000, 28, 5, 'Superlavable CleanGuard, bajo olor y cero VOC para interiores.'),
('Pintuco Aquaprotec® Baños & Cocinas',            'Recubrimiento Anti-Vapor y Antihongos Activo',       79900, 340000, 25, 5, 'Barrera antivapor y antihongos para zonas húmedas.'),
('Pintuco Barniz Marino Filtro Solar / Maderlux®', 'Protector e Impregnante de Maderas',                 84900, 360000, 18, 4, 'Protección UV e impregnación para madera y decks.'),
('Pintuco Esmalte Pintulux® 3 en 1 Anticorrosivo', 'Esmalte Alquídico con Neutralizador de Óxido',       74900, 320000, 20, 5, 'Convierte el óxido y protege metales y estructuras.'),
('Pintuco Pisos® Acrílico & Epóxico de Tráfico',   'Recubrimiento de Alto Tráfico Peatonal y Vehicular', 99900, 420000, 16, 5, 'Alta resistencia a abrasión para pisos y garajes.'),
('Pintuco Impermeabilizante Fibratado 7 Años',     'Membrana Líquida Elastomérica con Microfibras',      92900, 399900, 12, 7, 'Membrana elastomérica con microfibras para techos y cubiertas.');

insert into public.tienda (nombre, ciudad, direccion, telefono, stock_disponible) values
('Tienda Pintacasa Pintuco - Calle 80',        'Bogotá D.C.',          'Calle 80 # 69-45, Ferias',        '(601) 320 9000', true),
('Centro de Experiencia Pintuco - Calle 134',  'Bogotá D.C.',          'Av. Calle 134 # 19-32, Cedritos', '(601) 320 9001', true),
('Tienda Pintacasa Pintuco - Guayabal',        'Medellín (Antioquia)', 'Cra. 52 # 10-70, Guayabal',       '(604) 444 8000', true),
('Pintuco Store - Poblado Calle 10',           'Medellín (Antioquia)', 'Calle 10 # 43D-21, El Poblado',   '(604) 444 8002', true),
('Tienda Pintacasa Pintuco - Pasoancho',       'Cali (Valle)',         'Calle 13 # 66-10, Pasoancho',     '(602) 330 4000', true);

insert into public.maestro_certificado (nombre, calificacion, experiencia_anios, ciudad, telefono) values
('Carlos Mario Restrepo', 4.97, 14, 'Bogotá D.C.',          '+57 310 555 0101'),
('Diana Marcela Gómez',   4.94,  9, 'Medellín (Antioquia)', '+57 311 555 0102'),
('Andrés Felipe Valencia',4.89, 16, 'Cali (Valle)',         '+57 312 555 0103');

-- Verificación rápida
select 'producto' as tabla, count(*) from public.producto
union all select 'tienda',   count(*) from public.tienda
union all select 'maestro',  count(*) from public.maestro_certificado;
