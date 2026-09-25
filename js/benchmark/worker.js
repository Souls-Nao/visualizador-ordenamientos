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
 *   1. Calentamiento general antes de empezar (ver `calentar`).
 *   2. Cada medición es un LOTE: el navegador redondea performance.now() a
 *      ~0.1 ms, así que una lista pequeña mediría 0. Se repite el algoritmo
 *      hasta acumular al menos MIN_MS_LOTE y se divide entre las vueltas.
 *   3. `repeticiones` lotes y se guarda la mediana, que no se ve afectada
 *      por un lote suelto más lento (otra tarea del navegador en medio).
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

const MIN_MS_LOTE = 5;
const MAX_VUELTAS = 4096;

/** Tiempo total de `vueltas` ejecuciones seguidas. */
function medirLote(ordenar, lista, vueltas) {
  const inicio = performance.now();
  for (let v = 0; v < vueltas; v++) ordenar(lista);
  return performance.now() - inicio;
}

/**
 * Cuántas vueltas hacen falta para que un lote dure al menos MIN_MS_LOTE.
 * Las versiones fieles copian la lista al empezar (como `lista.copy()` en
 * Python), así que repetir sobre la misma lista siempre ordena lo mismo.
 */
function vueltasPorLote(ordenar, lista) {
  let vueltas = 1;
  while (vueltas < MAX_VUELTAS && medirLote(ordenar, lista, vueltas) < MIN_MS_LOTE) vueltas *= 2;
  return vueltas;
}

/** Tiempo en milisegundos de una ejecución, medido como promedio de un lote. */
function medirUnaVez(ordenar, lista, vueltas) {
  return medirLote(ordenar, lista, vueltas) / vueltas;
}

/**
 * Calentamiento general antes de medir: el motor de JavaScript compila y
 * optimiza una función solo después de ejecutarla varias veces. Sin esto,
 * los primeros tamaños se miden con código sin optimizar y salen más lentos
 * que tamaños mayores, y las curvas se deforman.
 */
const TAMANO_CALENTAMIENTO = 300;
const RONDAS_CALENTAMIENTO = 5;

function calentar(ids, n, patron) {
  const lista = generarDatos(n, patron);
  const listaStooge = lista.slice(0, Math.min(n, 100));
  for (let r = 0; r < RONDAS_CALENTAMIENTO; r++) {
    for (const id of ids) FIELES[id]([...(id === 'stooge' ? listaStooge : lista)]);
  }
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

  calentar(ids, Math.min(fin, TAMANO_CALENTAMIENTO), patron);

  for (const n of tamanos) {
    const lista = generarDatos(n, patron);

    for (const id of ids) {
      if (id === 'stooge' && n > LIMITE_STOOGE_BENCH) {
        tiempos[id].push(null);
        omitidos[id] = `Se omite con listas de más de ${LIMITE_STOOGE_BENCH} elementos por su tiempo n^2.71.`;
      } else {
        const ordenar = FIELES[id];
        const vueltas = vueltasPorLote(ordenar, lista);
        const medidas = [];
        for (let r = 0; r < repeticiones; r++) medidas.push(medirUnaVez(ordenar, lista, vueltas));
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
