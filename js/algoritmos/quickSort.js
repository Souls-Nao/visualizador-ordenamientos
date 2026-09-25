/**
 * js/algoritmos/quickSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoPivote, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* quickSort(arregloInicial) {
  const arr = [...arregloInicial];

  function* partition(lo, hi) {
    let pivot = arr[hi];
    yield crearEventoPivote(hi, 0); // Marcamos el pivote
    
    let i = lo - 1;
    for (let j = lo; j <= hi - 1; j++) {
      yield crearEventoComparar(j, hi, 0);
      if (arr[j] < pivot) {
        i++;
        yield crearEventoIntercambiar(i, j, 0);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    yield crearEventoIntercambiar(i + 1, hi, 0);
    let temp = arr[i + 1];
    arr[i + 1] = arr[hi];
    arr[hi] = temp;
    
    yield crearEventoOrdenado(i + 1, 0);
    return i + 1;
  }

  function* sort(lo, hi) {
    if (lo < hi) {
      let pi = yield* partition(lo, hi);
      yield* sort(lo, pi - 1);
      yield* sort(pi + 1, hi);
    } else if (lo === hi) {
      yield crearEventoOrdenado(lo, 0);
    }
  }

  yield* sort(0, arr.length - 1);
  yield crearEventoTerminado();
}