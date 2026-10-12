// Genera index.html de Zabala Automotores: fondo negro, paleta de grises y plata del logotipo, cortes diagonales.
// Uso: node scripts/build-index.mjs   → escribe ../index.html
// Los datos salen de data/autos.json (listado de Clasionce sincronizado al 12/10/2026) y data/historial.json (avisos vistos solo en capturas anteriores).
// Para actualizar: editar esos JSON y volver a correrlo.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const N = {
  nombre: 'Zabala Automotores', ciudad: 'Paraná, Entre Ríos',
  tel: '343 473-2110', telTel: '+543434732110', wa: '5493434732110',
  ig: 'zabala_automotores', tienda: 'https://clasificados.elonce.com/concesionarias/zabala-automotores',
  horarios: 'Lunes a sábados de 8:00 a 21:30 (según nuestro perfil en Clasionce).',
  desc: 'Nos dedicamos a la intermediación y reventa de vehículos. Brindamos un servicio transparente y confiable.',
  cobertura: 'Toda la región',
  fecha: '12/10/2026',
  leyenda: 'Demo ilustrativa construida a partir de información pública. Precios, datos y disponibilidad sujetos a confirmación por Zabala Automotores.',
};
const wa = (txt) => `https://wa.me/${N.wa}?text=${encodeURIComponent(txt)}`;
const WA = wa('Hola! Quiero consultar por los autos disponibles.');
const IG = `https://www.instagram.com/${N.ig}/`;

