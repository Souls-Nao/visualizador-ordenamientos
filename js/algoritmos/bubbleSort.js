/**
 * js/algoritmos/bubbleSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Bubble Sort como generador.
 *
 * Traducción de bubble_sort (docs/referencia/ordenamientos.py). Igual que el
 * original, hace n pasadas completas de j = 0 a n - 2, sin salida temprana:
 * con n = 5 son siempre 20 comparaciones, esté o no ordenada la lista.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.bubble que representa cada evento. */
const LINEA = Object.freeze({ PASADA: 4, COMPARAR: 6, INTERCAMBIAR: 7 });

export function* bubbleSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1; j++) {
      yield crearEventoComparar(j, j + 1, LINEA.COMPARAR);

      if (arr[j] > arr[j + 1]) {
        yield crearEventoIntercambiar(j, j + 1, LINEA.INTERCAMBIAR);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }

    // Cada pasada deja el mayor de los restantes al final: la posición
    // n - 1 - i ya no se mueve.
    yield crearEventoOrdenado(n - 1 - i, LINEA.PASADA);
  }

  yield crearEventoTerminado();
}
