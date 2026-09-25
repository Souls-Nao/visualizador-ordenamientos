/**
 * js/benchmark/worker.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 10 — Web Worker que mide los tiempos del benchmark.
 *
 * Corre en un hilo aparte, así la página no se congela aunque la medición
 * tarde varios segundos. Sigue la lógica de calcular_tiempos (benchmark.py):
 * para cada tamaño genera UNA lista y cada algoritmo ordena una copia.
 *
 * Método de medición:
 *   1. Una ejecución de calentamiento que se descarta (el motor de JS
 *      optimiza el código después de las primeras llamadas).
 *   2. `repeticiones` mediciones con performance.now().
 *   3. Se guarda la mediana, que no se ve afectada por una medición suelta
 *      más lenta (por ejemplo, si el navegador hizo otra tarea en medio).
 *
 * Protocolo de mensajes (BLOQUES.md, B10):
 *   recibe → { tipo: 'iniciar', config: { inicio, incremento, fin, repeticiones, patron } }
 *   envía  → { tipo: 'progreso', hecho, total }
 *            { tipo: 'fin', resultados }
 *            { tipo: 'error', mensaje }
 * Para cancelar, la página llama worker.terminate().
 */
import { FIELES } from './fieles.js';
import { generarDatos } from '../core/datos.js';
import { LIMITE_STOOGE_BENCH } from '../config.js';

/** Tiempo en milisegundos de una ejecución de `ordenar` sobre una copia de `lista`. */
function medirUnaVez(ordenar, lista) {
  const copia = [...lista];
  const inicio = performance.now();
  ordenar(copia);
  return performance.now() - inicio;
}

function mediana(valores) {
  const orden = [...valores].sort((a, b) => a - b);
  const medio = Math.floor(orden.length / 2);
  return orden.length % 2 ? orden[medio] : (orden[medio - 1] + orden[medio]) / 2;
}

function ejecutar({ inicio, incremento, fin, repeticiones, patron }) {
  const ids = Object.keys(FIELES);
  const tamanos = [];
  for (let n = inicio; n <= fin; n += incremento) tamanos.push(n);

  const tiempos = Object.fromEntries(ids.map((id) => [id, []]));
  const omitidos = {};
  const total = tamanos.length * ids.length;
  let hecho = 0;

  for (const n of tamanos) {
    const lista = generarDatos(n, patron);

    for (const id of ids) {
      if (id === 'stooge' && n > LIMITE_STOOGE_BENCH) {
        tiempos[id].push(null);
        omitidos[id] = `Se omite con listas de más de ${LIMITE_STOOGE_BENCH} elementos por su tiempo n^2.71.`;
      } else {
        const ordenar = FIELES[id];
        medirUnaVez(ordenar, lista); // calentamiento
        const medidas = [];
        for (let r = 0; r < repeticiones; r++) medidas.push(medirUnaVez(ordenar, lista));
        tiempos[id].push(mediana(medidas));
      }
      hecho++;
      postMessage({ tipo: 'progreso', hecho, total });
    }
  }

  return { tamanos, patron, repeticiones, tiempos, omitidos };
}

self.onmessage = ({ data }) => {
  if (data?.tipo !== 'iniciar') return;
  try {
    postMessage({ tipo: 'fin', resultados: ejecutar(data.config) });
  } catch (error) {
    postMessage({ tipo: 'error', mensaje: error.message });
  }
};
