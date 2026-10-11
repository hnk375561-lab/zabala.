# Informe de investigación — Zabala Automotores
Fecha: 11/10/2026

## Resumen
La única fuente abierta con datos propios de Zabala es su **tienda en Clasionce (Elonce)**. De ahí salen contacto, horario, descripción y 53 avisos. Instagram, Facebook y Google no se pudieron leer de forma automática, y las búsquedas web generales no devolvieron ninguna página de Zabala.

## Datos incorporados (todos de Clasionce, 11/10/2026)
- **Negocio:** «Concesionaria Verificada · Identidad verificada» (insignia de Clasionce); Paraná, Entre Ríos; teléfono 3434732110; WhatsApp 5493434732110; Instagram @zabala_automotores; horario lunes a sábados 08:00–21:30; descripción propia («intermediación y reventa de vehículos»); sin valoraciones.
- **Stock:** 53 avisos (36 autos/SUV, 14 camionetas/utilitarios, 2 embarcaciones, 1 moto). 50 activos y 3 vendidos. Localidades: Paraná 51, Federal 1, María Grande 1.
- **Por aviso** (`data/autos.json`): título, año, transmisión, localidad, precio (pesos o dólares), precio anterior en las 16 ofertas, «negociable», estado vendido.
- **Fichas completas** (Focus, Jeep Compass, Ranger): km, color, combustible, puertas y descripción.

## Cambios respecto del sitio anterior
- 47 → 53 avisos: se suman 1 moto, 2 lanchas y 3 vendidos (los vendidos se muestran al final y atenuados).
- Ahora hay **precios**, con fecha y aviso de que pueden haber cambiado (antes no había fuente).
- Se agrega la descripción del negocio y la localidad de cada aviso.

## Descartado
- `PARANA AUTOMOTORES SRL` (Corrientes, CUIT 30-71668557-4) y `GANAUTO S.A.S.` (Paraná): salieron en la búsqueda pero **no son Zabala**. Directorios de Dun & Bradstreet: no mencionan a Zabala.
- Correos `comercial@clasionce.com` y `soporte@clasionce.com`: son de Clasionce.

## Conflictos sin resolver
1. Ford Focus N1164752: título 2014 vs ficha 2011. No se muestra año.
2. Toyota Hilux SRX N1165540: «$44M» y «$29.000» juntos. No se muestra precio.
3. Los 36/14 por tipo no se pueden asignar aviso por aviso.

## Fuentes consultadas
Ver `data/sources.json` (63 entradas: 13 fuentes generales y 50 avisos listados). Leídas completas: tienda (2 páginas), 3 fichas. Bloqueadas: Instagram, Facebook. N1164716: eliminado (HTTP 410).

## Pendientes
Ver `data/pendientes.json` (12 puntos). Los más importantes: confirmar con el dueño dirección, horario, servicios y autorización de fotos; copiar a mano el contenido de Instagram.

## Datos heredados de Chita (para revisar en el repo)
No pude abrir las carpetas del repo de Zabala (GitHub bloquea mi acceso). Según el listado de archivos que vi, estos nombres parecen venir del proyecto de Chita y conviene revisarlos y borrarlos si ya no se usan: `og-chita.png`, `APLICAR-TODO-v6.md`, `NOTAS-v65.md`, `PERF-CAMBIOS.md`, `cambios.patch`, `BORRAR.txt`, `manus-routes.json`, `plan.md`, y las carpetas `css/` y `js/` (el nuevo `index.html` ya no las usa). `npm test` del repo busca estos restos.

## Cómo actualizar
Editar `data/autos.json` y correr `node scripts/build-index.mjs`.
