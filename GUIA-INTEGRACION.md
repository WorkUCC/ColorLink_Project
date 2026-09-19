# ColorLink by Pintuco — Integración Frontend ↔ Supabase

Entregable de la jornada del 12 de septiembre (Transformación Digital Inteligente).
Cubre los 5 puntos del correo: modelo de datos, datos de conexión, configuración desde
Google AI Studio, iteración hasta conexión exitosa y pruebas funcionales.

---

## 1. Implementar el modelo de datos en Supabase

En Supabase → **SQL Editor** → *New query*, ejecutar en este orden:

| Orden | Archivo | Qué hace |
|---|---|---|
| 1 | `sql/01_schema.sql` | Crea las 9 tablas del diagrama con PK, FK, tipos y restricciones |
| 2 | `sql/02_seed.sql` | Carga catálogo: 7 productos, 5 tiendas, 3 maestros certificados |
| 3 | `sql/03_rls.sql` | Habilita RLS y crea las políticas de acceso |

Tablas creadas: `usuario`, `producto`, `tienda`, `maestro_certificado`, `proyecto`,
`recomendacion`, `pedido`, `servicio`, `garantia`.

Verificación visual: **Table Editor** debe mostrar las 9 tablas, y **Database → Schema
Visualizer** debe reproducir el mismo diagrama de relaciones que hizo el equipo.

### Decisiones tomadas frente al diagrama original

- `experiencia_años` quedó como **`experiencia_anios`**: PostgreSQL acepta la `ñ` solo si
  se usan comillas dobles en cada consulta, lo que complica el código del frontend.
- `dirección` quedó como **`direccion`**, por el mismo motivo.
- Los PK son `bigint generated always as identity` (autoincremental), no texto.
- Se agregaron columnas de apoyo que el frontend ya maneja y el diagrama no contemplaba:
  `color_hex`, `ciudad`, `direccion` y `notas` en `proyecto`; `precio_cunete`,
  `rendimiento_m2_galon` y `anios_garantia` en `producto`. Son aditivas, no rompen el modelo.
- Se usan `CHECK` en `urgencia`, `tipo_perfil`, `metodo_entrega`, `metodo_pago` y
  `estado_tracking` para que la base de datos solo acepte los mismos valores que declara
  `src/types.ts`. Esto es lo que valida el punto 5 del entregable.

---

## 2. Obtener los datos de conexión

En Supabase → **Project Settings**:

- **Data API → Project URL** → `https://<ref>.supabase.co`
- **API Keys → anon / publishable** → la clave que va en el frontend.

Copiar `.env.local.example` como `.env.local` y llenar:

```
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<clave anon>"
```

> La clave `service_role` **no** se pone nunca en el frontend: ignora RLS y quedaría
> expuesta en el bundle del navegador. Es un punto que vale la pena mencionar en la
> sustentación.

---

## 3. Configurar la conexión (archivos del proyecto)

Instalar la dependencia:

```bash
npm install @supabase/supabase-js
```

Archivos que se agregan o reemplazan en el proyecto del ZIP:

| Archivo | Acción |
|---|---|
| `src/lib/supabaseClient.ts` | **nuevo** — cliente único + función `probarConexion()` |
| `src/lib/colorlinkApi.ts` | **nuevo** — capa de datos (SELECT e INSERT por tabla) |
| `src/components/SupabaseTestPanel.tsx` | **nuevo** — panel de pruebas de integración |
| `src/App.tsx` | **reemplazar** — ya trae el wizard conectado a la BD |
| `vite.config.ts` | **reemplazar** — expone las variables de entorno |
| `.env.local` | **nuevo** — credenciales (no subir a Git) |

### Si el frontend se sigue editando desde Google AI Studio

Pegarle este prompt al agente para que no rompa la integración:

