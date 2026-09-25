/**
 * js/algoritmos/selectionSort.js
 * 
 * Implementación de Selection Sort como generador.
 */
import { 
  crearEventoComparar, 
  crearEventoIntercambiar, 
  crearEventoOrdenado, 
  crearEventoTerminado 
} from '../core/eventos.js';

export function* selectionSort(arregloInicial) {
  // Trabajamos sobre una copia local según el contrato del Bloque 03.
  const arr = [...arregloInicial];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // Línea ficticia 4 para la comparación (se ajustará con fuentesPython.js en Bloque 06)
      yield crearEventoComparar(j, minIdx, 4); 
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      // Línea ficticia 7 para el intercambio
      yield crearEventoIntercambiar(i, minIdx, 7);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // El elemento en 'i' ya está en su posición definitiva
    yield crearEventoOrdenado(i, 9);
  }

  yield crearEventoTerminado();
}