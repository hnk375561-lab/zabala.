# Auditoría de implementación · Zabala Automotores

Fecha de revisión: 12/10/2026. La revisión se hizo sobre el ZIP entregado. No se copiaron datos de Chita Automotores.

| Sección / sistema | Estado antes | Estado después |
|---|---|---|
| Identidad, demo no oficial y noindex | Existe | Conservado y explicitado |
| Catálogo, filtros, orden y estado vacío | Completo | Conservado |
| Datos del negocio y fuentes | Completo | Conservado; toda afirmación nueva queda pendiente si no tiene fuente |
| Galería de Instagram | Existe | Conservada como material de demo, con autorización pendiente |
| Horarios | Incompleto | Agregado bloque por día; domingo queda A CONFIRMAR |
| Entregas | Falta material autorizado | Agregado bloque de preparación; no se inventan fotos de entregas |
| Salón / frente del local | Falta material autorizado | Agregado placeholder FOTO A CARGAR |
| Dónde estamos | Incompleto: solo Paraná | Conservado sin dirección ni mapa inventados; consulta por WhatsApp |
| Reseñas | Sin fuente verificable | Agregado estado “sin reseñas verificadas” |
| Cómo comprar | Faltaba | Agregado como orientación general, sin promesas comerciales |
| Financiación | Faltaba | Agregado como A CONFIRMAR, sin cuotas, tasas ni condiciones |
| Comprar, vender, permutar y consignar | Faltaba | Agregado como consulta; ninguna prestación se afirma como disponible |
| Coordinación de visita | Página simple | Agregado formulario en una página y enlace a reserva.html; no confirma turnos |
| Guía de usados | Faltaba | Agregado checklist general; trámites quedan sujetos a verificación vigente |
| Buscador de pedido | Faltaba | Agregado formulario que abre WhatsApp; no guarda datos |
| Preguntas | Faltaba | Agregado acordeón con respuestas prudentes |
| Accesibilidad y motion | Parcial | Se mantiene HTML sin dependencias y se respeta reduced-motion |
| Seguridad de publicación | Parcial | Se mantiene robots Disallow y se agregan exclusiones de `golive/` |

## A CONFIRMAR / FOTO A CARGAR

- Dirección exacta, coordenadas y ficha de Maps.
- Domingo y feriados; confirmar si el horario publicado sigue vigente.
- Recepción de usados, permutas, consignación, financiación, gestoría, garantía y entrega.
- Autorización escrita para usar fotos, logo y materiales de Instagram.
- Fotos reales autorizadas del frente, salón, depósito y entregas.
- Ficha de Google, redes adicionales y reseñas verificables.
- Disponibilidad, precio y condiciones de cada aviso al momento de consulta.
- Vigencia de trámites y requisitos administrativos antes de publicar la guía como definitiva.

## Límites verificados de esta entrega

Estos puntos no se pueden cerrar sin nueva evidencia del dueño y por eso no se presentan como hechos:

- Hero con reel sonoro, mosaico de entregas/interiores y reel del salón: no hay video autorizado ni material real de Zabala en el ZIP; quedan placeholders o identidad estática.
- Carrusel de fotos por ficha de stock: el inventario no contiene fotos autorizadas asociadas de forma verificable a cada aviso; se mantiene el enlace al aviso fuente en lugar de inventar imágenes.
- Mapa interactivo, coordenadas, dirección, Waze y Apple Maps: solo está confirmada la ciudad; el sitio muestra un bloque de dirección pendiente, no un pin falso.
- Puntaje, cantidad y enlace a ficha de Google: no existe una ficha verificable en las fuentes recibidas; no se publica una cifra.
- Facebook: no se encontró una página verificable; el icono queda rotulado A CONFIRMAR.
- Producción/SEO: `noindex`, `Disallow: /` y el aviso de demo siguen activos deliberadamente; `test:prod` debe continuar fallando hasta recibir autorizaciones y datos de producción.
