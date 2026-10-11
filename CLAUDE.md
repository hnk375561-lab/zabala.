# Guía de mantenimiento

1. **Cero datos inventados.** Dirección, horarios, precios, unidades, servicios, financiación, antigüedad y reseñas solo se cargan con fuente pública citada o confirmación escrita del responsable. Si falta, no se publica.
2. Todo dato nuevo se registra en `data/sources.json` (fuente, URL, fecha de consulta, confianza) y en `data/dealership.json`.
3. El WhatsApp se repite en los enlaces de `index.html`, `404.html`, `reserva.html` y `privacidad.html`. Si cambia, actualizar los cuatro y correr `npm test`.
4. No cargar datos personales del dueño ni de su familia.
5. Mientras `publicacion.publicIndexing` sea `false`, las páginas llevan `noindex, nofollow` y `robots.txt` lleva `Disallow: /`. Al pasar a `true` (dominio y autorizaciones confirmados): quitar `noindex` y `Disallow`, cargar `sitemap.xml`, `canonical`, `og:url` y JSON-LD con la URL real.
6. Los archivos internos (`data/`, `docs/`, `scripts/`, notas) no se publican: ver `netlify.toml` y `_config.yml`.
7. Las fotos y videos los aporta el responsable. Antes de referenciarlos, confirmar autorización (`photos.authorized`) y que el archivo exista.
