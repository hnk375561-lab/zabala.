// Valida que data/dealership.json y las páginas no se contradigan, que no se publiquen datos sin fuente
// y que no queden restos del proyecto anterior. Uso: node scripts/validate-dealership.mjs [--prod]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROD = process.argv.includes('--prod');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const errors = [];
const json = (f) => { try { return JSON.parse(rd(f)); } catch { errors.push(`${f} no es JSON válido`); return null; } };
const d = json('data/dealership.json');
for (const f of ['data/sources.json', 'data/vehicles.json', 'data/pendientes.json']) json(f);
if (d) {
  const pages = ['index.html', 'privacidad.html', 'reserva.html', '404.html'];
  const robots = rd('robots.txt');
  const blocks = /Disallow:\s*\/\s*$/m.test(robots);
  if (d.publicacion.publicIndexing === false ? !blocks : blocks) errors.push('robots.txt no coincide con publicacion.publicIndexing');
  for (const p of pages) {
    const h = rd(p);
    if (d.publicacion.publicIndexing === false ? !/noindex/.test(h) : /noindex/.test(h)) errors.push(`${p}: noindex no coincide con publicacion.publicIndexing`);
    if (d.contact.whatsApp && !h.includes(`wa.me/${d.contact.whatsApp}`)) errors.push(`${p}: WhatsApp no coincide con dealership.json`);
    if (/href="#"/.test(h)) errors.push(`${p}: href="#"`);
    if (/href="http:\/\//.test(h)) errors.push(`${p}: enlace http:// sin cifrar`);
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${p}: debe tener un único h1`);
    for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) errors.push(`${p}: img sin alt`);
    for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])) errors.push(`${p}: img sin width/height`);
    for (const m of h.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/noopener/.test(m[0])) errors.push(`${p}: enlace externo sin noopener`);
    for (const m of h.matchAll(/(?:src|href)="((?:images|assets|video|css|js)\/[^"?#]+)"/g)) if (!fs.existsSync(path.join(root, m[1]))) errors.push(`${p}: referencia a archivo inexistente ${m[1]}`);
    if (!PROD && !/data-demo-note/.test(h)) errors.push(`${p}: falta el aviso de demo`);
  }
  const idx = rd('index.html');
  if (!idx.includes(`instagram.com/${d.contact.instagram}/`)) errors.push('index.html: Instagram no coincide');
  if (!idx.includes('<title>Zabala Automotores')) errors.push('index.html: title');
  // Datos sin fuente: no pueden aparecer en el sitio
  const visible = pages.map(rd).join('\n').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  // Las tarjetas de avisos y del historial llevan precios y kilometraje tomados de cada aviso de Clasionce (fuente y fecha en la página); el resto del sitio no puede tenerlos.
  // Las secciones marcadas como pending son formularios/avisos de consulta, no afirmaciones de servicios publicados.
  const visNoCars = visible.replace(/<li class="(?:car|hr)\b[^\"]*"[\s\S]*?<\/li>/g, '').replace(/<section[^>]*class="[^"]*\bpending\b[^"]*"[\s\S]*?<\/section>/gi, '').replace(/<nav[^>]*class="[^"]*\bmega\b[^"]*"[\s\S]*?<\/nav>/gi, '');
  for (const [re, why] of [[/\b(financiaci[oó]n|cuotas|tasa fija|garant[ií]a|permut|consignaci[oó]n|gestor[ií]a|taller)/i, 'servicio sin fuente'], [/\b\d{1,3}(\.\d{3})+ ?km\b/i, 'kilometraje'], [/\$\s?\d|US\$/, 'precio'], [/rese[ñn]as?|calificaci[oó]n|★/i, 'reseñas'], [/desde \d{4}|\d+ años/i, 'antigüedad']]) {
    if (re.test(visNoCars.replace(/©\s*2026/g, ''))) errors.push(`Texto no permitido en el sitio (${why}): ${re}`);
  }
  if (/Verificado|Confirmado/.test(visible)) errors.push('Texto "verificado/confirmado" no permitido');
  const aj = JSON.parse(rd('data/autos.json')).autos;
  const nCards = (idx.match(/<li class="car\b/g) || []).length;
  if (nCards !== aj.length) errors.push(`index.html tiene ${nCards} tarjetas y data/autos.json tiene ${aj.length} avisos`);
  for (const v of aj) if (!idx.includes(v.url)) errors.push(`index.html: falta el aviso ${v.id}`);
  const vids = new Set(JSON.parse(rd('data/vehicles.json')).vehicles.map((v) => v.id));
  if (vids.size !== aj.length || aj.some((v) => !vids.has(v.id))) errors.push('data/vehicles.json no tiene los mismos avisos que data/autos.json');
  if (!idx.includes('Paraná, Entre Ríos')) errors.push('index.html: falta la ciudad');
  if (d.contact.phoneTel && !idx.includes(`tel:${d.contact.phoneTel}`)) errors.push('index.html: teléfono no coincide con dealership.json');
  if (d.hours.display && !idx.includes('Lunes a sábados de 8:00 a 21:30')) errors.push('index.html: horario no coincide con dealership.json');
  if (d.identity.cuit !== null) errors.push('CUIT debe ser null hasta confirmación');
  // Restos del proyecto anterior: error solo en lo que el sitio realmente sirve (páginas, metadatos, datos y los css/js que esas páginas enlazan).
  // Los archivos heredados que ninguna página enlaza se informan como aviso para limpiarlos, sin frenar la validación.
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.name === 'node_modules' || e.name === '.git' || e.name === 'fonts') ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const legacy = /chita|galarza|44-?2782|442782|647442|547671|concepci[oó]n del uruguay|orcellet|elvio/i;
  const served = new Set(['robots.txt', 'sitemap.xml', 'site.webmanifest', ...pages]);
  for (const p of pages) for (const m of rd(p).matchAll(/(?:src|href)="((?:css|js|data)\/[^"?#]+)"/g)) served.add(m[1]);
  for (const f of fs.readdirSync(path.join(root, 'data'))) if (f.endsWith('.json')) served.add('data/' + f);
  const sueltos = [];
  for (const f of walk(root)) {
    const rel = path.relative(root, f).split(path.sep).join('/');
    if (rel === 'scripts/validate-dealership.mjs' || /\.(webp|png|jpe?g|mp4|woff2)$/.test(rel)) continue;
    if (!(legacy.test(rel) || legacy.test(fs.readFileSync(f, 'utf8')))) continue;
    if (served.has(rel)) errors.push(`Resto del proyecto anterior en ${rel}`); else sueltos.push(rel);
  }
  if (sueltos.length) console.warn(`AVISO: ${sueltos.length} archivos heredados del proyecto anterior que ninguna página enlaza (conviene borrarlos antes de publicar): ${sueltos.slice(0, 5).join(', ')}${sueltos.length > 5 ? ', …' : ''}`);
  if (PROD) {
    if (d.publicacion.publicIndexing !== true) errors.push('PROD: publicIndexing sigue en false');
    if (!d.location.address) errors.push('PROD: falta dirección exacta');
    if (!d.hours.display) errors.push('PROD: faltan horarios');
    if (!(d.photos && d.photos.authorized === true)) errors.push('PROD: falta photos.authorized = true');
    if (/data-demo-note/.test(rd('index.html'))) errors.push('PROD: quitar el aviso de demo');
  }
}
if (errors.length) { console.error(errors.map((e) => 'ERROR: ' + e).join('\n')); process.exit(1); }
console.log('Datos de Zabala válidos y consistentes con las páginas.');
