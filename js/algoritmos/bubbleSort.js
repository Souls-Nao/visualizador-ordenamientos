/**
 * js/algoritmos/bubbleSort.js
 * 
 * Implementación de Bubble Sort como generador.
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* bubbleSort(arregloInicial) {
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let huboIntercambio = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield crearEventoComparar(j, j + 1, 4);

      if (arr[j] > arr[j + 1]) {
        yield crearEventoIntercambiar(j, j + 1, 5);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        huboIntercambio = true;
      }
    }

    // El elemento al final de la iteración actual está ordenado
    yield crearEventoOrdenado(n - i - 1, 8);

    if (!huboIntercambio) {
      // Si no hubo intercambios, los elementos restantes ya están ordenados
      for (let k = 0; k < n - i - 1; k++) {
        yield crearEventoOrdenado(k, 10);
      }
      break;
    }
  }

  yield crearEventoTerminado();
}