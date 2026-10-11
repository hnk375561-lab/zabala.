(function () {
  var list = document.getElementById('cars'), flt = document.getElementById('flt');
  if (!list || !flt) return;
  var items = [].slice.call(list.children), q = document.getElementById('fq'), fm = document.getElementById('fm'),
    fo = document.getElementById('fo'), ft = document.getElementById('ft'), fn = document.getElementById('fn'), vac = document.getElementById('vac'),
    chips = [].slice.call(flt.querySelectorAll('.chip')), tr = '';
  flt.hidden = false; /* sin JavaScript los filtros no se muestran y la lista queda completa */
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function apply() {
    var t = norm(q.value.trim()), m = fm.value, tp = ft.value, n = 0, o = fo.value;
    var sorted = items.slice().sort(function (a, b) {
      if (a.dataset.v !== b.dataset.v) return a.dataset.v - b.dataset.v; /* vendidos siempre al final */
      if (o === 'yd') return (b.dataset.y - a.dataset.y) || (a.dataset.i - b.dataset.i);
      if (o === 'ya') return ((a.dataset.y || 9999) - (b.dataset.y || 9999)) || (a.dataset.i - b.dataset.i);
      return a.dataset.i - b.dataset.i;
    });
    sorted.forEach(function (li) {
      var ok = (!m || li.dataset.m === m) && (!tp || li.dataset.tp === tp) && (!tr || li.dataset.tr === tr) && (!t || norm(li.dataset.q).indexOf(t) > -1);
      li.hidden = !ok; if (ok) n++; list.appendChild(li);
    });
    fn.textContent = 'Mostrando ' + n + ' de ' + items.length;
    vac.hidden = n > 0;
  }
  q.addEventListener('input', apply); fm.addEventListener('change', apply); fo.addEventListener('change', apply); ft.addEventListener('change', apply);
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      tr = c.dataset.tr;
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      apply();
    });
  });
  apply();
})();
