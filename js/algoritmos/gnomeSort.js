/**
 * js/algoritmos/gnomeSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Gnome Sort como generador.
 *
 * Traducción de gnome_sort (docs/referencia/ordenamientos.py). La condición
 * `if i == 0 or arr[i] >= arr[i - 1]` se evalúa en cortocircuito: cuando
 * i == 0 no hay comparación entre elementos, solo se avanza.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.gnome que representa cada evento. */
const LINEA = Object.freeze({ COMPARAR: 6, INTERCAMBIAR: 9 });

export function* gnomeSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;
  let i = 0;

  while (i < n) {
    if (i === 0) {
      i++;
      continue;
    }

    yield crearEventoComparar(i, i - 1, LINEA.COMPARAR);

    if (arr[i] >= arr[i - 1]) {
      i++;
    } else {
      yield crearEventoIntercambiar(i, i - 1, LINEA.INTERCAMBIAR);
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      i--;
    }
  }

  yield crearEventoTerminado();
}
