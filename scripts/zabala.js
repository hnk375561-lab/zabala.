(function () {
  var list = document.getElementById('cars'), flt = document.getElementById('flt');
  if (!list || !flt) return;
  var $ = function (id) { return document.getElementById(id); };
  var items = [].slice.call(list.children), q = $('fq'), fm = $('fm'), ft = $('ft'), fy = $('fy'), fc = $('fc'), fp = $('fp'), fo = $('fo'),
    fn = $('fn'), vac = $('vac'), fof = $('fof'), fng = $('fng'), flm = $('flm'),
    chips = [].slice.call(flt.querySelectorAll('.chip[data-tr]')), tr = '';
  flt.hidden = false; /* sin JavaScript los filtros no se muestran y la lista queda completa */
  var RANGOS = {
    ARS: [['Hasta $ 15 M', 0, 15e6], ['$ 15 M a 25 M', 15e6, 25e6], ['$ 25 M a 40 M', 25e6, 40e6], ['Más de $ 40 M', 40e6, Infinity]],
    USD: [['Hasta US$ 12.000', 0, 12e3], ['US$ 12.000 a 20.000', 12e3, 20e3], ['US$ 20.000 a 30.000', 20e3, 30e3], ['Más de US$ 30.000', 30e3, Infinity]]
  };
  var ANIOS = { '2020+': [2020, 9999], '2015-2019': [2015, 2019], '2010-2014': [2010, 2014], '-2009': [1, 2009] };
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function toggle(btn) { var on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.classList.toggle('on', on); return on; }
  function llenarRangos() {
    var r = RANGOS[fc.value]; fp.innerHTML = '<option value="">Rango de precio</option>';
    if (r) r.forEach(function (x, i) { var o = document.createElement('option'); o.value = i; o.textContent = x[0]; fp.appendChild(o); });
    fp.disabled = !r;
  }
  function apply() {
    var t = norm(q.value.trim()), m = fm.value, tp = ft.value, o = fo.value, n = 0, mo = fc.value;
    var an = ANIOS[fy.value], rg = mo && fp.value !== '' ? RANGOS[mo][+fp.value] : null;
    var ofs = fof.getAttribute('aria-pressed') === 'true', ngs = fng.getAttribute('aria-pressed') === 'true';
    var precio = function (li) { return (li.dataset.mo === 'USD' ? 1e12 : 0) + (+li.dataset.pm || 9e11); }; /* sin precio al final; pesos antes que dólares */
    var sorted = items.slice().sort(function (a, b) {
      if (o === 'yd') return (b.dataset.y - a.dataset.y) || (a.dataset.i - b.dataset.i);
      if (o === 'ya') return ((a.dataset.y || 9999) - (b.dataset.y || 9999)) || (a.dataset.i - b.dataset.i);
      if (o === 'pa') return (precio(a) - precio(b)) || (a.dataset.i - b.dataset.i);
      if (o === 'pd') { var pa = a.dataset.pm > 0, pb = b.dataset.pm > 0; if (pa !== pb) return pa ? -1 : 1; if (a.dataset.mo !== b.dataset.mo) return a.dataset.mo === 'ARS' ? -1 : 1; return (b.dataset.pm - a.dataset.pm) || (a.dataset.i - b.dataset.i); }
      return a.dataset.i - b.dataset.i;
    });
    sorted.forEach(function (li) {
      var y = +li.dataset.y, p = +li.dataset.pm;
      var ok = (!m || li.dataset.m === m) && (!tp || li.dataset.tp === tp) && (!tr || li.dataset.tr === tr) && (!t || norm(li.dataset.q).indexOf(t) > -1) &&
        (!an || (y >= an[0] && y <= an[1])) && (!mo || li.dataset.mo === mo) && (!rg || (p >= rg[1] && p < rg[2])) &&
        (!ofs || li.dataset.of === '1') && (!ngs || li.dataset.ng === '1');
      li.hidden = !ok; if (ok) n++; list.appendChild(li);
    });
    fn.textContent = 'Mostrando ' + n + ' de ' + items.length + (o === 'pa' || o === 'pd' ? ' · el orden por precio se hace dentro de cada moneda (primero pesos, luego dólares)' : '');
    vac.hidden = n > 0;
  }
  function limpiar() {
    q.value = ''; fm.value = ''; ft.value = ''; fy.value = ''; fc.value = ''; fo.value = 'i'; llenarRangos(); tr = '';
    chips.forEach(function (x, i) { x.classList.toggle('on', i === 0); x.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); });
    [fof, fng].forEach(function (b) { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
    apply();
  }
  q.addEventListener('input', apply);
  [fm, ft, fy, fp, fo].forEach(function (s) { s.addEventListener('change', apply); });
  fc.addEventListener('change', function () { llenarRangos(); apply(); });
  fof.addEventListener('click', function () { toggle(fof); apply(); });
  fng.addEventListener('click', function () { toggle(fng); apply(); });
  flm.addEventListener('click', limpiar);
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      tr = c.dataset.tr;
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      apply();
    });
  });
  apply();
})();

