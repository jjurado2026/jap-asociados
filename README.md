# JAP & Asociados — Propuesta de rediseño web

Prototipo de homepage para **JAP & Asociados**, asesoría multidisciplinar en Parla, Madrid, especializada en fiscalidad del trading.

**Dirección estética:** *"Precisión documental"* — la web se parece a su producto: el dictamen bien hecho. Monocromo frío con un único acento, tipografía Instrument Sans + Public Sans, y el foliado de expediente como motivo.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes variables autoalojadas.

## Objetivos técnicos
LCP < 1,5 s · CLS < 0,05 · INP < 200 ms · Lighthouse 95+ en las cuatro categorías.

## Estructura
```
prototype/          Prototipo navegable
  index.html
  assets/css/       global.css · home.css
  assets/js/
  assets/fonts/     Variables autoalojadas
  assets/img/
```

## Ver en local
```bash
cd prototype && python3 -m http.server 8000
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