> Integra Supabase como capa de persistencia. Usa `@supabase/supabase-js` con un cliente
> único en `src/lib/supabaseClient.ts` que lea `import.meta.env.VITE_SUPABASE_URL` y
> `import.meta.env.VITE_SUPABASE_ANON_KEY`. Toda consulta pasa por `src/lib/colorlinkApi.ts`.
> Las tablas son: usuario, producto, tienda, maestro_certificado, proyecto, recomendacion,
> pedido, servicio, garantia. Al completar el NeedWizard inserta en `proyecto` y
> `recomendacion`; al cerrar el flujo inserta en `pedido`, `servicio` y `garantia`.
> No escribas credenciales en el código y no uses la service_role key. Si Supabase falla,
> la app debe seguir funcionando con los datos de demo, sin pantalla en blanco.

---

## 4. Iterar hasta la conexión exitosa — errores frecuentes

Tabla para documentar el proceso (el profe lo pidió explícitamente):

| Error | Causa | Solución |
|---|---|---|
| `new row violates row-level security policy` (42501) | RLS activo sin políticas de INSERT | Ejecutar `sql/03_rls.sql` |
| El SELECT devuelve `[]` sin error | RLS activo sin política de SELECT | Igual que el anterior |
| `Invalid API key` | Se usó la clave equivocada o quedó cortada al copiar | Volver a copiar la clave *anon* completa |
| `Failed to fetch` / error de CORS | URL mal escrita o proyecto pausado | Revisar `VITE_SUPABASE_URL`; Supabase pausa proyectos free sin uso |
| `supabaseUrl is required` | Vite no leyó el `.env.local` | El archivo va en la raíz, las variables llevan prefijo `VITE_`, y hay que **reiniciar** `npm run dev` |
| `column "experiencia_años" does not exist` | Nombre con `ñ` | Usar `experiencia_anios` |
| `violates check constraint "proyecto_urgencia_check"` | El valor enviado no está en la lista permitida | Enviar `urgente_24h`, `esta_semana` o `proximo_mes` |
| `insert or update violates foreign key constraint` | Se insertó la hija antes que la madre | Respetar el orden: usuario → proyecto → recomendacion → pedido → servicio/garantia |
| `duplicate key value violates unique constraint "usuario_correo_key"` | Correo repetido | La función `guardarUsuario` usa `upsert` con `onConflict: "correo"` |

---

## 5. Pruebas funcionales de integración

Levantar la app y abrirla con el parámetro de pruebas:

```bash
npm run dev
# luego: http://localhost:3000/?pruebas=1
```

El panel ejecuta y muestra evidencia de las cuatro pruebas exigidas:

1. **Conexión** — SELECT liviano con `count` sobre `producto`.
2. **Lectura** — trae productos y tiendas filtradas por la ciudad del proyecto.
3. **INSERT desde el formulario** — inserta `proyecto` y `recomendacion` con los datos que
   el usuario llenó en el wizard, y devuelve los IDs generados.
4. **Validación contra el modelo** — relee el registro con sus relaciones
   (`proyecto → recomendacion → producto`) y compara `m2`, `superficie` y
   `color_seleccionado` con lo que se envió.

### Evidencias sugeridas para entregar

- Captura del **Schema Visualizer** de Supabase.
- Captura del panel de pruebas con los cuatro checks en verde.
- Captura del **Table Editor** mostrando las filas nuevas en `proyecto` y `recomendacion`.
- La tabla de errores del punto 4 con los que realmente les salieron.

---

## Estado actual y lo que queda pendiente

Ya conectado:

- `proyecto` y `recomendacion` se insertan al terminar el wizard.
- `pedido`, `servicio` y `garantia` se insertan al cerrar el flujo (paso 6).
- Catálogos disponibles vía `obtenerProductos`, `obtenerTiendas`, `obtenerMaestros`.

Pendiente para la siguiente iteración:

- El paso 4 (SupplyAvailability) todavía lee las tiendas del archivo `pintucoData.ts`;
  al cambiarlo por `obtenerTiendas()` se puede enviar el `id_tienda` real al pedido.
- El paso 5 (ServiceTracking) todavía lee los maestros del archivo; al cambiarlo por
  `obtenerMaestros()` se envía el `id_maestro` real al servicio.
- La tabla `usuario` guarda `contrasena_hash` pero el login sigue siendo simulado.
  Lo correcto sería migrar a Supabase Auth en vez de manejar contraseñas propias.
