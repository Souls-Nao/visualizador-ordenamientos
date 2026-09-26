/**
 * js/ui/graficaVivo.js
 * ─────────────────────────────────────────────────────────────────────────
 * Gráfica "Comparaciones durante la animación" (requisito 8).
 *
 * Se actualiza en cada cuadro con los mismos contadores de los paneles
 * (escena.resumen), así avanza exactamente al ritmo de las barras:
 *   eje X = pasos que lleva cada algoritmo, eje Y = comparaciones acumuladas.
 * Líneas horizontales punteadas marcan lo esperado para el n actual según
 * la complejidad de cada algoritmo (n log n, n², ...). Los algoritmos
 * rápidos terminan pronto y su línea se detiene; los O(n²) siguen subiendo.
 */
import { CLASES } from './complejidad.js';
import { ALGORITMOS } from '../algoritmos/index.js';
import { COLOR_ALGORITMO, nodo, crearLeyenda } from './graficaCrecimiento.js';

/** Puntos máximos por línea; al pasarse, se descarta uno de cada dos. */
const MAX_PUNTOS = 400;

const ANCHO = 720;
const ALTO = 300;
const M = { izq: 72, der: 96, arr: 14, aba: 40 };

/** Deja uno de cada dos puntos, conservando el primero y el último. */
function diezmar(puntos) {
  const ultimo = puntos.at(-1);
  const menos = puntos.filter((_, k) => k % 2 === 0);
  if (menos.at(-1) !== ultimo) menos.push(ultimo);
  return menos;
}

const formato = (v) => Math.round(v).toLocaleString('es-MX');

/**
 * @param {HTMLElement} contenedor
 * @returns {{ actualizar(resumen: Object[], n: number): void }}
 */
export function crearGraficaVivo(contenedor) {
  let ids = [];
  let n = 0;
  /** @type {Record<string, [number, number][]>} [pasos, comparaciones] por algoritmo */
  let series = {};

  function reiniciar(nuevosIds, nuevoN) {
    ids = nuevosIds;
    n = nuevoN;
    series = Object.fromEntries(ids.map((id) => [id, [[0, 0]]]));
  }

  function dibujar() {
    if (!ids.length) {
      const aviso = document.createElement('p');
      aviso.className = 'marcador';
      aviso.textContent = 'Selecciona al menos un algoritmo.';
      contenedor.replaceChildren(aviso);
      return;
    }

    // Referencias: lo esperado para n según la complejidad promedio de cada algoritmo.
    const referencias = [...new Set(ids.map((id) => ALGORITMOS[id].promedio))]
      .map((notacion) => ({ ...CLASES[notacion], valor: CLASES[notacion].f(Math.max(n, 2)) }));
    const ultimos = ids.map((id) => series[id].at(-1));
    const xMax = Math.max(10, ...ultimos.map(([p]) => p)) * 1.05;
    const yMax = Math.max(1, ...ultimos.map(([, c]) => c), ...referencias.map((r) => r.valor)) * 1.08;

    const anchoUtil = ANCHO - M.izq - M.der;
    const altoUtil = ALTO - M.arr - M.aba;
    const x = (p) => M.izq + (p / xMax) * anchoUtil;
    const y = (c) => M.arr + altoUtil - (c / yMax) * altoUtil;
    const base = M.arr + altoUtil;

    const svg = nodo('svg', {
      viewBox: `0 0 ${ANCHO} ${ALTO}`,
      class: 'grafica-crecimiento',
      role: 'img',
      'aria-label': 'Comparaciones acumuladas de cada algoritmo durante la animación',
    });

    for (let k = 0; k <= 4; k++) {
      const v = (yMax * k) / 4;
      svg.append(
        nodo('line', { x1: M.izq, y1: y(v), x2: M.izq + anchoUtil, y2: y(v), class: 'grafica-crecimiento__rejilla' }),
        nodo('text', { x: M.izq - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'grafica-crecimiento__texto' }, formato(v)),
      );
    }
    for (let k = 0; k <= 4; k++) {
      const p = (xMax * k) / 4;
      svg.append(nodo('text', { x: x(p), y: base + 16, 'text-anchor': 'middle', class: 'grafica-crecimiento__texto' },
        formato(p)));
    }
    svg.append(
      nodo('line', { x1: M.izq, y1: base, x2: M.izq + anchoUtil, y2: base, class: 'grafica-crecimiento__eje' }),
      nodo('text', { x: M.izq + anchoUtil / 2, y: ALTO - 4, 'text-anchor': 'middle', class: 'grafica-crecimiento__titulo' },
        'Pasos de la animación'),
      nodo('text', { x: 14, y: M.arr + altoUtil / 2, 'text-anchor': 'middle', class: 'grafica-crecimiento__titulo',
        transform: `rotate(-90 14 ${M.arr + altoUtil / 2})` }, 'Comparaciones'),
    );

    // Referencias horizontales con su etiqueta a la derecha ("n² ≈ 900").
    for (const { valor, etiqueta } of referencias) {
      svg.append(
        nodo('line', { x1: M.izq, y1: y(valor), x2: M.izq + anchoUtil, y2: y(valor),
          class: 'grafica-crecimiento__teorica' }),
        nodo('text', { x: M.izq + anchoUtil + 6, y: y(valor) + 4,
          class: 'grafica-crecimiento__texto grafica-crecimiento__texto--teorica' },
          `${etiqueta} ≈ ${formato(valor)}`),
      );
    }

    // Una línea por algoritmo y un punto en su posición actual.
    for (const id of ids) {
      const puntos = series[id];
      const color = COLOR_ALGORITMO[id];
      svg.append(nodo('polyline', {
        points: puntos.map(([p, c]) => `${x(p).toFixed(1)},${y(c).toFixed(1)}`).join(' '),
        stroke: color,
        class: 'grafica-crecimiento__serie',
      }));
      const [p, c] = puntos.at(-1);
      const punto = nodo('circle', { cx: x(p), cy: y(c), r: 4.5, fill: color });
      punto.append(nodo('title', {}, `${ALGORITMOS[id].nombre}: ${formato(c)} comparaciones en ${formato(p)} pasos`));
      svg.append(punto);
    }

    contenedor.replaceChildren(svg, crearLeyenda(ids, 'Punteadas: lo esperado para n según la complejidad'));
  }

  return {
    /**
     * Agrega el estado actual de cada panel. Si cambió la selección o el
     * tamaño, o todos volvieron a cero (Reiniciar), empieza de nuevo.
     *
     * @param {Object[]} resumen  escena.resumen: { id, pasos, comparaciones, ... } por panel.
     * @param {number} nActual    Tamaño de la lista.
     */
    actualizar(resumen, nActual) {
      const nuevosIds = resumen.map((r) => r.id);
      const mismos = [...nuevosIds].sort().join() === [...ids].sort().join();
      const enCero = resumen.every((r) => r.pasos === 0);
      if (!mismos || nActual !== n || enCero) {
        // Se conserva el orden de la selección (el resumen se ordena por llegada).
        reiniciar(Object.keys(ALGORITMOS).filter((id) => nuevosIds.includes(id)), nActual);
      }
      for (const { id, pasos, comparaciones } of resumen) {
        const puntos = series[id];
        if (puntos.at(-1)[0] === pasos) continue;
        puntos.push([pasos, comparaciones]);
        if (puntos.length > MAX_PUNTOS) series[id] = diezmar(puntos);
      }
      dibujar();
    },
  };
}
