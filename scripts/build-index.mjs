// Genera index.html de Zabala Automotores con el diseño de Chita (azul/rojo, cortes diagonales).
// Uso: node scripts/build-index.mjs   → escribe ../index.html
// Para sumar/quitar autos: editar AUTOS y volver a correrlo. Sin fotos ni precios: no hay fuente.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const N = {
  nombre: 'Zabala Automotores', ciudad: 'Paraná, Entre Ríos',
  tel: '343 473-2110', telTel: '+543434732110', wa: '5493434732110',
  ig: 'zabala_automotores', tienda: 'https://clasificados.elonce.com/concesionarias/zabala-automotores',
  horarios: 'Lunes a sábados de 8:00 a 21:30 (según nuestro perfil en Clasionce).',
};
const WA = `https://wa.me/${N.wa}?text=${encodeURIComponent('Hola! Quiero consultar por los autos disponibles.')}`;
const IG = `https://www.instagram.com/${N.ig}/`;
const av = (id) => (id.startsWith('N') ? `https://clasificados.elonce.com/aviso/${id}` : `https://clasificados.elonce.com/aviso/${id}`);

// [titulo, año|null, transmisión, id de aviso]
const AUTOS = [
['Volkswagen Up! 1.0 MPI Move 3P',2017,'Manual','N1168048'],['Peugeot 308 1.6 Allure Nav',2017,'Manual','N1165274'],
['Fiat Toro 2.0 TDI Freedom 4x2',2017,'Manual','N1142198'],['Volkswagen Suran 1.6 MSI Highline',2019,'Manual','N1168498'],
['Toyota SW4 2.8 TDI SRX 4x4 AT 7AS',2021,'Automático','N1168476'],['Fiat Doblo 1.4 Active 16V Family 7AS',2014,'Manual','N1168363'],
['Volkswagen T-Cross 1.0 200TSI Highline AT L/24',2025,'Automático','N1168350'],['Toyota Yaris 1.5 XLS Pack CVT',2021,'Automático','N1168258'],
['Volkswagen Suran 1.6 Highline',2017,'Manual','N1167888'],['Nissan Frontier 2.3 S DC 4x4',2019,'Manual','N1167685'],
['Volkswagen Suran 1.6 Trendline L/15 Manual',2016,'Manual','N1167667'],['Toyota Etios 1.5 Platinum 4P 6MT',2015,'Manual','N1167171'],
['Audi A1 1.2 T FSI Attraction Manual',2012,'Manual','N1162959'],['Nissan X-Trail 1.5 e-Power Exclusive CVT 4x4',2026,'Automático','N1167106'],
['Volkswagen Amarok 2.0TD Confort 4x2 AT 180HP',2021,'Automático','N1164467'],['Volkswagen Taos 250 TSI Comfortline AT L/24',2025,'Automático','N1166714'],
['Chevrolet S10 2.8TD DC 4x2 DLX Electronic',2012,'Manual','N1166713'],['Toyota Etios Cross 1.5 M/T',2014,'Manual','N1166453'],
['Toyota Hilux L/12 3.0 DC 4x2 TDI SR M/T',2015,'Manual','N1166228'],['Toyota Corolla Cross 1.8 SEG HEV E-CVT',2022,'Automático','N1166080'],
['Toyota Hilux 2.8 TDI DC SRV Pack Cuero 4x2 M/T',2017,'Manual','N1166077'],['Toyota Hilux 2.8 TDI DC SRX 4x4 Aut',2017,'Automático','N1165540'],
['Honda HR-V 1.8 EXL CVT',2018,'Automático','N1165353'],['Volkswagen Golf 1.4 TSI Comfortline',2016,'Manual','N1164887'],
['Ford Focus 1.6 S L/14 5P',null,'Manual','N1164752'],['Volkswagen Tiguan Allspace 2.0 TSI Comfortline DSG',2018,'Automático','N1164715'],
['Nissan Versa 1.6 Advance Pure Drive F2 M/T',2018,'Manual','N1164426'],['Volkswagen Taos 1.4 TSI Comfortline Tip',2021,'Automático','N1163973'],
['Fiat Qubo Fiorino 1.4 Dynamic',2013,'Manual','N1163971'],['Peugeot 408 1.6 THP Allure Plus',2017,'Manual','N1162994'],
['Toyota SW4 2.8 TDI 4x4 SRX L/21 Manual 7AS',2021,'Manual','N1162742'],['Volkswagen T-Cross 1.0 200TSI Highline AT L/24',2025,'Automático','N1158048'],
['Toyota Corolla Cross 1.8 XEI HEV E-CVT',2024,'Automático','N1157845'],['Honda Civic EXL 2.0 L/17',2017,'Automático','N1137128'],
['Hyundai i10 1.2 GLS Seguridad L/11',2013,'Manual','N1136911'],['Ford Focus 1.6 S L/16 4P',2018,'Manual','N1137119'],
['Volkswagen Amarok V6 3.0TD 4x4 DC AT 224HP Extreme',2021,'Automático','N1136912'],['Peugeot Partner Patagonica 1.6 16V',2015,'Manual','N1141275'],
['Toyota Yaris 1.5 XLS Pack CVT',2021,'Automático','N1137120'],['Honda HR-V 1.8 EX CVT',2016,'Automático','N1137121'],
['Honda HR-V 1.8 EXL CVT',2016,'Automático','N1162559'],['Volkswagen Amarok 2.0TD 4x4 DC Highline',2010,'Manual','N1162557'],
['VW Passat 2.0 FSI Exclusive Tip',2008,'Automático','N1140083'],['BMW X3 xDrive 3.0 35i Executive 306 cv AT',2012,'Automático','N1140481'],
['Mercedes-Benz C250 Coupe BlueEfficiency AT Sport',2014,'Automático','N1138064'],['Volkswagen Amarok 2.0TD 4x2 DC Highline 180HP',2013,'Manual','N1157909'],
['Honda HR-V 1.8 EXL CVT',2020,'Automático','2146368'],
];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const marca = (t) => { const w = t.split(' ')[0]; return w === 'VW' ? 'Volkswagen' : w; };
const cars = AUTOS.map(([t, y, tr, id], i) => ({ t, y, tr, id, i, m: marca(t) }));
const marcas = [...new Set(cars.map((c) => c.m))].sort((a, b) => a.localeCompare(b, 'es'));
const conteo = (m) => cars.filter((c) => c.m === m).length;
const topMarcas = [...marcas].sort((a, b) => conteo(b) - conteo(a) || a.localeCompare(b, 'es')).slice(0, 4);

