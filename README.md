# Zabala Automotores · sitio demo

Sitio estático (`index.html`, `privacidad.html`, `reserva.html`, `404.html`) sin dependencias de build.

- `npm run dev` → http://localhost:8080
- `npm test` → valida `data/dealership.json` contra las páginas y busca restos del proyecto anterior.
- `npm run test:prod` → puerta de salida; falla mientras falten datos y autorizaciones (ver `data/pendientes.json`).

**Estado:** demo funcional (`noindex`, `robots.txt` con `Disallow: /`). Incluye catálogo con filtros y orden, galería, contacto, horarios por día, consultas de compra/venta, coordinación de visita, guía y preguntas frecuentes. Los datos publicados están respaldados por el perfil de la tienda en Clasionce y por el material aportado de `@zabala_automotores`; no se publican dirección exacta, mapa, reseñas ni condiciones comerciales sin confirmación.

Los datos viven en `data/dealership.json`; la fuente de cada uno, en `data/sources.json`. La auditoría de cobertura y los pendientes están en `docs/AUDITORIA-ZABALA.md`.
