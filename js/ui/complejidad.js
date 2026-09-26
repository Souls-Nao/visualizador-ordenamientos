/**
 * js/ui/complejidad.js
 * ─────────────────────────────────────────────────────────────────────────
 * Complejidad temporal de forma visual (requisito 8 de la actividad).
 *
 * - Cada clase de complejidad tiene un color: verde O(n), azul O(n log n),
 *   naranja O(n²) y rojo O(n^2.71). Es la única fuente de esos colores:
 *   la usan la gráfica y las etiquetas (crearEtiquetaComplejidad).
 * - `crearGraficaComplejidad` dibuja en SVG cómo crece cada clase hasta el
 *   tamaño de la lista actual y resalta la del algoritmo: se ve de inmediato
 *   por qué O(n²) se dispara y O(n log n) casi no crece.
 * - `estimarOperaciones` da el valor de la fórmula para n, que la tabla
 *   resumen muestra junto a las comparaciones reales.
 *
 * Las clases se obtienen del texto de ALGORITMOS[id].promedio / .peor, así
 * que no hace falta cambiar el registro (Bloque 03).
 */
import { ALGORITMOS } from '../algoritmos/index.js';

/** Clases de complejidad, de la más lenta a la más rápida en crecer. */
export const CLASES = Object.freeze({
  'O(n)': { clave: 'n', etiqueta: 'n', color: '#16a34a', f: (n) => n },
  'O(n log n)': { clave: 'nlogn', etiqueta: 'n log n', color: '#0284c7', f: (n) => n * Math.log2(n) },
  'O(n²)': { clave: 'n2', etiqueta: 'n²', color: '#d97706', f: (n) => n * n },
  'O(n^2.71)': { clave: 'n271', etiqueta: 'n^2.71', color: '#dc2626', f: (n) => n ** 2.71 },
});

/** @param {string} notacion  Por ejemplo 'O(n²)'. */
export function claseDe(notacion) {
  return CLASES[notacion];
}

/**
 * Etiqueta con la notación y el color de su clase.
 *
 * @param {string} notacion  Por ejemplo 'O(n²)'.
 * @returns {HTMLSpanElement}
 */
export function crearEtiquetaComplejidad(notacion) {
  const etiqueta = document.createElement('span');
  etiqueta.className = 'complejidad';
  etiqueta.style.background = CLASES[notacion].color;
  etiqueta.textContent = notacion;
  return etiqueta;
}

/** Valor aproximado de la complejidad promedio de un algoritmo para n. */
export function estimarOperaciones(id, n) {
  return Math.round(CLASES[ALGORITMOS[id].promedio].f(Math.max(n, 2)));
}

const SVG = 'http://www.w3.org/2000/svg';
const ANCHO = 300;
const ALTO = 170;
const MARGEN = { izq: 8, der: 58, arr: 10, aba: 22 };
const MUESTRAS = 40;

function nodo(nombre, atributos = {}, texto) {
  const el = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/**
 * Gráfica de crecimiento de 1 a n. Muestra O(n), O(n log n) y O(n²), y además
 * O(n^2.71) si el algoritmo es de esa clase. La curva del caso promedio va
 * gruesa; si el peor caso es distinto, va punteada.
 *
 * @param {string} id  Clave de ALGORITMOS.
 * @param {number} n   Tamaño de la lista actual.
 * @returns {SVGSVGElement}
 */
export function crearGraficaComplejidad(id, n) {
  const { promedio, peor } = ALGORITMOS[id];
  const nMax = Math.max(n, 10);
  const visibles = ['O(n)', 'O(n log n)', 'O(n²)'];
  if (promedio === 'O(n^2.71)') visibles.push('O(n^2.71)');

  const yMax = Math.max(...visibles.map((c) => CLASES[c].f(nMax)));
  const anchoUtil = ANCHO - MARGEN.izq - MARGEN.der;
  const altoUtil = ALTO - MARGEN.arr - MARGEN.aba;
  const x = (v) => MARGEN.izq + (v / nMax) * anchoUtil;
  const y = (v) => MARGEN.arr + altoUtil - (v / yMax) * altoUtil;

  const svg = nodo('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'grafica-complejidad',
    role: 'img',
    'aria-label': `Crecimiento de ${promedio} comparado con otras complejidades hasta n = ${n}`,
  });

  // Ejes
  const base = MARGEN.arr + altoUtil;
  svg.append(
    nodo('line', { x1: MARGEN.izq, y1: base, x2: MARGEN.izq + anchoUtil, y2: base, class: 'grafica-complejidad__eje' }),
    nodo('line', { x1: MARGEN.izq, y1: MARGEN.arr, x2: MARGEN.izq, y2: base, class: 'grafica-complejidad__eje' }),
    nodo('text', { x: MARGEN.izq + anchoUtil, y: ALTO - 6, 'text-anchor': 'end', class: 'grafica-complejidad__texto' },
      `n = ${nMax}`),
  );

  // Curvas: primero las de fondo, al final las del algoritmo para que queden encima.
  const orden = [...visibles].sort((a, b) => (a === promedio || a === peor) - (b === promedio || b === peor));
  for (const notacion of orden) {
    const { f, color, etiqueta } = CLASES[notacion];
    const puntos = [];
    for (let k = 1; k <= MUESTRAS; k++) {
      const v = (k / MUESTRAS) * nMax;
      puntos.push(`${x(v).toFixed(1)},${y(f(Math.max(v, 1))).toFixed(1)}`);
    }
    const esPromedio = notacion === promedio;
    const esPeor = notacion === peor && !esPromedio;
    const clase = esPromedio ? 'principal' : esPeor ? 'peor' : 'fondo';
    svg.append(nodo('polyline', {
      points: puntos.join(' '),
      stroke: color,
      class: `grafica-complejidad__curva grafica-complejidad__curva--${clase}`,
    }));

    // Etiqueta al final de la curva (se recorta dentro del área si la curva sale por arriba).
    const yFin = Math.max(MARGEN.arr + 8, y(f(nMax)) + 4);
    svg.append(nodo('text', {
      x: x(nMax) + 4, y: yFin, style: `fill: ${color}`,
      class: `grafica-complejidad__texto${clase === 'fondo' ? '' : ' grafica-complejidad__texto--fuerte'}`,
    }, etiqueta));
  }
  return svg;
}
