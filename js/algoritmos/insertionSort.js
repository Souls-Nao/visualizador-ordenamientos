/**
 * js/algoritmos/insertionSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoEscribir, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* insertionSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      yield crearEventoComparar(j, j + 1, 0); // 0 como placeholder de línea
      if (arr[j] > key) {
        yield crearEventoEscribir(j + 1, arr[j], 0);
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }
    yield crearEventoEscribir(j + 1, key, 0);
    arr[j + 1] = key;
  }

  // Al final, marcamos todo como ordenado
  for (let k = 0; k < n; k++) {
    yield crearEventoOrdenado(k, 0);
  }
  
  yield crearEventoTerminado();
}