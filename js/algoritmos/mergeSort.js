/**
 * js/algoritmos/mergeSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoEscribir, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* mergeSort(arregloInicial) {
  const arr = [...arregloInicial];
  const temp = [...arregloInicial];

  function* merge(lo, mid, hi) {
    for (let k = lo; k <= hi; k++) {
      temp[k] = arr[k];
    }

    let i = lo;
    let j = mid + 1;

    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        yield crearEventoEscribir(k, temp[j], 0);
        arr[k] = temp[j++];
      } else if (j > hi) {
        yield crearEventoEscribir(k, temp[i], 0);
        arr[k] = temp[i++];
      } else {
        yield crearEventoComparar(i, j, 0); // Aproximación visual
        if (temp[j] < temp[i]) {
          yield crearEventoEscribir(k, temp[j], 0);
          arr[k] = temp[j++];
        } else {
          yield crearEventoEscribir(k, temp[i], 0);
          arr[k] = temp[i++];
        }
      }
    }
  }

  function* sort(lo, hi) {
    if (hi <= lo) return;
    const mid = lo + Math.floor((hi - lo) / 2);
    yield* sort(lo, mid);
    yield* sort(mid + 1, hi);
    yield* merge(lo, mid, hi);
  }

  yield* sort(0, arr.length - 1);

  for (let i = 0; i < arr.length; i++) {
    yield crearEventoOrdenado(i, 0);
  }
  yield crearEventoTerminado();
}