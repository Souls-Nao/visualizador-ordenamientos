/**
 * js/benchmark/csv.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 11 — Exportación de los resultados del benchmark a CSV.
 *
 * Una fila por tamaño y una columna por algoritmo, con tiempos en
 * milisegundos. Un tiempo omitido (Stooge con listas grandes) queda vacío.
 */
import { ALGORITMOS } from '../algoritmos/index.js';

/**
 * @param {Object} resultados  Salida del Worker (Bloque 10).
 * @returns {string}
 */
export function resultadosACSV(resultados) {
  const ids = Object.keys(resultados.tiempos);
  const filas = [['n', ...ids.map((id) => `${ALGORITMOS[id].nombre} (ms)`)]];
  resultados.tamanos.forEach((n, k) => {
    filas.push([n, ...ids.map((id) => resultados.tiempos[id][k]?.toFixed(4) ?? '')]);
  });
  return filas.map((fila) => fila.join(',')).join('\r\n');
}

/**
 * Descarga el CSV desde el navegador.
 *
 * @param {Object} resultados
 * @param {string} [nombre]
 */
export function descargarCSV(resultados, nombre = `benchmark-${resultados.patron}.csv`) {
  // El BOM (\uFEFF) hace que Excel reconozca los acentos (UTF-8).
  const blob = new Blob(['\uFEFF', resultadosACSV(resultados)], { type: 'text/csv;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombre;
  enlace.click();
  // Se libera después, para no cancelar la descarga en algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
