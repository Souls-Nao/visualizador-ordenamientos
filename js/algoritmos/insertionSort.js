/**
 * js/algoritmos/insertionSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Insertion Sort como generador.
 *
 * Traducción de insertion_sort (docs/referencia/ordenamientos.py). Igual que
 * el original, desplaza con escrituras (arr[j + 1] = arr[j]) y al final
 * escribe la clave en su hueco. Durante el desplazamiento la barra se ve
 * duplicada, tal como ocurre en el arreglo de Python.
 *
 * No emite `sorted`: en Insertion Sort ninguna posición es definitiva hasta
 * el final, y el evento `done` marca todo como ordenado (Bloque 04).
 */
import {
  crearEventoComparar,
  crearEventoEscribir,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.insertion que representa cada evento. */
const LINEA = Object.freeze({ COMPARAR: 6, DESPLAZAR: 7, INSERTAR: 9 });

export function* insertionSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const clave = arr[i];
    let j = i - 1;

    // while j >= 0 and arr[j] > clave: la comparación solo ocurre si j >= 0.
    while (j >= 0) {
      // j + 1 es el hueco donde está (o estará) la clave.
      yield crearEventoComparar(j, j + 1, LINEA.COMPARAR);
      if (!(arr[j] > clave)) break;

      yield crearEventoEscribir(j + 1, arr[j], LINEA.DESPLAZAR);
      arr[j + 1] = arr[j];
      j--;
    }

    yield crearEventoEscribir(j + 1, clave, LINEA.INSERTAR);
    arr[j + 1] = clave;
  }

  yield crearEventoTerminado();
}