const DB = JSON.parse(fs.readFileSync(path.join(root, 'data', 'autos.json'), 'utf8'));
const HIST = JSON.parse(fs.readFileSync(path.join(root, 'data', 'historial.json'), 'utf8')).avisos;
const FOTOS = JSON.parse(fs.readFileSync(path.join(root, 'data', 'instagram.json'), 'utf8')).fotos;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => n.toLocaleString('es-AR');
const precio = (p) => (p ? (p.moneda === 'USD' ? 'US$ ' : '$ ') + fmt(p.monto) : null);
const cars = DB.autos.map((a, i) => ({ ...a, i, tipo: a.tipo === 'Auto' ? 'Auto o utilitario' : a.tipo, m: a.marca, y: a.anio, t: a.titulo, tr: a.transmision || '', vend: a.estado === 'vendido' }));
const activos = cars.filter((c) => !c.vend);
const vendidosL = cars.filter((c) => c.vend);
const marcas = [...new Set(activos.map((c) => c.m))].sort((a, b) => a.localeCompare(b, 'es'));
const conteo = (m) => activos.filter((c) => c.m === m).length;
const topMarcas = [...marcas].sort((a, b) => conteo(b) - conteo(a) || a.localeCompare(b, 'es')).slice(0, 4);
const nEmb = activos.filter((c) => c.tipo === 'Embarcación').length, nMoto = activos.filter((c) => c.tipo === 'Moto').length;
const nAutos = activos.length - nEmb - nMoto;
const nOferta = activos.filter((c) => c.precio && c.precio.oferta).length, nNegoc = activos.filter((c) => c.negociable).length;
const nUsd = activos.filter((c) => c.precio && c.precio.moneda === 'USD').length, nArs = activos.filter((c) => c.precio && c.precio.moneda === 'ARS').length;
const locs = Object.entries(cars.reduce((o, c) => ((o[c.localidad] = (o[c.localidad] || 0) + 1), o), {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
const vendidos = vendidosL.length;
// Avisos cuyos datos se contradicen entre capturas del portal: se aclara en la tarjeta en vez de elegir uno.
const OTRA_VENDIDO = 'Otra captura del portal lo mostró como vendido: te confirmamos la disponibilidad por WhatsApp.';
const NOTAS = {
  N1164752: ['El título del aviso dice 2014 y la ficha 2011: te confirmamos el año por WhatsApp.', OTRA_VENDIDO],
  N1165540: ['El aviso muestra montos distintos según la captura (una mostró US$ 30.000 con precio anterior US$ 32.000): te confirmamos el precio por WhatsApp.'],
  N1165353: ['Otra captura del portal mostró $ 26.000.000: te confirmamos el precio por WhatsApp.'],
  2146368: ['Otra captura del portal mostró $ 32.000.000: te confirmamos el precio por WhatsApp.'],
  N1164426: [OTRA_VENDIDO],
  N1163973: [OTRA_VENDIDO],
  N1166453: [OTRA_VENDIDO],
  N1166228: [OTRA_VENDIDO],
};

const card = (c) => {
  const p = precio(c.precio), ant = c.precio && c.precio.anterior ? precio({ moneda: c.precio.moneda, monto: c.precio.anterior }) : null;
  const badges = [c.vend ? '<i class="bd v">Vendido</i>' : '', c.precio && c.precio.oferta && !c.vend ? '<i class="bd o">Oferta</i>' : '', c.negociable && !c.vend ? '<i class="bd">Negociable</i>' : ''].join('');
  const f = c.ficha || {};
  const meta = [c.y ? c.y : '', c.tr, f.km ? fmt(f.km) + ' km' : '', f.combustible || '', f.color || '', f.puertas ? f.puertas + ' puertas' : '', c.localidad !== 'Paraná' ? c.localidad : ''].filter(Boolean).join(' · ');
  const notas = [f.nota, ...(NOTAS[c.id] || []), !f.nota && c.id === 'N1140083' ? 'El aviso indica: vendo o permuto.' : ''].filter(Boolean);
  const nota = notas.map((t) => `<p class="car-n">${esc(t)}</p>`).join('');
  const pr = p ? `<p class="car-p"><b>${p}</b>${ant ? ` <s>${ant}</s>` : ''}</p>` : '<p class="car-p"><b>Consultar precio</b></p>';
  const nombre = `${c.t}${c.y ? ' ' + c.y : ''}`;
  const consulta = c.vend ? '' : `<a class="btn o sm" href="${wa(`Hola! Quiero consultar por el ${nombre} (aviso ${c.id} en Clasionce).`)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp sobre ${esc(nombre)}">Consultar</a>`;
  const mo = c.precio ? c.precio.moneda : '';
  return `<li class="car t${c.i % 3}${c.vend ? ' vend' : ''}" data-m="${esc(c.m)}" data-tr="${esc(c.tr)}" data-tp="${esc(c.tipo)}" data-y="${c.y ?? 0}" data-i="${c.i}" data-mo="${mo}" data-pm="${c.precio ? c.precio.monto : 0}" data-of="${c.precio && c.precio.oferta ? 1 : 0}" data-ng="${c.negociable ? 1 : 0}" data-q="${esc((c.t + ' ' + (c.y ?? '')).toLowerCase())}"><div class="car-art" aria-hidden="true">${c.fotos?.[0] ? `<img src="${esc(c.fotos[0])}" width="800" height="1000" loading="lazy" decoding="async" alt="">` : ''}<span class="car-y">${c.y ?? '—'}</span><i class="car-tag">${esc(c.m)}</i></div><div class="car-b"><div class="bds">${badges}</div><h3>${esc(c.t)}</h3><p class="car-meta">${esc(meta)}</p>${pr}${nota}<div class="car-act"><a class="btn p sm" href="${c.url}" target="_blank" rel="noopener noreferrer" aria-label="Ver aviso de ${esc(nombre)} en Clasionce">Ver aviso ↗</a>${consulta}</div><p class="car-s">Fuente: Clasionce, ${N.fecha}</p></div></li>`;
};
const hrow = (h, k) => {
  const p = precio(h.precio), ant = h.precio.anterior ? precio({ moneda: h.precio.moneda, monto: h.precio.anterior }) : null;
  const meta = [h.anio, h.transmision, h.localidad !== 'Paraná' ? h.localidad : ''].filter(Boolean).join(' · ');
  const tags = [h.precio.oferta ? 'Oferta' : '', h.negociable ? 'Negociable' : '', h.vendidoEnCaptura ? 'Vendido en la captura' : ''].filter(Boolean).join(' · ');
  return `<li class="hr${k % 2 ? ' alt' : ''}"><b>${esc(h.titulo)}</b><span>${esc(meta)}</span><span class="hr-p">${p}${ant ? ` <s>${ant}</s>` : ''}</span>${tags ? `<i>${esc(tags)}</i>` : ''}</li>`;
};

const foto = (f, k) => `<li class="gi g${k % 3}"><a href="${f.archivo}" aria-label="Ampliar foto: ${esc(f.alt)}"><img src="${f.miniatura}" width="${f.ancho}" height="${f.alto}" alt="Foto del Instagram de Zabala: ${esc(f.alt)}" loading="lazy" decoding="async"></a></li>`;

const ld = { '@context': 'https://schema.org', '@type': 'AutoDealer', name: N.nombre, description: 'Intermediación y reventa de vehículos.', telephone: N.telTel, areaServed: N.cobertura, address: { '@type': 'PostalAddress', addressLocality: 'Paraná', addressRegion: 'Entre Ríos', addressCountry: 'AR' }, openingHours: 'Mo-Sa 08:00-21:30', sameAs: [IG] };

const css = fs.readFileSync(path.join(root, 'scripts', 'zabala.css'), 'utf8').trim();
const js = fs.readFileSync(path.join(root, 'scripts', 'zabala.js'), 'utf8').trim();
const opt = (v, t) => `<option value="${v}">${t}</option>`;

const html = `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Zabala Automotores · Intermediación y reventa de vehículos en Paraná</title>
<meta name="description" content="Zabala Automotores en Paraná, Entre Ríos: intermediación y reventa de vehículos. Consultá por WhatsApp o mirá los autos publicados.">
<meta name="theme-color" content="#0d0d0d">
<link rel="manifest" href="site.webmanifest">
<link rel="icon" type="image/png" href="images/zabala-z.png">
<link rel="preload" href="images/zabala-logo.webp" as="image" type="image/webp">
<link rel="preload" href="fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
${css}
</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#autos">Saltar al contenido</a>
<header><div class="w"><a class="mark" href="./" aria-label="Zabala Automotores, inicio">Zabala<small>Automotores</small></a>
<nav aria-label="Principal"><a href="#autos">Autos</a><a href="#stock">Stock</a><a href="#galeria">Fotos</a><a href="#historial">Historial</a><a href="#contacto">Contacto</a><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></nav>
<div class="hc"><a class="ic" href="${IG}" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Zabala Automotores"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg></a><a class="btn p cut" href="${WA}" target="_blank" rel="noopener noreferrer">Escribinos</a></div></div></header>
<p class="demo"><span>${N.leyenda}</span></p>
<main id="top">
<div class="hero"><div class="hx-copy">
<h1><span class="sr">Zabala Automotores: </span>Autos y utilitarios <em>en Paraná</em></h1>
<p class="lead">${N.desc} Mirá los vehículos publicados y consultanos por WhatsApp.</p>
<div class="row"><a class="btn p cut" href="#autos">Ver autos</a><a class="btn o" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
<a class="proof" href="#autos"><b>${activos.length}</b><span>vehículos publicados en Clasionce</span></a></div>
<figure class="hx-logo"><img src="images/zabala-logo.webp" width="640" height="641" alt="Logotipo de Zabala Automotores: una Z que combina un auto y una lancha" fetchpriority="high" decoding="async"></figure>
</div>

<section id="stock" class="st" aria-labelledby="stock-t"><div class="w">
<span class="ey">Stock</span><h2 id="stock-t">Stock <em>de un vistazo</em></h2>
<div class="st-g">
<div class="stt"><b>${activos.length}</b><span>vehículos publicados y disponibles en Clasionce</span></div>
<div class="stt"><b>${nAutos}</b><span>autos, camionetas y utilitarios</span></div>
<div class="stt"><b>${nOferta}</b><span>avisos con precio rebajado (figura el precio anterior tachado)</span></div>
<div class="stt"><b>${nEmb + nMoto}</b><span>${nMoto ? nMoto + ' moto' : ''}${nMoto && nEmb ? ' y ' : ''}${nEmb ? nEmb + ' embarcaciones' : ''}</span></div>
<div class="stt wide"><p class="stt-t">Marcas con más unidades</p><ul>${topMarcas.map((m) => `<li>${esc(m)}<i>${conteo(m)}</i></li>`).join('')}</ul></div>
<div class="stt wide"><p class="stt-t">Localidad de los avisos (${cars.length} en total)</p><ul>${locs.map(([l, n]) => `<li>${esc(l)}<i>${n}</i></li>`).join('')}</ul></div>
</div>
<p class="st-n">Relevado de nuestra tienda en Clasionce el ${N.fecha}. ${nNegoc} avisos figuran como negociables; ${nArs} publican el precio en pesos y ${nUsd} en dólares, y no se convierten. La localidad es la que declara cada aviso y no implica sucursales. La cantidad de avisos cambia según el momento de la consulta (otras capturas del portal mostraron 51 y 55). Hay ${vendidos} avisos marcados como vendidos: están en el historial, al final de la página.</p>
</div></section>

<section id="autos" aria-labelledby="autos-t"><div class="w">
<span class="ey">Autos</span><h2 id="autos-t">Nuestros <em>autos</em></h2>
<p class="sec-p">Vehículos disponibles publicados por Zabala Automotores en Clasionce (Elonce), según su tienda al ${N.fecha}: ${nAutos} autos, camionetas y utilitarios${nMoto ? ', ' + nMoto + ' moto' : ''}${nEmb ? ' y ' + nEmb + ' embarcaciones' : ''}. Los precios son los que figuran en cada aviso a esa fecha, en su moneda original, y pueden haber cambiado: escribinos por el que te interese y te confirmamos disponibilidad, precio y detalles.</p>
<form class="flt" id="flt" hidden onsubmit="return false" role="search" aria-label="Filtrar autos">
<label class="f-q"><span class="sr">Buscar por marca o modelo</span><input id="fq" type="search" placeholder="Buscar marca o modelo" autocomplete="off"></label>
<label class="f-s"><span class="sr">Marca</span><select id="fm"><option value="">Todas las marcas</option>${marcas.map((m) => `<option value="${esc(m)}">${esc(m)} (${conteo(m)})</option>`).join('')}</select></label>
<label class="f-s"><span class="sr">Tipo</span><select id="ft"><option value="">Todos los tipos</option><option value="Auto o utilitario">Autos y utilitarios</option><option value="Moto">Motos</option><option value="Embarcación">Embarcaciones</option></select></label>
<label class="f-s"><span class="sr">Año</span><select id="fy"><option value="">Cualquier año</option>${opt('2020+', '2020 o más nuevo')}${opt('2015-2019', '2015 a 2019')}${opt('2010-2014', '2010 a 2014')}${opt('-2009', '2009 o más viejo')}</select></label>
<label class="f-s"><span class="sr">Moneda del precio</span><select id="fc"><option value="">Cualquier moneda</option><option value="ARS">Precio en pesos</option><option value="USD">Precio en dólares</option></select></label>
<label class="f-s"><span class="sr">Rango de precio (elegí primero la moneda)</span><select id="fp" disabled><option value="">Rango de precio</option></select></label>
<div class="f-c" role="group" aria-label="Transmisión"><button type="button" class="chip on" data-tr="" aria-pressed="true">Todos</button><button type="button" class="chip" data-tr="Automático" aria-pressed="false">Automático</button><button type="button" class="chip" data-tr="Manual" aria-pressed="false">Manual</button></div>
<div class="f-c" role="group" aria-label="Condiciones"><button type="button" class="chip tg" id="fof" aria-pressed="false">Solo ofertas</button><button type="button" class="chip tg" id="fng" aria-pressed="false">Solo negociables</button></div>
<label class="f-s"><span class="sr">Ordenar</span><select id="fo"><option value="i">Orden de la lista</option><option value="yd">Año: mayor a menor</option><option value="ya">Año: menor a mayor</option><option value="pa">Precio: menor a mayor</option><option value="pd">Precio: mayor a menor</option></select></label>
<button type="button" class="chip lim" id="flm">Limpiar filtros</button>
<p class="f-n" id="fn" role="status" aria-live="polite"></p></form>
<ul class="cars" id="cars">
${activos.map(card).join('\n')}
</ul>
<p class="vacio" id="vac" hidden>No hay autos con ese filtro. Probá con otra combinación o escribinos por WhatsApp.</p>
<div class="row mt"><a class="btn p cut" href="${N.tienda}" target="_blank" rel="noopener noreferrer">Ver la tienda en Clasionce</a><a class="btn o" href="${IG}" target="_blank" rel="noopener noreferrer">Ver más en Instagram</a></div>
</div></section>

<section id="galeria" class="gal" aria-labelledby="gal-t"><div class="w">
<span class="ey">Instagram</span><h2 id="gal-t">Fotos <em>del Instagram</em></h2>
<p class="sec-p">Imágenes publicadas en el perfil @${N.ig}. Es una muestra del perfil, no un listado: no todas las unidades que aparecen siguen disponibles. Si te gustó alguna, escribinos y te decimos si hay una igual o parecida.</p>
<ul class="gal-g" id="gal">
${FOTOS.map(foto).join('\n')}
</ul>
<div class="row mt"><a class="btn p cut" href="${IG}" target="_blank" rel="noopener noreferrer">Ver el perfil en Instagram</a><a class="btn o" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
</div></section>

<dialog id="lb" class="lb" aria-label="Foto ampliada"><figure><img alt="" width="1200" height="800"><figcaption></figcaption></figure><button type="button" class="lb-b lb-x" aria-label="Cerrar">✕</button><button type="button" class="lb-b lb-p" aria-label="Foto anterior">‹</button><button type="button" class="lb-b lb-n" aria-label="Foto siguiente">›</button></dialog>

<section id="historial" class="hist" aria-labelledby="hist-t"><div class="w">
<span class="ey">Historial</span><h2 id="hist-t">Historial <em>de avisos</em></h2>
<p class="sec-p">Acá no hay stock: son avisos que ya no figuran como disponibles o que solo se vieron en capturas anteriores del portal. Se muestran para que quede el registro completo y no se ofrecen como unidades en venta.</p>
<details><summary>Marcados como vendidos en Clasionce (${vendidos})</summary>
<div class="dt-b"><ul class="cars">
${vendidosL.map(card).join('\n')}
</ul></div></details>
<details><summary>Vistos en capturas anteriores del portal (${HIST.length})</summary>
<div class="dt-b"><p class="dt-n">No figuran en el listado del ${N.fecha}: pueden estar vendidos, pausados o dados de baja. Se conserva el último precio visto, en su moneda original, y no tienen enlace de aviso. Para saber si hay algo parecido disponible, escribinos.</p>
<ul class="hl">
${HIST.map(hrow).join('\n')}
</ul></div></details>
</div></section>

<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<span class="ey">Contacto</span><h2 id="contacto-t">Horarios y <em>contacto</em></h2>
<div class="ct-g"><dl><dt>Ubicación</dt><dd>${N.ciudad}. La dirección exacta todavía no está confirmada: consultala por WhatsApp.${locs.length > 1 ? ` Algunos avisos están en ${locs.filter(([l]) => l !== 'Paraná').map(([l]) => esc(l)).join(' y ')}.` : ''}</dd>
<dt>Cobertura</dt><dd>${N.cobertura} <small class="src">(según el perfil de nuestra tienda en Clasionce)</small></dd>
<dt>Horario</dt><dd>${N.horarios}</dd>
<dt>Quiénes somos</dt><dd>${N.desc} <small class="src">(descripción de nuestra tienda en Clasionce)</small></dd>
<dt>Teléfono y WhatsApp</dt><dd><a href="tel:${N.telTel}">${N.tel}</a></dd>
<dt>Dónde publicamos</dt><dd><a href="${N.tienda}" target="_blank" rel="noopener noreferrer">Tienda en Clasionce (Elonce)</a> · <a href="${IG}" target="_blank" rel="noopener noreferrer">@${N.ig}</a><br><span class="ok">Concesionaria con identidad verificada en Clasionce</span></dd></dl>
<div class="ct-c"><p class="ct-t">¿Te gustó alguno?</p><p>Escribinos y te contamos disponibilidad, precio y detalles del auto que te interese.</p><div class="row"><a class="btn p cut" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a><a class="btn o" href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></div></div></div>
</div></section>
</main>
<footer><div class="w"><p>© 2026 Zabala Automotores</p><p>${N.leyenda}</p><p class="demo-note" data-demo-note>Versión de demostración · No es el sitio oficial · Datos pendientes de confirmación</p><p>Datos tomados de la tienda de Zabala en Clasionce el ${N.fecha}. La etiqueta «identidad verificada» es de Clasionce, no una certificación oficial.</p><p><a href="privacidad.html">Privacidad y avisos</a></p></div></footer>
<script>
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`index.html: ${cars.length} autos (${activos.length} disponibles), ${HIST.length} en historial, ${FOTOS.length} fotos, ${marcas.length} marcas, ${(html.length / 1024).toFixed(1)} KB`);
