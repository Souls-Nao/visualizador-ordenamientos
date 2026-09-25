/**
 * js/algoritmos/stoogeSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Stooge Sort como generador.
 *
 * Traducción de _stooge_sort_rec y stooge_sort
 * (docs/referencia/ordenamientos.py). La recursión se hace con `yield*`, así
 * todos los eventos de las llamadas internas salen por el mismo generador.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.stooge que representa cada evento. */
const LINEA = Object.freeze({ COMPARAR: 5, INTERCAMBIAR: 6 });

export function* stoogeSort(arregloInicial) {
  const arr = [...arregloInicial];

  /** _stooge_sort_rec(arr, l, h) */
  function* stooge(l, h) {
    if (l >= h) return;

    yield crearEventoComparar(l, h, LINEA.COMPARAR);
    if (arr[l] > arr[h]) {
      yield crearEventoIntercambiar(l, h, LINEA.INTERCAMBIAR);
      [arr[l], arr[h]] = [arr[h], arr[l]];
    }

    if (h - l + 1 > 2) {
      const t = Math.floor((h - l + 1) / 3);
      yield* stooge(l, h - t);
      yield* stooge(l + t, h);
      yield* stooge(l, h - t);
    }
  }

  yield* stooge(0, arr.length - 1);
  yield crearEventoTerminado();
}
