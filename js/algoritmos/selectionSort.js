/**
 * js/algoritmos/selectionSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Selection Sort como generador.
 *
 * Traducción de FUENTES_PYTHON.selection. A diferencia de la práctica
 * original, solo intercambia cuando el mínimo no está ya en su lugar, para
 * no animar ni contar el intercambio de una barra consigo misma.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.selection que representa cada evento. */
const LINEA = Object.freeze({ COMPARAR: 7, SI_CAMBIO: 9, INTERCAMBIAR: 10, FIN: 11 });

export function* selectionSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield crearEventoComparar(j, minIdx, LINEA.COMPARAR);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      yield crearEventoIntercambiar(i, minIdx, LINEA.INTERCAMBIAR);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // Al terminar la vuelta, la posición i ya tiene su valor definitivo.
    yield crearEventoOrdenado(i, LINEA.SI_CAMBIO);
  }

  // El último elemento queda en su lugar cuando terminan las vueltas.
  if (n > 0) {
    yield crearEventoOrdenado(n - 1, LINEA.FIN);
  }

  yield crearEventoTerminado();
}
