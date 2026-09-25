/**
 * js/algoritmos/stoogeSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* stoogeSort(arregloInicial) {
  const arr = [...arregloInicial];

  function* stooge(l, h) {
    if (l >= h) return;

    yield crearEventoComparar(l, h, 0);
    if (arr[l] > arr[h]) {
      yield crearEventoIntercambiar(l, h, 0);
      let temp = arr[l];
      arr[l] = arr[h];
      arr[h] = temp;
    }

    if (h - l + 1 > 2) {
      let t = Math.floor((h - l + 1) / 3);
      yield* stooge(l, h - t);
      yield* stooge(l + t, h);
      yield* stooge(l, h - t);
    }
  }

  yield* stooge(0, arr.length - 1);
  
  for (let i = 0; i < arr.length; i++) {
    yield crearEventoOrdenado(i, 0);
  }
  yield crearEventoTerminado();
}