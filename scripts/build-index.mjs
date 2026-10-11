// Genera index.html de Zabala Automotores con el diseño de Chita (azul/rojo, cortes diagonales).
// Uso: node scripts/build-index.mjs   → escribe ../index.html
// Los datos salen de data/autos.json (relevado de Clasionce). Para actualizar: editar ese JSON y volver a correrlo.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const N = {
  nombre: 'Zabala Automotores', ciudad: 'Paraná, Entre Ríos',
  tel: '343 473-2110', telTel: '+543434732110', wa: '5493434732110',
  ig: 'zabala_automotores', tienda: 'https://clasificados.elonce.com/concesionarias/zabala-automotores',
  horarios: 'Lunes a sábados de 8:00 a 21:30 (según nuestro perfil en Clasionce).',
  desc: 'Nos dedicamos a la intermediación y reventa de vehículos. Brindamos un servicio transparente y confiable.',
};
const WA = `https://wa.me/${N.wa}?text=${encodeURIComponent('Hola! Quiero consultar por los autos disponibles.')}`;
const IG = `https://www.instagram.com/${N.ig}/`;

const DB = JSON.parse(fs.readFileSync(path.join(root, 'data', 'autos.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => n.toLocaleString('es-AR');
const precio = (p) => (p ? (p.moneda === 'USD' ? 'US$ ' : '$ ') + fmt(p.monto) : null);
const cars = DB.autos.map((a, i) => ({ ...a, i, m: a.marca, y: a.anio, t: a.titulo, tr: a.transmision || '', vend: a.estado === 'vendido' }));
const activos = cars.filter((c) => !c.vend);
const marcas = [...new Set(cars.map((c) => c.m))].sort((a, b) => a.localeCompare(b, 'es'));
const conteo = (m) => activos.filter((c) => c.m === m).length;
const topMarcas = [...marcas].sort((a, b) => conteo(b) - conteo(a) || a.localeCompare(b, 'es')).slice(0, 4);
const nEmb = activos.filter((c) => c.tipo === 'Embarcación').length, nMoto = activos.filter((c) => c.tipo === 'Moto').length;
const nAutos = activos.length - nEmb - nMoto;

const card = (c) => {
  const p = precio(c.precio), ant = c.precio && c.precio.anterior ? precio({ moneda: c.precio.moneda, monto: c.precio.anterior }) : null;
  const badges = [c.vend ? '<i class="bd v">Vendido</i>' : '', c.precio && c.precio.oferta && !c.vend ? '<i class="bd o">Oferta</i>' : '', c.negociable && !c.vend ? '<i class="bd">Negociable</i>' : ''].join('');
  const f = c.ficha || {};
  const meta = [c.y ? c.y : '', c.tr, f.km ? fmt(f.km) + ' km' : '', f.combustible || '', c.localidad !== 'Paraná' ? c.localidad : ''].filter(Boolean).join(' · ');
  const nota = f.nota ? `<p class="car-n">${esc(f.nota)}</p>` : c.id === 'N1140083' ? '<p class="car-n">El aviso indica: vendo o permuto.</p>' : '';
  const pr = p ? `<p class="car-p"><b>${p}</b>${ant ? ` <s>${ant}</s>` : ''}</p>` : '<p class="car-p"><b>Consultar precio</b></p>';
  return `<li class="car${c.vend ? ' vend' : ''}" data-m="${esc(c.m)}" data-tr="${esc(c.tr)}" data-tp="${esc(c.tipo)}" data-y="${c.y ?? 0}" data-i="${c.i}" data-v="${c.vend ? 1 : 0}" data-q="${esc((c.t + ' ' + (c.y ?? '')).toLowerCase())}"><div class="car-art" aria-hidden="true"><span class="car-y">${c.y ?? '—'}</span><i class="car-tag">${esc(c.m)}</i></div><div class="car-b"><div class="bds">${badges}</div><h3>${esc(c.t)}</h3><p class="car-meta">${esc(meta)}</p>${pr}${nota}<a class="btn p sm" href="${c.url}" target="_blank" rel="noopener noreferrer" aria-label="Ver aviso de ${esc(c.t)}${c.y ? ' ' + c.y : ''} en Clasionce">Ver aviso ↗</a></div></li>`;
};
const tile = (c, lab) => `<li class="vt"><b class="vt-y">${c.y ?? '—'}</b><span class="vt-n">${esc(c.t)}</span><i class="vt-l">${lab}</i></li>`;

const ld = { '@context': 'https://schema.org', '@type': 'AutoDealer', name: N.nombre, description: 'Intermediación y reventa de vehículos.', telephone: N.telTel, address: { '@type': 'PostalAddress', addressLocality: 'Paraná', addressRegion: 'Entre Ríos', addressCountry: 'AR' }, openingHours: 'Mo-Sa 08:00-21:30', sameAs: [IG] };
const vendidos = cars.length - activos.length;

const css = fs.readFileSync(path.join(root, 'scripts', 'zabala.css'), 'utf8').trim();
const js = fs.readFileSync(path.join(root, 'scripts', 'zabala.js'), 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Zabala Automotores · Intermediación y reventa de vehículos en Paraná</title>
<meta name="description" content="Zabala Automotores en Paraná, Entre Ríos: intermediación y reventa de vehículos. Consultá por WhatsApp o mirá los autos publicados.">
<meta name="theme-color" content="#002060">
<link rel="manifest" href="site.webmanifest">
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
<nav aria-label="Principal"><a href="#autos">Autos</a><a href="#contacto">Horarios y contacto</a><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></nav>
<div class="hc"><a class="ic" href="${IG}" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Zabala Automotores"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg></a><a class="btn p cut" href="${WA}" target="_blank" rel="noopener noreferrer">Escribinos</a></div></div></header>
<main id="top">
<div class="hero"><div class="hx-copy">
<h1><span class="sr">Zabala Automotores: </span>Autos y utilitarios <em>en Paraná</em></h1>
<p class="lead">${N.desc} Mirá los vehículos publicados y consultanos por WhatsApp.</p>
<div class="row"><a class="btn p cut" href="#autos">Ver autos</a><a class="btn o" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
<a class="proof" href="#autos"><b>${activos.length}</b><span>vehículos publicados en Clasionce</span></a></div>
<div class="hx-side" aria-hidden="true"><ul class="vit">${activos.slice(0, 3).map((c) => tile(c, 'Publicado')).join('')}</ul>
<div class="big"><p class="big-t">Marcas en stock</p><ul>${topMarcas.map((m) => `<li><b>${esc(m)}</b><span>${conteo(m)}</span></li>`).join('')}</ul><i class="big-l">Autos publicados en Clasionce</i></div></div>
</div>

<section id="autos" aria-labelledby="autos-t"><div class="w">
<span class="ey">Autos</span><h2 id="autos-t">Nuestros <em>autos</em></h2>
<p class="sec-p">Vehículos publicados por Zabala Automotores en Clasionce (Elonce), según su tienda al 11/10/2026: ${nAutos} autos, camionetas y utilitarios${nMoto ? ', ' + nMoto + ' moto' : ''}${nEmb ? ' y ' + nEmb + ' embarcaciones' : ''}. Los precios son los que figuran en cada aviso a esa fecha y pueden haber cambiado: escribinos por el que te interese y te confirmamos disponibilidad, precio y detalles.</p>
<div class="flt" id="flt" hidden>
<label class="f-q"><span class="sr">Buscar por marca o modelo</span><input id="fq" type="search" placeholder="Buscar marca o modelo" autocomplete="off"></label>
<label class="f-s"><span class="sr">Marca</span><select id="fm"><option value="">Todas las marcas</option>${marcas.map((m) => `<option value="${esc(m)}">${esc(m)} (${conteo(m)})</option>`).join('')}</select></label>
<div class="f-c" role="group" aria-label="Transmisión"><button type="button" class="chip on" data-tr="" aria-pressed="true">Todos</button><button type="button" class="chip" data-tr="Automático" aria-pressed="false">Automático</button><button type="button" class="chip" data-tr="Manual" aria-pressed="false">Manual</button></div>
<label class="f-s"><span class="sr">Tipo</span><select id="ft"><option value="">Todos los tipos</option><option value="Auto o utilitario">Autos y utilitarios</option><option value="Moto">Motos</option><option value="Embarcación">Embarcaciones</option></select></label>
<label class="f-s"><span class="sr">Ordenar</span><select id="fo"><option value="i">Orden de publicación</option><option value="yd">Año: mayor a menor</option><option value="ya">Año: menor a mayor</option></select></label>
<p class="f-n" id="fn" role="status" aria-live="polite"></p></div>
<ul class="cars" id="cars">
${[...cars].sort((a, b) => a.vend - b.vend || a.i - b.i).map(card).join('\n')}
</ul>
<p class="fin">Los avisos marcados como «Vendido» siguen visibles en Clasionce (${vendidos} al 11/10/2026) y se muestran al final de la lista.</p>
<p class="vacio" id="vac" hidden>No hay autos con ese filtro. Probá con otra marca o escribinos por WhatsApp.</p>
<div class="row mt"><a class="btn p cut" href="${N.tienda}" target="_blank" rel="noopener noreferrer">Ver la tienda en Clasionce</a><a class="btn o d" href="${IG}" target="_blank" rel="noopener noreferrer">Ver más en Instagram</a></div>
</div></section>

<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<span class="ey">Contacto</span><h2 id="contacto-t">Horarios y <em>contacto</em></h2>
<div class="ct-g"><dl><dt>Ubicación</dt><dd>${N.ciudad}. La dirección exacta la coordinamos por WhatsApp.</dd>
<dt>Horario</dt><dd>${N.horarios}</dd>
<dt>Quiénes somos</dt><dd>${N.desc} <small class="src">(descripción de nuestra tienda en Clasionce, donde figuramos como concesionaria con identidad verificada)</small></dd>
<dt>Teléfono y WhatsApp</dt><dd><a href="tel:${N.telTel}">${N.tel}</a></dd></dl>
<div class="ct-c"><p class="ct-t">¿Te gustó alguno?</p><p>Escribinos y te contamos disponibilidad, precio y detalles del auto que te interese.</p><div class="row"><a class="btn p cut" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a><a class="btn o" href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></div></div></div>
</div></section>
</main>
<footer><div class="w"><p>© 2026 Zabala Automotores</p><p class="demo-note" data-demo-note>Versión de demostración · No es el sitio oficial · Datos pendientes de confirmación</p><p><a href="privacidad.html">Privacidad y avisos</a></p></div></footer>
<script>
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`index.html: ${cars.length} autos, ${marcas.length} marcas, ${(html.length / 1024).toFixed(1)} KB`);
