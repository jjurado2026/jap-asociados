/* ============================================================
   JAP & ASOCIADOS — "TRAMO"
   El hero no describe el servicio: lo hace.
   Todo el contenido es legible sin JavaScript.
   ============================================================ */
(() => {
  'use strict';
  const captura = location.search.includes('ss');
  const quieto  = captura || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  if (captura) $$('img[loading="lazy"]').forEach(i => i.loading = 'eager');

  // useGrouping:'always' — sin esto, es-ES no separa los millares de 4 cifras
  // y "8280 €" queda junto a "31.720 €" en la misma tarjeta
  const eur = n => new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always'
  }).format(Math.round(n));
  const pct = n => new Intl.NumberFormat('es-ES', {
    style: 'percent', maximumFractionDigits: 1
  }).format(n);

  /* ---------- Entrada al viewport ---------- */
  const entradas = $$('.entra');
  if (quieto || !('IntersectionObserver' in window)) {
    entradas.forEach(el => el.classList.add('visible'));
    $$('.tramo').forEach(t => t.classList.add('tramo--ya'));
  } else {
    const io = new IntersectionObserver((filas, obs) => {
      filas.forEach(f => {
        if (!f.isIntersecting) return;
        f.target.classList.add('visible');
        $$('.tramo', f.target).forEach(t => t.classList.add('tramo--ya'));
        obs.unobserve(f.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    entradas.forEach(el => io.observe(el));
  }

  /* ============================================================
     EL SIMULADOR
     Base del ahorro (IRPF) frente a Impuesto de Sociedades.
     Cálculo orientativo y deliberadamente simplificado: el aviso
     bajo el simulador dice exactamente qué no contempla.
     ============================================================ */
  const TRAMOS_AHORRO = [        // IRPF, base del ahorro
    [6000,    0.19],
    [50000,   0.21],
    [200000,  0.23],
    [300000,  0.27],
    [Infinity,0.30],
  ];
  const TIPO_IS = 0.23;          // cifra de negocio < 1 M€

  const cuotaAhorro = base => {
    let cuota = 0, previo = 0;
    for (const [techo, tipo] of TRAMOS_AHORRO) {
      if (base <= previo) break;
      cuota += (Math.min(base, techo) - previo) * tipo;
      previo = techo;
    }
    return cuota;
  };

  const sim = $('#simulador');
  if (sim) {
    const campo  = $('#beneficio');
    const rango  = $('#beneficio-rango');
    const pinta  = {
      pfNeto: $('#pf-neto'), pfPaga: $('#pf-paga'), pfTipo: $('#pf-tipo'),
      pfQueda: $('#pf-barra-queda'), pfPagaB: $('#pf-barra-paga'),
      slNeto: $('#sl-neto'), slPaga: $('#sl-paga'),
      slQueda: $('#sl-barra-queda'), slPagaB: $('#sl-barra-paga'),
      ahorro: $('#ahorro-cifra'),
    };

    const calcular = base => {
      const pfCuota = cuotaAhorro(base);
      const slCuota = base * TIPO_IS;
      const pfNeto = base - pfCuota, slNeto = base - slCuota;

      pinta.pfNeto.textContent = eur(pfNeto);
      pinta.pfPaga.textContent = eur(pfCuota);
      pinta.pfTipo.textContent = base > 0 ? pct(pfCuota / base) : '—';
      pinta.slNeto.textContent = eur(slNeto);
      pinta.slPaga.textContent = eur(slCuota);

      pinta.pfQueda.style.flex = `0 0 ${(pfNeto / base * 100).toFixed(2)}%`;
      pinta.pfPagaB.style.flex = `0 0 ${(pfCuota / base * 100).toFixed(2)}%`;
      pinta.slQueda.style.flex = `0 0 ${(slNeto / base * 100).toFixed(2)}%`;
      pinta.slPagaB.style.flex = `0 0 ${(slCuota / base * 100).toFixed(2)}%`;

      const dif = Math.abs(pfCuota - slCuota);
      pinta.ahorro.textContent = dif < 1
        ? 'sin diferencia'
        : `${eur(dif)} · ${pfCuota > slCuota ? 'la sociedad paga menos' : 'la persona física paga menos'}`;
    };

    const leer = txt => {
      const n = parseInt(String(txt).replace(/[^\d]/g, ''), 10);
      return Number.isFinite(n) ? Math.min(Math.max(n, 0), 5_000_000) : 0;
    };
    const formatear = n => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(n);

    campo.addEventListener('input', () => {
      const n = leer(campo.value);
      if (n > 0) { calcular(n); if (n <= +rango.max) rango.value = n; }
    });
    campo.addEventListener('blur', () => {
      const n = leer(campo.value);
      campo.value = formatear(n || 0);
    });
    rango.addEventListener('input', () => {
      campo.value = formatear(+rango.value);
      calcular(+rango.value);
    });

    calcular(leer(campo.value) || 40000);
    sim.querySelectorAll('.tramo').forEach(t => t.classList.add('tramo--ya'));
  }

  /* ---------- Triaje: filtra el índice de servicios ---------- */
  const chips  = $$('.chip[data-perfil]');
  const filas  = $$('.serv__fila[data-perfil]');
  const vacio  = $('#serv-vacio');

  const filtrar = perfil => {
    let n = 0;
    filas.forEach(f => {
      const entra = perfil === 'todo' || f.dataset.perfil.split(' ').includes(perfil);
      f.hidden = !entra;
      if (entra) n++;
    });
    if (vacio) vacio.hidden = n > 0;
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    filtrar(chip.dataset.perfil);
  }));
  const reset = $('[data-reset]');
  if (reset) reset.addEventListener('click', () => chips[0].click());

  /* ---------- Formularios ---------- */
  const pdf = $('#form-pdf');
  if (pdf) pdf.addEventListener('submit', ev => {
    ev.preventDefault();
    $('#pdf-estado').textContent = 'Prototipo: en producción, el informe llega al email y el lead entra en el CRM.';
  });

  const cont = $('#form-contacto');
  if (cont) cont.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cont.checkValidity()) { cont.reportValidity(); return; }
    $('#cont-estado').textContent = 'Prototipo: el formulario aún no envía. En producción avisa al departamento elegido.';
  });
})();
