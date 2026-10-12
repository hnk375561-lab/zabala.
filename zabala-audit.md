# Auditoría y actualización de Zabala Automotores

**Fecha de relevamiento:** 12/10/2026  
**Fuente principal:** [tienda pública de Zabala en Clasionce](https://clasificados.elonce.com/concesionarias/zabala-automotores), páginas 1 y 2.

## Cambios aplicados

- Sincronizado el catálogo vigente: **52 avisos**.
- Disponibles: **50**.
- Marcados como vendidos actualmente en la fuente: **2** (Jeep Compass 2025 y Mercedes-Benz Sprinter 2018).
- Distribución publicada por Clasionce: **36 autos/SUV, 13 camionetas/utilitarios, 2 embarcaciones y 1 moto**.
- Localidades verificadas: **Paraná (50), Federal (1) y María Grande (1)**.
- Actualizados precios, ofertas, moneda, transmisión, año cuando no existe conflicto, localidad, estado y enlaces de los 52 avisos.
- Se conservó como pendiente el precio ambiguo de la Toyota Hilux SRX N1165540, porque la fuente muestra formatos incompatibles (`$44M` y `$29.000`).
- Se conservó como pendiente el año del Ford Focus N1164752 porque el título y los datos del aviso no coinciden.
- Descargadas **4 fotos por aviso (208 archivos)** desde la imagen pública de cada ficha en Clasionce, usando la variante `_l` de mayor resolución disponible. Cada tarjeta del catálogo ahora muestra la primera foto de su propio aviso; ya no se usan imágenes genéricas para representar autos.
- La galería de Instagram se mantiene separada y rotulada como muestra del perfil, no como stock actual.
- Actualizados los contadores y la fecha visible del sitio al **12/10/2026**.

## Validaciones

- `npm test`: **OK**.
- `git diff --check`: **OK**.
- 52 registros en `data/autos.json`; 52 registros en `data/vehicles.json`.
- 52/52 vehículos tienen fotos locales; no hay referencias de fotos faltantes.
- Capturas revisadas en desktop (1440 px) y móvil (390 px); no se observaron desbordes.
- `npm run test:prod` sigue fallando deliberadamente porque el sitio continúa configurado como demo: noindex, dirección exacta pendiente, autorización formal de fotos pendiente y aviso de demo activo.

## Versionado

- Commit local: `863c855 Sincronizar catálogo y fotos de Zabala`.
- Rama: `auditoria-completa-2026-10-12`.
- El push a GitHub fue rechazado por el remoto con HTTP 403 (`Permission to hnk375561-lab/zabala..git denied`); el trabajo queda completo y guardado localmente.

## Pendientes que no se inventaron

- Dirección exacta y coordenadas.
- Razón social, CUIT y condición societaria.
- Autorización formal de fotos para publicación productiva.
- Confirmación de precios/estado en el momento de contacto.
- Definición de pasar de demo a sitio oficial indexable.
