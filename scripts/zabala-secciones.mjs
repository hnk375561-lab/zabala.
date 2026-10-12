// Secciones de Zabala Automotores equivalentes a todas las de la plantilla Chita.
// Regla del repo (CLAUDE.md #1): cero datos inventados. Lo que tiene fuente (horario, teléfono, ciudad, avisos de Clasionce)
// se publica; lo que no la tiene queda como «A CONFIRMAR» / «FOTO A CARGAR» dentro de <section class="… pending">,
// que es la marca que el validador acepta para formularios y avisos de consulta (no son afirmaciones de servicios).
// Uso: lo importa scripts/build-index.mjs.

const DIAS = [['lun', 'Lunes'], ['mar', 'Martes'], ['mie', 'Miércoles'], ['jue', 'Jueves'], ['vie', 'Viernes'], ['sab', 'Sábado'], ['dom', 'Domingo']];
const fmtH = (r) => r.split('-').map((t) => t.replace(/^0/, '')).join(' a ');

export function secciones({ N, D, WA, IG, wa, esc, activos, vendidosL, cars }) {
  const sched = D.hours.schedule;
  const diasAbiertos = DIAS.filter(([k]) => sched[k]);
  const btnWA = (txt, cls = 'btn p cut') => `<a class="${cls}" href="${WA}" target="_blank" rel="noopener noreferrer">${txt}</a>`;
  const pend = (t = 'A confirmar') => `<i class="pend">${t}</i>`;
  const ph = (t) => `<div class="ph" role="img" aria-label="${esc(t)}"><span>FOTO A CARGAR</span><small>${esc(t)}</small></div>`;

  /* ── Entregas ───────────────────────────────────────────── */
  const entregas = `<section id="entregas" class="sx a ent pending" aria-labelledby="ent-t"><div class="w">
<span class="ey">Entregas</span><h2 id="ent-t">Autos que ya <em>encontraron dueño</em></h2>
<p class="sec-p">Todavía no hay fotos de entregas con permiso de los clientes, así que no las mostramos. Mientras tanto, estos son los avisos que nuestra tienda marcó como vendidos en Clasionce.</p>
<ul class="ent-g">
${vendidosL.map((c) => `<li class="ent-i"><div class="ent-f">${c.fotos?.[0] ? `<img src="${esc(c.fotos[0])}" width="800" height="600" loading="lazy" decoding="async" alt="Foto del aviso de ${esc(c.t)}${c.y ? ' ' + c.y : ''}, marcado como vendido en Clasionce">` : ''}<i class="bd v">Vendido</i></div><h3>${esc(c.t)}</h3><p>${[c.y, c.tr].filter(Boolean).join(' · ')}</p></li>`).join('\n')}
<li class="ent-i ent-x">${ph('Tu entrega, con autorización')}<p>Cuando Zabala aporte fotos de entregas con permiso de los clientes, se publican acá.</p></li>
</ul>
<div class="row mt"><a class="btn p cut" href="${IG}" target="_blank" rel="noopener noreferrer">Ver más en Instagram</a><a class="btn o" href="#historial">Ver historial de avisos</a></div>
</div></section>`;

  /* ── Horarios ───────────────────────────────────────────── */
  const horarios = `<section id="horarios" class="sx b hor" aria-labelledby="hor-t"><div class="w">
<span class="ey">Horarios</span><h2 id="hor-t">Horarios <em>de atención</em></h2>
<p class="sec-p">${esc(N.ciudad)}. Horario tomado del perfil de nuestra tienda en Clasionce.</p>
<ul class="hor-l" id="hor-l">
${DIAS.map(([k, n], i) => `<li data-d="${(i + 1) % 7}"><b>${n}</b><span>${sched[k] ? fmtH(sched[k]) : 'No figura en nuestro perfil: consultanos por WhatsApp'}</span></li>`).join('\n')}
</ul>
<p class="hor-n">Es la única fuente que tenemos: domingos y feriados no figuran. Escribinos o llamanos antes de venir y te confirmamos que el auto siga disponible.</p>
<div class="row mt">${btnWA('Escribinos por WhatsApp')}<a class="btn o" href="tel:${N.telTel}">Llamar al ${N.tel}</a></div>
</div></section>`;

  /* ── El lugar (placeholders) ────────────────────────────── */
  const local = `<section id="local" class="sx b loc pending" aria-labelledby="loc-t"><div class="w">
<span class="ey">El lugar</span><h2 id="loc-t">Mirá <em>dónde te atendemos</em></h2>
<p class="sec-p">Todavía no hay fotos ni video del lugar de atención con autorización. Cuando Zabala los aporte, van acá. Mientras tanto, escribinos y te contamos cómo llegar.</p>
<div class="loc-g">${ph('Frente del lugar de atención')}${ph('Autos a la vista')}</div>
<div class="row mt">${btnWA('Escribinos por WhatsApp')}</div>
</div></section>`;

  /* ── Dónde estamos (contacto) ───────────────────────────── */
  const otras = [...new Set(cars.map((c) => c.localidad))].filter((l) => l !== 'Paraná');
  const contacto = `<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<span class="ey">Contacto</span><h2 id="contacto-t">Dónde estamos y <em>contacto</em></h2>
<div class="ct-g"><dl><dt>Ubicación</dt><dd>${esc(N.ciudad)}. La dirección exacta todavía no está confirmada: te la pasamos por WhatsApp.${otras.length ? ` Algunos avisos están en ${otras.map(esc).join(' y ')}.` : ''}</dd>
<dt>Cobertura</dt><dd>${N.cobertura} <small class="src">(según el perfil de nuestra tienda en Clasionce)</small></dd>
<dt>Horario</dt><dd>${N.horarios} <a href="#horarios">Ver por día</a></dd>
<dt>Quiénes somos</dt><dd>${N.desc} <small class="src">(descripción de nuestra tienda en Clasionce)</small></dd>
<dt>Teléfono y WhatsApp</dt><dd><a href="tel:${N.telTel}">${N.tel}</a> <button type="button" class="chip cp" id="cp-tel" data-v="${N.tel}" hidden>Copiar número</button></dd>
<dt>Dónde publicamos</dt><dd><a href="${N.tienda}" target="_blank" rel="noopener noreferrer">Tienda en Clasionce (Elonce)</a> · <a href="${IG}" target="_blank" rel="noopener noreferrer">@${N.ig}</a><br><span class="ok">Concesionaria con identidad verificada en Clasionce</span></dd></dl>
<div class="ct-c"><p class="ct-t">¿Te gustó alguno?</p><p>Escribinos y te contamos disponibilidad, precio y detalles del auto que te interese.</p><div class="row">${btnWA('Escribir por WhatsApp')}<a class="btn o" href="tel:${N.telTel}">Llamar</a><a class="btn o" href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></div></div></div>
<div class="map-ph"><div class="ph" role="img" aria-label="Mapa pendiente: falta confirmar la dirección"><span>MAPA A CARGAR</span><small>Se publica cuando Zabala confirme la dirección exacta</small></div><p>Para ubicarte mientras tanto: <a href="${D.location.mapsSearchUrl}" target="_blank" rel="noopener noreferrer">buscar Paraná en Google Maps ↗</a>. Es una búsqueda de la ciudad, no la ubicación del local.</p></div>
</div></section>`;

  /* ── Reseñas ────────────────────────────────────────────── */
  const opiniones = `<section id="opiniones" class="sx a rv pending" aria-labelledby="op-t"><div class="w">
<span class="ey">Reseñas</span><h2 id="op-t">Lo que dice <em>la gente</em></h2>
<p class="sec-p">No publicamos puntajes que no podamos respaldar. Hoy no hay reseñas de Zabala para mostrar.</p>
<div class="rv-g"><div class="rv-c"><b>Sin valoraciones</b><p>La ficha de nuestra tienda en Clasionce figura «Aún sin valoraciones». Eso describe solo esa ficha: no prueba que no existan opiniones en otros sitios.</p><a class="btn o sm" href="${N.tienda}" target="_blank" rel="noopener noreferrer">Ver la tienda en Clasionce</a></div>
<div class="rv-c">${ph('Espacio para reseñas')}<p>No encontramos una ficha de Google verificable. Si Zabala la tiene, las reseñas se muestran acá tal como las escribió cada persona.</p></div></div>
</div></section>`;

  /* ── Cómo comprar ───────────────────────────────────────── */
  const pasos = [
    ['Mirá los autos', 'Cada auto tiene fotos y los datos de su aviso. Usá los filtros para encontrar el que buscás.', '#autos', 'Ver autos'],
    ['Consultanos', 'Cada auto tiene un botón para consultar por WhatsApp, y también podés llamar al ' + N.tel + '.', '#contacto', 'Ver contacto'],
    ['Coordiná la visita', 'Avisanos qué querés ver y cuándo pasás. La visita queda confirmada cuando Zabala te responde.', '#visita', 'Coordinar visita'],
    ['Precio y forma de pago', 'El precio es el del aviso y puede haber cambiado. Las condiciones de pago se acuerdan con Zabala.', '#financiacion', 'Ver precio y pago'],
  ];
  const comprar = `<section id="como-comprar" class="sx b cc pending" aria-labelledby="cc-t"><div class="w">
<span class="ey">Comprar un usado</span><h2 id="cc-t">Cómo comprar <em>un auto en Zabala</em></h2>
<p class="sec-p">De la consulta a la visita, paso a paso. Es una orientación general: los detalles de cada operación los confirma Zabala.</p>
<ol class="cc-g">
${pasos.map(([t, p, h, b], i) => `<li><span class="n">${i + 1}</span><h3>${t}</h3><p>${p}</p><a href="${h}">${b} →</a></li>`).join('\n')}
</ol>
</div></section>`;

  /* ── Financiación ───────────────────────────────────────── */
  const waFin = wa('Hola! Quiero consultar si tienen financiación y si reciben mi usado como parte de pago.');
  const financiacion = `<section id="financiacion" class="sx a fn pending" aria-labelledby="fin-t"><div class="w">
<span class="ey">Precio y pago</span><h2 id="fin-t">Financiación y <em>tu usado</em></h2>
<p class="sec-p">Zabala todavía no confirmó planes de financiación, cuotas ni condiciones para recibir usados, así que no los publicamos. Podés consultarlos por el auto que te interese.</p>
<div class="fn-g">
<div class="fn-c"><p class="fn-t">Financiación ${pend()}</p><p>Sin planes, cuotas ni tasas publicadas. Preguntá por el auto puntual: algunos avisos aclaran cómo se paga en su propio texto.</p></div>
<div class="fn-c"><p class="fn-t">Tu usado ${pend()}</p><p>No está confirmado que Zabala reciba usados como parte de pago. Algunos avisos indican si aceptan o no permuta; consultá por el que te interese.</p></div>
<div class="fn-c"><p class="fn-t">Precios y monedas</p><p>Cada aviso publica su precio en pesos o en dólares. No los convertimos ni los comparamos entre sí, y pueden haber cambiado desde la fecha indicada en cada tarjeta.</p></div>
</div>
<div class="row mt"><a class="btn p cut" href="${waFin}" target="_blank" rel="noopener noreferrer">Consultar financiación y mi usado</a></div>
</div></section>`;

  /* ── Comprá, vendé o permutá ────────────────────────────── */
  const opCards = [
    ['Comprar', 'Consultanos por cualquiera de los autos publicados.', 'Quiero comprar', wa('Hola! Quiero comprar un auto. ¿Me cuentan qué tienen disponible?'), true],
    ['Vender', 'Contanos qué auto tenés y consultá cómo venderlo.', 'Quiero vender', '#op-form', false, 'vender'],
    ['Permutar', 'Contanos cuál es tu usado y consultá si lo reciben.', 'Quiero permutar', '#op-form', false, 'permutar'],
    ['Consignar', 'Consultá si podés dejar tu auto en consignación.', 'Quiero consignar', '#op-form', false, 'consignar'],
  ];
  const operaciones = `<section id="operaciones" class="sx b ops pending" aria-labelledby="ops-t"><div class="w">
<span class="ey">Comprá, vendé o permutá</span><h2 id="ops-t">Elegí qué querés <em>hacer</em></h2>
<p class="sec-p">Zabala se dedica a la intermediación y reventa de vehículos (según su perfil en Clasionce). Las condiciones de cada operación, incluidas la recepción de usados y la consignación, están ${pend()}: esta sección solo arma tu mensaje y lo enviás vos por WhatsApp.</p>
<ul class="ops-g">
${opCards.map(([t, p, b, h, ext, k]) => `<li><h3>${t}</h3><p>${p}</p><a class="btn o sm" href="${h}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ` data-op="${k}"`}>${b} →</a></li>`).join('\n')}
</ul>
<div class="fm" id="op-form"><h3>Contanos tu auto</h3><p class="fm-n">Completá los datos y se abre WhatsApp con el mensaje armado. Los kilómetros son opcionales.</p>
<div class="fm-g">
<label>Marca y modelo<input id="op-mm" type="text" autocomplete="off" placeholder="Ej.: marca, modelo y versión"></label>
<label>Año<input id="op-y" type="number" inputmode="numeric" min="1950" max="2027" placeholder="Año"></label>
<label>Kilómetros (opcional)<input id="op-km" type="text" inputmode="numeric" autocomplete="off" placeholder="Kilómetros"></label>
<label>¿Qué te interesa?<select id="op-q"><option value="vender">Vender mi auto</option><option value="permutar">Permutar por otro</option><option value="consignar">Dejarlo en consignación</option><option value="nose">Todavía no lo sé</option></select></label>
</div>
<p class="fm-m"><b>Tu consulta</b><span id="op-msg">Hola! Quiero vender mi auto: …</span></p>
<div class="row"><a class="btn p cut" id="op-go" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
<ul class="fm-t"><li><b>Después sumá fotos</b> Frente, laterales, interior y tablero con los kilómetros.</li><li><b>Si podés, tené a mano</b> La cédula del auto y el detalle de service o arreglos.</li><li><b>Sin tasación automática</b> Este sitio no calcula precios: la evaluación la hace Zabala.</li></ul>
<p class="fm-n">El sitio no guarda estos datos. <a href="privacidad.html">Privacidad</a>.</p></div>
</div></section>`;

  /* ── Coordiná tu visita ─────────────────────────────────── */
  const visita = `<section id="visita" class="sx a vi pending" aria-labelledby="vi-t"><div class="w">
<span class="ey">Visita</span><h2 id="vi-t">Coordiná <em>tu visita</em></h2>
<p class="sec-p">Un auto se elige mejor en persona: lo ves, lo revisás y preguntás lo que quieras. Se abre WhatsApp con el mensaje armado; la visita queda confirmada cuando Zabala te responde.</p>
<div class="vi-g"><div class="fm">
<h3><span class="n">1</span> Qué autos querés ver <small>Opcional, hasta 3</small></h3>
<label class="sr" for="vi-car">Sumar un auto a la visita</label>
<select id="vi-car"><option value="">Elegí un auto para sumar</option>${activos.map((c) => `<option value="${esc(c.t + (c.y ? ' ' + c.y : ''))}">${esc(c.t)}${c.y ? ' ' + c.y : ''}</option>`).join('')}</select>
<ul class="vi-sel" id="vi-sel" aria-live="polite"></ul>
<h3><span class="n">2</span> Cuándo venís <small>Opcional</small></h3>
<div class="fm-g"><label>¿Qué día te queda bien?<select id="vi-d"><option value="">Todavía no sé</option>${diasAbiertos.map(([, n]) => `<option>${n}</option>`).join('')}</select></label>
<label>Franja<select id="vi-f"><option value="">Indistinto</option><option>Mañana</option><option>Tarde</option><option>Noche</option></select></label></div>
<p class="fm-n">Los días son los del horario de nuestro perfil en Clasionce; domingos y feriados no figuran.</p></div>
<aside class="fm vi-sum" aria-labelledby="vi-h3"><h3 id="vi-h3"><span class="n">3</span> Tu visita</h3><p id="vi-msg">Todavía no elegiste nada. Podés enviar la consulta igual y la coordinamos por WhatsApp.</p>
<div class="row"><a class="btn p cut" id="vi-go" href="${WA}" target="_blank" rel="noopener noreferrer">Coordinar por WhatsApp</a></div>
<p class="fm-n">El mensaje también pide la dirección, que todavía no está publicada. El sitio no guarda estos datos.</p>
<a class="alt" href="reserva.html">Elegir el día en pantalla completa ↗</a></aside></div>
</div></section>`;

  /* ── Guía para comprar un usado ─────────────────────────── */
  const ck = (t) => `<li><label class="ck"><input type="checkbox"><span>${t}</span></label></li>`;
  const guia = `<section id="guia" class="sx b gp pending" aria-labelledby="gp-t"><div class="w">
<span class="ey">Guía</span><h2 id="gp-t">Guía para comprar <em>un usado</em></h2>
<p class="sec-p">Qué revisar en el auto, qué papeles pedir y cómo se hace la transferencia. Tildá lo que vas comprobando y llevá la planilla impresa a la visita.</p>
<div class="gp-g">
<div class="gp-c"><h3><span class="n">1</span> Mirar el auto <small>Qué revisar cuando lo ves en persona</small></h3><ul>
${[
  'Carrocería y pintura: diferencias de tono, golpes u óxido.', 'Neumáticos: desgaste parejo y dibujo suficiente.', 'Luces, espejos y vidrios en buen estado.',
  'Tablero sin luces de advertencia encendidas; aire, levantavidrios y cierre funcionando.', 'Motor: sin fugas de aceite o agua, y sin ruidos al arrancar en frío.',
  'Kilometraje coherente con el desgaste de pedales, volante y butacas.', 'Prueba de manejo: frenos, dirección, embrague y caja.', 'Comprobantes de service, si los hay.',
].map(ck).join('')}</ul></div>
<div class="gp-c"><h3><span class="n">2</span> Pedir los papeles <small>Documentación habitual para comprar</small></h3><ul>
${[
  'DNI vigente y constancia de CUIT o CUIL.', 'Título del automotor o constancia de asignación de título (CAT).', 'Cédula verde y, si las hay, cédulas azules.', 'Formulario 08, en papel o digital.',
  'Si el auto tiene prenda o leasing, la notificación al acreedor.', 'Un informe de dominio, para ver titularidad, prendas e inhibiciones.', 'Consultá en el Registro si corresponde presentar otros certificados, por ejemplo de deudas o infracciones.',
].map(ck).join('')}</ul></div>
<div class="gp-c"><h3><span class="n">3</span> Preparar tu usado <small>Solo si querés vender o permutar tu auto</small></h3><ul>
${[
  'Marca, modelo, versión y año.', 'Kilometraje real.', 'Cédula verde y título (o CAT).', 'Comprobantes de service o de arreglos importantes.', 'Si tiene GNC, prenda o algún faltante, contalo: ayuda a evaluarlo bien.', 'Fotos claras del exterior y del interior.',
].map(ck).join('')}</ul><p class="fm-n">Este sitio no calcula precios ni tasaciones.</p></div>
<div class="gp-c"><h3><span class="n">4</span> Confirmar la transferencia <small>Cómo se hace en el Registro</small></h3>
<p>Se hace en el Registro Seccional de la Propiedad del Automotor, con comprador y vendedor identificados. El arancel depende del valor del auto y de su origen: pedí siempre la información actualizada en el Registro o consultá los aranceles vigentes de la DNRPA.</p>
<p class="fm-n">Orientación general, no asesoramiento legal ni garantía de requisitos. Las normas y los costos del trámite cambian y los define el Registro Seccional.</p></div>
</div>
<div class="row mt"><button type="button" class="btn o" id="gp-print" hidden>Imprimir planilla</button>${btnWA('¿Dudas sobre un auto? Consultanos')}</div>
</div></section>`;

  /* ── Preguntas + buscador de pedido ─────────────────────── */
  const faq = [
    ['¿Tienen 0 km?', 'Los avisos publicados no indican 0 km. Si buscás uno, consultanos.'],
    ['¿Reciben mi usado?', 'No lo tenemos confirmado. Algunos avisos aclaran si aceptan permuta o no. Escribinos con marca, modelo, año y kilómetros y Zabala te responde.'],
    ['¿Tienen financiación?', 'Zabala todavía no confirmó planes de financiación. Consultá por el auto que te interesa.'],
    ['¿Toman autos en consignación?', 'Todavía no está confirmado. Zabala se dedica a la intermediación y reventa de vehículos: escribinos con los datos de tu auto y te cuentan.'],
    ['¿Cuánto cuesta cada auto?', 'Cada tarjeta muestra el precio del aviso en Clasionce, en su moneda y con la fecha de consulta; puede haber cambiado. Algunos avisos no publican precio: consultá.'],
    ['¿Dónde están y cuándo puedo ir a ver un auto?', `En ${N.ciudad}. La dirección exacta todavía no está publicada: te la pasan por WhatsApp. El horario del perfil es ${N.horarios.replace(/ \(.*\)\.?$/, '').toLowerCase()}. Escribinos antes de venir para confirmar que el auto siga disponible.`],
  ];
  const preguntas = `<section id="preguntas" class="sx a faq pending" aria-labelledby="faq-t"><div class="w">
<span class="ey">Preguntas</span><h2 id="faq-t">Preguntas <em>frecuentes</em></h2>
<p class="sec-p">Respuestas cortas sobre autos, financiación, tu usado, consignación y visitas. Lo que no está confirmado lo decimos.</p>
<div class="faq-l">
${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
</div>
<div class="fm" id="bq"><p class="fm-k">¿No encontraste lo que buscabas?</p><h3>Contanos qué auto buscás</h3><p class="fm-n">Dejanos marca, modelo y lo que te importa. Se abre WhatsApp con tu consulta lista para enviar.</p>
<div class="fm-g">
<label>Marca o modelo<input id="bq-m" type="text" autocomplete="off" placeholder="Qué buscás"></label>
<label>Año desde (opcional)<input id="bq-y" type="number" inputmode="numeric" min="1950" max="2027" placeholder="Año"></label>
<label>Combustible (opcional)<select id="bq-c"><option value="">Indistinto</option><option>Nafta</option><option>Nafta / GNC</option><option>Diésel</option></select></label>
<label>Presupuesto aproximado (opcional)<input id="bq-p" type="text" autocomplete="off" placeholder="Presupuesto"></label>
</div>
<div class="row"><a class="btn p cut" id="bq-go" href="${WA}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
<p class="fm-n">Te responden por WhatsApp. El sitio no guarda estos datos.</p></div>
<nav class="qk mega" aria-label="Más formas de encontrarnos"><p class="qk-t">Más formas de encontrarnos</p><ul>
<li><a href="tel:${N.telTel}">Llamanos · ${N.tel}</a></li><li><a href="${WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a href="${N.tienda}" target="_blank" rel="noopener noreferrer">Tienda en Clasionce</a></li><li><a href="#contacto">Dónde estamos</a></li><li><a href="#visita">Coordiná tu visita</a></li><li><a href="#opiniones">Opiniones</a></li><li><a href="#autos">Volver a los autos</a></li></ul></nav>
</div></section>`;

  /* ── Ficha del auto (diálogo) ───────────────────────────── */
  const ficha = `<dialog id="dlg" class="dlg" aria-labelledby="dlg-t"><div class="dlg-in"><button type="button" class="lb-b lb-x" id="dlg-x" aria-label="Cerrar">✕</button>
<div class="dlg-ph"><img id="dlg-img" alt="" width="800" height="600"><ul id="dlg-th" class="dlg-th"></ul></div>
<div class="dlg-tx"><h2 id="dlg-t"></h2><p class="car-meta" id="dlg-m"></p><p class="car-p" id="dlg-p"></p><div id="dlg-n"></div><div class="row" id="dlg-a"></div><p class="car-s" id="dlg-s"></p></div></div></dialog>`;

  return { entregas, horarios, local, contacto, opiniones, comprar, financiacion, operaciones, visita, guia, preguntas, ficha };
}
