/**
 * js/core/crecimiento.js
 * ─────────────────────────────────────────────────────────────────────────
 * Medición del crecimiento de cada algoritmo (requisito 8, ventana
 * "Crecimiento"). Es la idea de benchmark.py: para varios tamaños n se
 * genera UNA lista aleatoria y cada algoritmo la ordena, sin animar.
 *
 * Dos medidas:
 *   - 'comparaciones': cuántas comparaciones hace (contarEjecucion, B07).
 *     No depende de la computadora, solo del algoritmo y de la lista:
 *     muestra la complejidad sin el ruido de la medición de tiempo.
 *   - 'tiempo': milisegundos por ejecución, como en la práctica. El reloj
 *     del navegador redondea a ~0.1 ms, así que se mide por lotes: se
 *     repite hasta acumular MIN_MS_LOTE y se divide entre las vueltas.
 *
 * Se mide el mismo generador que se anima, así el tiempo corresponde al
 * código que se ve en pantalla.
 *
 * No usa el DOM. `calcularCrecimiento` cede el control entre tamaños para
 * que la página no se congele y pueda mostrar el progreso.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { generarDatos, PATRONES } from './datos.js';
import { contarEjecucion } from './metricas.js';

export const MEDIDAS = Object.freeze({ COMPARACIONES: 'comparaciones', TIEMPO: 'tiempo' });

/** Límites de la ventana: suficientes para ver la forma de las curvas sin esperar demasiado. */
export const CRECIMIENTO_N_MIN = 10;
export const CRECIMIENTO_N_MAX = 2000;
export const PUNTOS = 10;

/** Stooge Sort (n^2.71) se omite por encima de este tamaño: tardaría varios segundos. */
export const LIMITE_STOOGE_CRECIMIENTO = 200;

const MIN_MS_LOTE = 5;
const MAX_VUELTAS = 1024;

/**
 * Tamaños equiespaciados de nMax/PUNTOS hasta nMax (enteros, sin repetir).
 *
 * @param {number} nMax
 * @returns {number[]}
 */
export function tamanosHasta(nMax) {
  const tamanos = new Set();
  for (let k = 1; k <= PUNTOS; k++) tamanos.add(Math.max(2, Math.round((k * nMax) / PUNTOS)));
  return [...tamanos];
}

/** Milisegundos de una ejecución completa del generador, medidos por lotes. */
export function medirTiempo(id, lista) {
  const ejecutar = () => {
    for (const _ of ALGORITMOS[id].generador(lista)); // recorre todos los eventos
  };
  let vueltas = 1;
  for (;;) {
    const inicio = performance.now();
    for (let v = 0; v < vueltas; v++) ejecutar();
    const ms = performance.now() - inicio;
    if (ms >= MIN_MS_LOTE || vueltas >= MAX_VUELTAS) return ms / vueltas;
    vueltas *= 2;
  }
}

/** Comparaciones de una ejecución completa. */
export function medirComparaciones(id, lista) {
  return contarEjecucion(ALGORITMOS[id].generador(lista)).comparaciones;
}

/**
 * Mide cada algoritmo para varios tamaños hasta nMax.
 *
 * @param {Object} opciones
 * @param {string[]} opciones.ids
 * @param {number} opciones.nMax
 * @param {string} opciones.medida                  Valor de MEDIDAS.
 * @param {(hecho: number, total: number) => void} [opciones.alProgreso]
 * @returns {Promise<{ medida, tamanos: number[], series: Record<string, (number|null)[]>, omitidos: string[] }>}
 */
export async function calcularCrecimiento({ ids, nMax, medida, alProgreso = () => {} }) {
  const tamanos = tamanosHasta(nMax);
  const series = Object.fromEntries(ids.map((id) => [id, []]));
  const omitidos = new Set();
  const medir = medida === MEDIDAS.TIEMPO ? medirTiempo : medirComparaciones;

  for (const [k, n] of tamanos.entries()) {
    const lista = generarDatos(n, PATRONES.ALEATORIA); // misma lista para todos
    for (const id of ids) {
      if (id === 'stooge' && n > LIMITE_STOOGE_CRECIMIENTO) {
        series[id].push(null);
        omitidos.add(id);
      } else {
        series[id].push(medir(id, lista));
      }
    }
    alProgreso(k + 1, tamanos.length);
    await new Promise((listo) => setTimeout(listo, 0)); // deja respirar a la página
  }

  return { medida, tamanos, series, omitidos: [...omitidos] };
}
