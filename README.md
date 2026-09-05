# JAP & Asociados — Propuesta de remaquetación de la homepage

Prototipo de la homepage de **JAP & Asociados**, asesoría multidisciplinar en Parla (Madrid). Conserva **el copy y el orden de bloques literales** de [japyasociados.com](https://japyasociados.com/) y los remaqueta con un diseño nuevo.

**Ver online:** https://jjurado2026.github.io/jap-asociados/

## Dirección estética
- **Paleta del cliente:** azul del logo `#046C91`, azul de marca `#6B9ED0`, navy `#14212B`, blanco. Nada más.
- **Tipografía:** Bricolage Grotesque (titulares) + Figtree (cuerpo), variables y autoalojadas.
- **Motivos propios:** el monograma JAP del cliente como pieza central del hero, el chevrón del logo como marcador de eyebrows y listas, y la barra "nº1 en fiscalidad para traders" convertida en ticker.
- **Movimiento:** secuencia de entrada del hero (titular palabra a palabra, monograma en tres piezas, fotos en abanico), revelado por scroll, barras de estadísticas que crecen, cifra "28" que entra deslizando. Todo respeta `prefers-reduced-motion`.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Todo el contenido es legible sin JS.

## Estructura
```
prototype/
  index.html
  assets/css/styles.css
  assets/js/main.js
  assets/fonts/      Bricolage Grotesque · Figtree (woff2 variables)
  assets/img/        Imágenes del cliente optimizadas a WebP
```

## Ver en local
```bash
cd prototype && python -m http.server 8000
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
