/**
 * js/algoritmos/bubbleSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Bubble Sort como generador.
 *
 * Traducción de FUENTES_PYTHON.bubble. Respecto a la práctica original,
 * cada pasada recorre solo la parte sin ordenar (hasta n - 1 - i) y el
 * algoritmo termina en cuanto una pasada no hace intercambios. Así no
 * vuelve a comparar las barras que ya quedaron fijas al final.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.bubble que representa cada evento. */
const LINEA = Object.freeze({ PASADA: 4, COMPARAR: 7, INTERCAMBIAR: 8 });

export function* bubbleSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let huboIntercambio = false;

    for (let j = 0; j < n - 1 - i; j++) {
      yield crearEventoComparar(j, j + 1, LINEA.COMPARAR);

      if (arr[j] > arr[j + 1]) {
        yield crearEventoIntercambiar(j, j + 1, LINEA.INTERCAMBIAR);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        huboIntercambio = true;
      }
    }

    // Si nada se movió, la lista ya está ordenada: `done` marca el resto.
    if (!huboIntercambio) break;

    // La pasada llevó el mayor de los restantes a la posición n - 1 - i.
    yield crearEventoOrdenado(n - 1 - i, LINEA.PASADA);
  }

  yield crearEventoTerminado();
}
