/**
 * js/algoritmos/exchangeSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Exchange Sort como generador.
 *
 * Traducción de exchange_sort (docs/referencia/ordenamientos.py): compara la
 * posición i con cada j posterior e intercambia en cuanto arr[j] < arr[i].
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.exchange que representa cada evento. */
const LINEA = Object.freeze({ VUELTA: 4, COMPARAR: 6, INTERCAMBIAR: 7, FIN: 8 });

export function* exchangeSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      yield crearEventoComparar(j, i, LINEA.COMPARAR);

      if (arr[j] < arr[i]) {
        yield crearEventoIntercambiar(i, j, LINEA.INTERCAMBIAR);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Al terminar la vuelta, i tiene el menor de los restantes.
    yield crearEventoOrdenado(i, LINEA.VUELTA);
  }

  if (n > 0) {
    yield crearEventoOrdenado(n - 1, LINEA.FIN);
  }

  yield crearEventoTerminado();
}
