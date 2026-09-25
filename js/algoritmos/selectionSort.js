/**
 * js/algoritmos/selectionSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Selection Sort como generador.
 *
 * Traducción de selection_sort (docs/referencia/ordenamientos.py). Igual que
 * el original, recorre i hasta n - 2 e intercambia SIEMPRE al final de cada
 * vuelta, aunque el mínimo ya esté en su lugar (en ese caso la barra se
 * intercambia consigo misma). Así los movimientos coinciden con Python.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.selection que representa cada evento. */
const LINEA = Object.freeze({ COMPARAR: 7, INTERCAMBIAR: 9, FIN: 10 });

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

    yield crearEventoIntercambiar(i, minIdx, LINEA.INTERCAMBIAR);
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

    // Tras el intercambio, la posición i ya tiene su valor definitivo.
    yield crearEventoOrdenado(i, LINEA.INTERCAMBIAR);
  }

  // El último elemento queda en su lugar cuando terminan las vueltas.
  if (n > 0) {
    yield crearEventoOrdenado(n - 1, LINEA.FIN);
  }

  yield crearEventoTerminado();
}
