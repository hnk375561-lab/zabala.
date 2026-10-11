# Integración del dossier de información pública (11/10/2026)

Fuente: `ZABALA_DOSSIER_VERIFICADO.txt`. Regla: el listado leído de la tienda el 11/10/2026 (`data/autos.json`) manda; el dossier aporta lo que ese listado no tiene y marca contradicciones.

## Qué se incorporó
- **Cobertura «Toda la región»** (confianza A, ficha de Clasionce): contacto, JSON-LD (`areaServed`) y `data/dealership.json › coverage`.
- **Leyenda de demo** recomendada por el dossier, visible bajo el header y en el pie.
- **Historial separado del stock**: los 3 vendidos salen de la lista principal y van a «Historial de avisos». Se agregó `data/historial.json` con 11 avisos que el dossier vio en capturas anteriores y que no están en el listado actual (sin enlace, sin presentarlos como stock).
- **Discrepancias entre capturas** (tarjeta + `data/sources.json › conflictos`): HR-V 2018 ($25,9 M / $26 M), HR-V 2020 ($31,8 M / $32 M), Hilux SRX 4x4 (US$ 30.000, antes US$ 32.000, en una captura), Versa 2018, Taos 1.4 y Focus («Vendido» en una captura). Ninguna se resuelve sola: se avisa y se confirma por WhatsApp.
- **Filtros** pedidos por el dossier: marca, modelo (búsqueda), año, tipo, transmisión y rango de precio. Pesos y dólares no se convierten: el rango se elige después de la moneda. Además: solo ofertas, solo negociables, orden por precio (dentro de cada moneda) y «Limpiar filtros».
- **Trazabilidad por unidad**: cada tarjeta indica «Fuente: Clasionce, 11/10/2026» y suma un botón «Consultar» por WhatsApp con el aviso en el mensaje.

## Qué NO se incorporó (sin fuente suficiente)
Dirección, razón social/CUIT, financiación, garantías, permutas como política, servicios extra, reseñas, métricas de Instagram, km de las unidades que no tienen ficha completa (los km del relevamiento previo de Up!, 308 y Toro deben revalidarse abriendo el aviso).

## Pendiente de validar (ver `data/pendientes.json`)
- Abrir los 11 avisos del historial.
- Confirmar que el número recibe WhatsApp y aprobar los botones por unidad.
- Autorización para logotipo, nombre y textos en la versión pública.

## Cómo actualizar
Editar `data/autos.json` / `data/historial.json` y correr `node scripts/build-index.mjs`.
