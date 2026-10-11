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
    for (const m of h.matchAll(/(?:src|href)="((?:images|assets|video|css|js)\/[^"?#]+)"/g)) if (!fs.existsSync(path.join(root, m[1]))) errors.push(`${p}: referencia a archivo inexistente ${m[1]}`);
    if (!PROD && !/data-demo-note/.test(h)) errors.push(`${p}: falta el aviso de demo`);
  }
  const idx = rd('index.html');
  if (!idx.includes(`instagram.com/${d.contact.instagram}/`)) errors.push('index.html: Instagram no coincide');
  if (!idx.includes('<title>Zabala Automotores')) errors.push('index.html: title');
  // Datos sin fuente: no pueden aparecer en el sitio
  const visible = pages.map(rd).join('\n').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  for (const [re, why] of [[/\b(financiaci[oó]n|cuotas|tasa|garant[ií]a|permut|consignaci[oó]n|gestor[ií]a|0 ?km|taller)/i, 'servicio sin fuente'], [/\b\d{1,3}(\.\d{3})+ ?km\b/i, 'kilometraje'], [/\$\s?\d/, 'precio'], [/\b(19|20)\d{2}\b(?!.*©)/, null], [/rese[ñn]as?|calificaci[oó]n|★/i, 'reseñas'], [/desde \d{4}|\d+ años/i, 'antigüedad'], [/oficial(?! ·)/i, null]]) {
    if (!why) continue;
    if (re.test(visible.replace(/©\s*2026/g, ''))) errors.push(`Texto no permitido en el sitio (${why}): ${re}`);
  }
  if (/Verificado|Confirmado/.test(visible)) errors.push('Texto "verificado/confirmado" no permitido');
  if (d.identity.cuit !== null) errors.push('CUIT debe ser null hasta confirmación');
  // Restos del proyecto anterior en todo lo que se entrega
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.name === 'node_modules' || e.name === '.git' || e.name === 'fonts') ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const legacy = /chita|galarza|44-?2782|442782|647442|547671|concepci[oó]n del uruguay|orcellet|elvio/i;
  for (const f of walk(root)) {
    const rel = path.relative(root, f).split(path.sep).join('/');
    if (rel === 'scripts/validate-dealership.mjs' || /\.(webp|png|jpe?g|mp4|woff2)$/.test(rel)) continue;
    if (legacy.test(rel) || legacy.test(fs.readFileSync(f, 'utf8'))) errors.push(`Resto del proyecto anterior en ${rel}`);
  }
  if (PROD) {
    if (d.publicacion.publicIndexing !== true) errors.push('PROD: publicIndexing sigue en false');
    if (!d.location.address) errors.push('PROD: falta dirección');
    if (!d.hours.display) errors.push('PROD: faltan horarios');
    if (!(d.photos && d.photos.authorized === true)) errors.push('PROD: falta photos.authorized = true');
    if (/data-demo-note/.test(rd('index.html'))) errors.push('PROD: quitar el aviso de demo');
  }
}
if (errors.length) { console.error(errors.map((e) => 'ERROR: ' + e).join('\n')); process.exit(1); }
console.log('Datos de Zabala válidos y consistentes con las páginas.');
