/* JAP & Asociados — interacción de la homepage
   Sin dependencias. Todo el contenido es legible sin JS. */
(function () {
  'use strict';
  var html = document.documentElement;

  /* 1. Secuencia de entrada del hero: arranca cuando las fuentes están listas */
  var arrancado = false;
  function arranca() {
    if (arrancado) return;
    arrancado = true;
    html.classList.add('cargado');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arranca);
  } else {
    arranca();
  }
  setTimeout(arranca, 1200);

  /* 2. Cabecera compacta al hacer scroll */
  var cab = document.getElementById('cabecera');
  function alScroll() {
    cab.classList.toggle('cab--compacta', window.scrollY > 8);
  }
  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });

  /* 3. Revelado de bloques al entrar en el viewport */
  var animados = document.querySelectorAll('[data-anim]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visto');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    animados.forEach(function (el) { io.observe(el); });
  } else {
    animados.forEach(function (el) { el.classList.add('visto'); });
  }

  /* 4. Menú: submenús (táctil y teclado) y panel móvil */
  var burger = document.querySelector('.cab__burger');
  var nav = document.getElementById('nav');
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item--sub'));

  function cierraTodos(salvo) {
    items.forEach(function (it) {
      if (it === salvo) return;
      it.classList.remove('abierto');
      var b = it.querySelector('button[aria-expanded]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (it) {
    var btn = it.querySelector('button[aria-expanded]');
    if (!btn) return;
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var abrir = !it.classList.contains('abierto');
      cierraTodos(it);
      it.classList.toggle('abierto', abrir);
      btn.setAttribute('aria-expanded', String(abrir));
    });
  });

  document.addEventListener('click', function (ev) {
    if (!ev.target.closest('.nav__item--sub')) cierraTodos();
  });

  function alternaMovil(forzar) {
    var abierto = typeof forzar === 'boolean' ? forzar : !nav.classList.contains('abierto');
    nav.classList.toggle('abierto', abierto);
    burger.setAttribute('aria-expanded', String(abierto));
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('sin-scroll', abierto);
    if (!abierto) cierraTodos();
  }
  burger.addEventListener('click', function () { alternaMovil(); });

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    cierraTodos();
    if (nav.classList.contains('abierto')) {
      alternaMovil(false);
      burger.focus();
    }
  });

  var mq = window.matchMedia('(min-width: 1081px)');
  var alCambiar = function () {
    if (mq.matches && nav.classList.contains('abierto')) alternaMovil(false);
  };
  if (mq.addEventListener) mq.addEventListener('change', alCambiar);
  else if (mq.addListener) mq.addListener(alCambiar);
})();
