/* Funciones de secciones Zabala: sin dependencias y respetando reduced-motion. */
(function () {
  'use strict';
  var wa = 'https://wa.me/5493434732110?text=';
  var enc = function (s) { return wa + encodeURIComponent(s); };
  var byId = function (id) { return document.getElementById(id); };
  var dayNames = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  var today = document.querySelector('[data-day="' + dayNames[new Date().getDay()] + '"]');
  if (today) today.setAttribute('data-today', 'true');

  document.querySelectorAll('[data-whatsapp-form]').forEach(function (form) {
    var out = form.querySelector('[data-preview]');
    var update = function () {
      var fields = [];
      form.querySelectorAll('input, select, textarea').forEach(function (input) {
        if (input.value.trim()) fields.push((input.dataset.label || input.name || 'Dato') + ': ' + input.value.trim());
      });
      var text = 'Hola, Zabala. Quiero hacer una consulta.' + (fields.length ? '\n' + fields.join('\n') : '');
      if (out) out.textContent = text;
      var link = form.querySelector('[data-send]');
      if (link) link.href = enc(text);
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  });

  var visitCar = byId('visit-car');
  if (visitCar) {
    document.querySelectorAll('#cars h3').forEach(function (title) {
      var option = document.createElement('option');
      option.value = title.textContent.trim(); option.textContent = title.textContent.trim();
      visitCar.appendChild(option);
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(value).then(function () { button.textContent = 'Copiado'; });
    });
  });

  document.querySelectorAll('[data-print]').forEach(function (button) {
    button.addEventListener('click', function () { window.print(); });
  });
})();
