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
  var links = [].slice.call(g.querySelectorAll('a')), img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cur = 0, opener = null;
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
  lb.querySelector('.lb-x').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-p').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-n').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1); });
  lb.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
})();
