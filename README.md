# Zabala Automotores · sitio demo

Sitio estático (`index.html`, `privacidad.html`, `reserva.html`, `404.html`) sin dependencias de build.

- `npm run dev` → http://localhost:8080
- `npm test` → valida `data/dealership.json` contra las páginas y busca restos del proyecto anterior.
- `npm run test:prod` → puerta de salida; falla mientras falten datos y autorizaciones (ver `data/pendientes.json`).

**Estado:** demo funcional (`noindex`, `robots.txt` con `Disallow: /`). Publica los datos respaldados por el Instagram `@zabala_automotores` y por la tienda en Clasionce (Elonce): nombre, rubro, Paraná (Entre Ríos), horario atribuido, teléfono/WhatsApp y 47 autos y utilitarios con enlace a su aviso. No hay dirección exacta, precios, km, financiación ni reseñas porque no hay fuente suficiente.

Los datos viven en `data/dealership.json`; la fuente de cada uno, en `data/sources.json`.