/* galería: visor de fotos. Sin JavaScript (o sin <dialog>) cada miniatura es un enlace a la foto grande. */
(function () {
  var g = document.getElementById('gal'), lb = document.getElementById('lb');
  if (!g || !lb || typeof lb.showModal !== 'function') return;
  var links = [].slice.call(g.querySelectorAll('li:not(.gal-more) > a')), mas = g.querySelector('.gal-more > a'), img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cur = 0, opener = null;
  function show(i) {
    cur = (i + links.length) % links.length;
    var a = links[cur], t = a.querySelector('img');
    img.onerror = function () { cap.textContent = 'No se pudo cargar esta foto. Probá con la siguiente.'; };
    img.src = a.getAttribute('href'); img.alt = t.alt;
    cap.textContent = t.alt.replace('Foto del Instagram de Zabala: ', '') + ' · ' + (cur + 1) + ' de ' + links.length;
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); opener = a; show(i); lb.showModal(); });
  });
  var vis = g.querySelectorAll('li:not(.gal-more):not(.gx)').length;
  if (mas) mas.addEventListener('click', function (e) { e.preventDefault(); opener = mas; show(vis); lb.showModal(); });
  lb.querySelector('.lb-x').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-p').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-n').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1); });
  lb.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
})();

/* horarios: marca el día de hoy (sin afirmar si está abierto: la fuente es una sola) */
(function () {
  var l = document.getElementById('hor-l'); if (!l) return;
  var d = String(new Date().getDay()), li = l.querySelector('li[data-d="' + d + '"]');
  if (li) li.classList.add('hoy');
})();

/* copiar teléfono y imprimir planilla: solo se muestran si el navegador los soporta */
(function () {
  var cp = document.getElementById('cp-tel');
  if (cp && navigator.clipboard) {
    cp.hidden = false;
    cp.addEventListener('click', function () {
      navigator.clipboard.writeText(cp.dataset.v).then(function () { cp.textContent = 'Copiado'; setTimeout(function () { cp.textContent = 'Copiar número'; }, 2000); }, function () {});
    });
  }
  var pr = document.getElementById('gp-print');
  if (pr) { pr.hidden = false; pr.addEventListener('click', function () { window.print(); }); }
})();

/* formularios que arman un mensaje de WhatsApp (el sitio no guarda nada: el enlace se actualiza al escribir) */
(function () {
  var WA = 'https://wa.me/5493434732110?text=';
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || '').trim(); };
  function link(a, txt) { a.href = WA + encodeURIComponent(txt); }

  /* vender / permutar / consignar */
  var opq = $('op-q');
  if (opq) {
    var FRASE = { vender: 'quiero vender mi auto', permutar: 'quiero consultar si reciben mi auto como parte de pago', consignar: 'quiero consultar por dejar mi auto en consignación', nose: 'tengo un auto y quiero consultar qué opciones hay' };
    var upOp = function () {
      var datos = [v('op-mm'), $('op-y').value ? 'año ' + v('op-y') : '', v('op-km') ? v('op-km') + ' km' : ''].filter(Boolean).join(', ');
      var txt = 'Hola! ' + FRASE[opq.value].replace(/^./, function (c) { return c.toUpperCase(); }) + (datos ? ': ' + datos + '.' : ': …');
      $('op-msg').textContent = txt; link($('op-go'), datos ? txt + ' ¿Cómo sería?' : txt);
    };
    ['op-mm', 'op-y', 'op-km'].forEach(function (id) { $(id).addEventListener('input', upOp); });
    opq.addEventListener('change', upOp);
    [].forEach.call(document.querySelectorAll('[data-op]'), function (a) {
      a.addEventListener('click', function () { opq.value = a.dataset.op; upOp(); });
    });
    upOp();
  }

  /* coordinar visita */
  var car = $('vi-car');
  if (car) {
    var sel = [];
    var upVi = function () {
      var ul = $('vi-sel'); ul.innerHTML = '';
      sel.forEach(function (t, i) {
        var li = document.createElement('li'), b = document.createElement('button');
        li.appendChild(document.createTextNode(t));
        b.type = 'button'; b.textContent = '✕'; b.setAttribute('aria-label', 'Quitar ' + t);
        b.addEventListener('click', function () { sel.splice(i, 1); upVi(); });
        li.appendChild(b); ul.appendChild(li);
      });
      var partes = [];
      if (sel.length) partes.push('Autos: ' + sel.join(', '));
      if (v('vi-d')) partes.push('Día: ' + v('vi-d').toLowerCase());
      if (v('vi-f')) partes.push('Franja: ' + v('vi-f').toLowerCase());
      var resumen = partes.length ? partes.join(' · ') : '';
      $('vi-msg').textContent = resumen || 'Todavía no elegiste nada. Podés enviar la consulta igual y la coordinamos por WhatsApp.';
      link($('vi-go'), 'Hola! Quiero coordinar una visita.' + (resumen ? ' ' + resumen + '.' : '') + ' ¿Me confirman disponibilidad y la dirección?');
    };
    car.addEventListener('change', function () {
      if (car.value && sel.length < 3 && sel.indexOf(car.value) < 0) sel.push(car.value);
      car.value = ''; upVi();
    });
    $('vi-d').addEventListener('change', upVi); $('vi-f').addEventListener('change', upVi);
    upVi();
  }

  /* contanos qué auto buscás */
  var bq = $('bq-go');
  if (bq) {
    var upBq = function () {
      var t = 'Hola! Estoy buscando ' + (v('bq-m') || 'un auto') + '.';
      if ($('bq-y').value) t += ' Año desde: ' + v('bq-y') + '.';
      if (v('bq-c')) t += ' Combustible: ' + v('bq-c') + '.';
      if (v('bq-p')) t += ' Presupuesto aproximado: ' + v('bq-p') + '.';
      link(bq, t + ' ¿Tienen algo así?');
    };
    ['bq-m', 'bq-y', 'bq-p'].forEach(function (id) { $(id).addEventListener('input', upBq); });
    $('bq-c').addEventListener('change', upBq);
    upBq();
  }
})();

