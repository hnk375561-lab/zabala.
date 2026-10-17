# Auditoría de implementación · Zabala Automotores

Fecha de revisión: 16/10/2026.

## Qué muestra el sitio y de dónde sale

| Sección | Fuente | Estado |
|---|---|---|
| Portada, logo y galería de Instagram | Material de `@zabala_automotores` | Demo; autorización escrita pendiente |
| Stock (50 avisos), destacados, historial | Tienda de Zabala en Clasionce, 12/10/2026 | Respaldado; precios con fecha |
| Horarios por día | Perfil de Clasionce (lunes a sábados 8:00–21:30) | Una sola fuente; domingos y feriados no figuran |
| Contacto, WhatsApp, Instagram | Perfil de Clasionce | Respaldado |
| Cómo comprar, guía de usados | Orientación general | Sin promesas comerciales |
| Vender, permutar, consignar, visita, buscador de pedido | Formularios que arman un mensaje de WhatsApp | No guardan datos ni confirman turnos |
| Preguntas frecuentes | Respuestas que remiten a Zabala | Sin condiciones inventadas |
| En preparación | Una sola lámina al final de la página | Entregas y local, reseñas, dirección y mapa, financiación y usados |

## Qué se activa con material de Zabala

- Autorización escrita para fotos y videos de Instagram y para las fotos de los avisos.
- Dirección exacta, coordenadas y ficha de Maps.
- Domingos y feriados.
- Financiación, recepción de usados y consignación, tal como las defina Zabala.
- Fotos del frente, salón y entregas con permiso de cada cliente.
- Ficha de Google u otra fuente de reseñas.

## Publicación

`noindex`, `Disallow: /` y el aviso de demo siguen activos a propósito. `npm run test:prod` debe seguir fallando hasta recibir datos y autorizaciones.
