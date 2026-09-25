/**
 * js/algoritmos/mergeSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Merge Sort como generador.
 *
 * El original (_merge_sort_rec en docs/referencia/ordenamientos.py) crea
 * sublistas nuevas en cada llamada, lo que no puede dibujarse como una sola
 * fila de barras. Esta versión trabaja con índices lo/hi (hi excluido) sobre
 * un solo arreglo, conservando todo lo demás:
 * - divide en el mismo punto: mid - lo = (hi - lo) // 2 = len(arr) // 2;
 * - copia las dos mitades (izquierda, derecha) antes de mezclar;
 * - compara con el mismo `<`, así que hace las mismas comparaciones y
 *   escrituras que el original.
 *
 * El código que se muestra en pantalla es esta misma versión, escrita en
 * Python (FUENTES_PYTHON.merge).
 *
 * Nota visual: al comparar se resaltan las posiciones de donde salieron
 * izquierda[i] y derecha[j] (lo + i y mid + j). La de la izquierda puede ya
 * estar sobrescrita en el arreglo, porque el valor real está en la copia.
 */
import {
  crearEventoComparar,
  crearEventoEscribir,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.merge que representa cada evento. */
const LINEA = Object.freeze({
  COMPARAR: 15,
  ESCRIBIR_IZQUIERDA: 16,
  ESCRIBIR_DERECHA: 19,
  RESTO_IZQUIERDA: 24,
  RESTO_DERECHA: 29,
});

export function* mergeSort(arregloInicial) {
  const arr = [...arregloInicial];

  /** _merge_sort_rec(arr, lo, hi) */
  function* ordenar(lo, hi) {
    if (hi - lo <= 1) return;

    const mid = lo + Math.floor((hi - lo) / 2);
    yield* ordenar(lo, mid);
    yield* ordenar(mid, hi);

    const izquierda = arr.slice(lo, mid);
    const derecha = arr.slice(mid, hi);

    let i = 0;
    let j = 0;
    let k = lo;

    while (i < izquierda.length && j < derecha.length) {
      yield crearEventoComparar(lo + i, mid + j, LINEA.COMPARAR);

      if (izquierda[i] < derecha[j]) {
        yield crearEventoEscribir(k, izquierda[i], LINEA.ESCRIBIR_IZQUIERDA);
        arr[k] = izquierda[i];
        i++;
      } else {
        yield crearEventoEscribir(k, derecha[j], LINEA.ESCRIBIR_DERECHA);
        arr[k] = derecha[j];
        j++;
      }
      k++;
    }

    while (i < izquierda.length) {
      yield crearEventoEscribir(k, izquierda[i], LINEA.RESTO_IZQUIERDA);
      arr[k] = izquierda[i];
      i++;
      k++;
    }

    while (j < derecha.length) {
      yield crearEventoEscribir(k, derecha[j], LINEA.RESTO_DERECHA);
      arr[k] = derecha[j];
      j++;
      k++;
    }
  }

  yield* ordenar(0, arr.length);
  yield crearEventoTerminado();
}
