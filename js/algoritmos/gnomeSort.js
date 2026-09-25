/**
 * js/algoritmos/gnomeSort.js
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* gnomeSort(arregloInicial) {
  const arr = [...arregloInicial];
  let index = 0;

  while (index < arr.length) {
    if (index === 0) {
      index++;
    }
    yield crearEventoComparar(index, index - 1, 0);
    
    if (arr[index] >= arr[index - 1]) {
      index++;
    } else {
      yield crearEventoIntercambiar(index, index - 1, 0);
      let temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      index--;
    }
  }

  for (let i = 0; i < arr.length; i++) {
    yield crearEventoOrdenado(i, 0);
  }
  yield crearEventoTerminado();
}