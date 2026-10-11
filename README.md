# Zabala Automotores · sitio demo

Sitio estático (`index.html`, `privacidad.html`, `reserva.html`, `404.html`) sin dependencias de build.

- `npm run dev` → http://localhost:8080
- `npm test` → valida `data/dealership.json` contra las páginas y busca restos del proyecto anterior.
- `npm run test:prod` → puerta de salida; falla mientras falten datos y autorizaciones (ver `data/pendientes.json`).

**Estado:** demo funcional (`noindex`, `robots.txt` con `Disallow: /`). Solo publica datos respaldados por el perfil de Instagram `@zabala_automotores`: nombre, rubro, WhatsApp e Instagram. No hay dirección, horarios, stock, precios ni reseñas porque no hay fuente.

Los datos viven en `data/dealership.json`; la fuente de cada uno, en `data/sources.json`.
