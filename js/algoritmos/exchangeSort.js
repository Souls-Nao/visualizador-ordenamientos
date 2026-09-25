/**
 * js/algoritmos/exchangeSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* exchangeSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      yield crearEventoComparar(i, j, 0);
      if (arr[i] > arr[j]) {
        yield crearEventoIntercambiar(i, j, 0);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    yield crearEventoOrdenado(i, 0);
  }
  yield crearEventoOrdenado(n - 1, 0);
  yield crearEventoTerminado();
}