const card = (c) => `<li class="car" data-m="${esc(c.m)}" data-tr="${esc(c.tr)}" data-y="${c.y ?? 0}" data-i="${c.i}" data-q="${esc((c.t + ' ' + (c.y ?? '')).toLowerCase())}"><div class="car-art" aria-hidden="true"><span class="car-y">${c.y ?? '—'}</span><i class="car-tag">${esc(c.m)}</i></div><div class="car-b"><h3>${esc(c.t)}</h3><p class="car-meta">${c.y ? c.y + ' · ' : ''}${esc(c.tr)}</p><a class="btn p sm" href="${av(c.id)}" target="_blank" rel="noopener noreferrer" aria-label="Ver aviso de ${esc(c.t)}${c.y ? ' ' + c.y : ''} en Clasionce">Ver aviso ↗</a></div></li>`;

const tile = (c, lab) => `<li class="vt"><b class="vt-y">${c.y ?? '—'}</b><span class="vt-n">${esc(c.t)}</span><i class="vt-l">${lab}</i></li>`;

const ld = { '@context': 'https://schema.org', '@type': 'AutoDealer', name: N.nombre, description: 'Intermediación y reventa de vehículos.', telephone: N.telTel, address: { '@type': 'PostalAddress', addressLocality: 'Paraná', addressRegion: 'Entre Ríos', addressCountry: 'AR' }, openingHours: 'Mo-Sa 08:00-21:30', sameAs: [IG] };

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
<p class="lead">Intermediación y reventa de vehículos en Paraná, Entre Ríos. Mirá los autos publicados y consultanos por WhatsApp.</p>
<div class="row"><a class="btn p cut" href="#autos">Ver autos</a><a class="btn o" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
<a class="proof" href="#autos"><b>${cars.length}</b><span>autos y utilitarios publicados</span></a></div>
<div class="hx-side" aria-hidden="true"><ul class="vit">${cars.slice(0, 3).map((c) => tile(c, 'Publicado')).join('')}</ul>
<div class="big"><p class="big-t">Marcas en stock</p><ul>${topMarcas.map((m) => `<li><b>${esc(m)}</b><span>${conteo(m)}</span></li>`).join('')}</ul><i class="big-l">Autos publicados en Clasionce</i></div></div>
</div>

<section id="autos" aria-labelledby="autos-t"><div class="w">
<span class="ey">Autos</span><h2 id="autos-t">Nuestros <em>autos</em></h2>
<p class="sec-p">Autos y utilitarios publicados por Zabala Automotores en Clasionce (Elonce), según su tienda al 11/10/2026. El stock cambia: escribinos por el que te interese y te confirmamos disponibilidad, precio y detalles.</p>
<div class="flt" id="flt" hidden>
<label class="f-q"><span class="sr">Buscar por marca o modelo</span><input id="fq" type="search" placeholder="Buscar marca o modelo" autocomplete="off"></label>
<label class="f-s"><span class="sr">Marca</span><select id="fm"><option value="">Todas las marcas</option>${marcas.map((m) => `<option value="${esc(m)}">${esc(m)} (${conteo(m)})</option>`).join('')}</select></label>
<div class="f-c" role="group" aria-label="Transmisión"><button type="button" class="chip on" data-tr="" aria-pressed="true">Todos</button><button type="button" class="chip" data-tr="Automático" aria-pressed="false">Automático</button><button type="button" class="chip" data-tr="Manual" aria-pressed="false">Manual</button></div>
<label class="f-s"><span class="sr">Ordenar</span><select id="fo"><option value="i">Orden de publicación</option><option value="yd">Año: mayor a menor</option><option value="ya">Año: menor a mayor</option></select></label>
<p class="f-n" id="fn" role="status" aria-live="polite"></p></div>
<ul class="cars" id="cars">
${cars.map(card).join('\n')}
</ul>
<p class="vacio" id="vac" hidden>No hay autos con ese filtro. Probá con otra marca o escribinos por WhatsApp.</p>
<div class="row mt"><a class="btn p cut" href="${N.tienda}" target="_blank" rel="noopener noreferrer">Ver la tienda en Clasionce</a><a class="btn o d" href="${IG}" target="_blank" rel="noopener noreferrer">Ver más en Instagram</a></div>
</div></section>

<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<span class="ey">Contacto</span><h2 id="contacto-t">Horarios y <em>contacto</em></h2>
<div class="ct-g"><dl><dt>Ubicación</dt><dd>${N.ciudad}. La dirección exacta la coordinamos por WhatsApp.</dd>
<dt>Horario</dt><dd>${N.horarios}</dd>
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