/* ficha del auto: «Ver detalles» abre un visor con las fotos del aviso y sus datos */
(function () {
  var dlg = document.getElementById('dlg'), src = document.getElementById('fichas');
  if (!dlg || !src || typeof dlg.showModal !== 'function') return;
  var F; try { F = JSON.parse(src.textContent); } catch (e) { return; }
  var $ = function (id) { return document.getElementById(id); };
  var img = $('dlg-img'), th = $('dlg-th'), opener = null;
  function foto(f, i, t) { img.src = f[i]; img.alt = 'Foto ' + (i + 1) + ' de ' + f.length + ': ' + t; [].forEach.call(th.querySelectorAll('button'), function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
  function link(txt, href, cls) { var a = document.createElement('a'); a.className = cls; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = txt; return a; }
  function abrir(id, btn) {
    var c = F[id]; if (!c) return; opener = btn;
    $('dlg-t').textContent = c.t; $('dlg-m').textContent = c.meta;
    var p = $('dlg-p'); p.innerHTML = ''; var b = document.createElement('b'); b.textContent = c.p; p.appendChild(b);
    if (c.ant) { var s = document.createElement('s'); s.textContent = c.ant; p.appendChild(document.createTextNode(' ')); p.appendChild(s); }
    var n = $('dlg-n'); n.innerHTML = '';
    (c.vend ? ['Aviso marcado como vendido en Clasionce.'] : []).concat(c.notas).forEach(function (t) { var q = document.createElement('p'); q.className = 'car-n'; q.textContent = t; n.appendChild(q); });
    var a = $('dlg-a'); a.innerHTML = ''; a.appendChild(link('Ver aviso ↗', c.url, 'btn p sm')); if (c.wa) a.appendChild(link('Consultar', c.wa, 'btn o sm'));
    $('dlg-s').textContent = 'Fuente: Clasionce. El precio y la disponibilidad pueden haber cambiado: consultá antes de decidir.';
    th.innerHTML = '';
    c.fotos.forEach(function (f, i) {
      var li = document.createElement('li'), bt = document.createElement('button'), im = document.createElement('img');
      bt.type = 'button'; bt.setAttribute('aria-label', 'Ver foto ' + (i + 1)); im.src = f; im.alt = ''; im.width = 64; im.height = 48; im.loading = 'lazy';
      bt.appendChild(im); bt.addEventListener('click', function () { foto(c.fotos, i, c.t); }); li.appendChild(bt); th.appendChild(li);
    });
    th.hidden = c.fotos.length < 2; img.hidden = !c.fotos.length;
    if (c.fotos.length) foto(c.fotos, 0, c.t);
    dlg.showModal();
  }
  [].forEach.call(document.querySelectorAll('[data-ficha]'), function (b) { b.hidden = false; b.addEventListener('click', function () { abrir(b.dataset.ficha, b); }); });
  $('dlg-x').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
})();
