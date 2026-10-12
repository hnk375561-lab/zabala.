# Integración del material de Instagram (zabala_files.zip, 11/10/2026)

## Qué traía el zip
- `saved_resource.html`: era la pantalla `facebook.com/instagram/login_sync`, **sin** biografía, seguidores, epígrafes, fechas ni precios. Los `.js`/`.css` son del sitio de Meta.
- 44 imágenes: 38 fotos de publicaciones, 1 publicación con el logotipo, 1 foto de perfil (150 px) y 4 imágenes que no son de Zabala (otras cuentas y un avatar vacío), descartadas.

## Qué se implementó
- **Galería «Fotos del Instagram»** (`#galeria`): 38 fotos, de la más nueva a la más vieja según el id del archivo, con miniaturas de 640 px y versión ampliada de 1280 px en WebP (`images/ig/`), carga diferida y visor con teclado (flechas y Esc). Sin JavaScript cada miniatura abre la foto grande.
- Cada foto lleva un texto alternativo que describe solo lo que se ve (por ejemplo «SUV blanca»); las marcas se nombran cuando el emblema se distingue.
- La galería avisa que es una muestra del perfil y que no todas las unidades siguen disponibles.
- Registro en `data/instagram.json`, `data/dealership.json › photos`, `data/sources.json` y `data/pendientes.json`.

## Qué NO se hizo
- No se asignaron fotos a avisos concretos: sin epígrafes ni IDs, relacionar un modelo con un aviso por la imagen es una suposición. Varias fotos (Renegade, C3, Ranger, Hilux GR, Maverick, lanchas) además no coinciden con ningún aviso actual.
- No se inventaron datos del perfil (seguidores, biografía, fechas).

## Pendiente
- Autorización escrita de Zabala para usar las fotos en la versión pública (`photos.authorized` sigue en `false`).
- Volver a guardar el perfil con sesión iniciada para tener epígrafes y poder poner fotos en las tarjetas.

Para sumar o cambiar fotos: editar `data/instagram.json`, dejar los archivos en `images/ig/` y correr `node scripts/build-index.mjs`.
