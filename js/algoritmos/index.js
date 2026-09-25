/**
 * js/algoritmos/index.js
 * 
 * Registro central de los algoritmos de ordenamiento disponibles en la aplicación.
 */
/**
 * js/algoritmos/index.js
 */
import { selectionSort } from './selectionSort.js';
import { bubbleSort } from './bubbleSort.js';
import { insertionSort } from './insertionSort.js';
import { gnomeSort } from './gnomeSort.js';
import { exchangeSort } from './exchangeSort.js';
import { stoogeSort } from './stoogeSort.js';
import { mergeSort } from './mergeSort.js';
import { quickSort } from './quickSort.js';

export const ALGORITMOS = {
  selection: {
    nombre: 'Selection Sort', generador: selectionSort,
    mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'No', descripcion: 'Busca el mínimo y lo coloca al inicio.'
  },
  bubble: {
    nombre: 'Bubble Sort', generador: bubbleSort,
    mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí', descripcion: 'Compara e intercambia elementos adyacentes.'
  },
  insertion: {
    nombre: 'Insertion Sort', generador: insertionSort,
    mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí', descripcion: 'Inserta cada elemento en su posición correcta.'
  },
  gnome: {
    nombre: 'Gnome Sort', generador: gnomeSort,
    mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí', descripcion: 'Avanza si está ordenado, retrocede intercambiando si no.'
  },
  exchange: {
    nombre: 'Exchange Sort', generador: exchangeSort,
    mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'No', descripcion: 'Compara cada elemento con todos los siguientes.'
  },
  stooge: {
    nombre: 'Stooge Sort', generador: stoogeSort,
    mejor: 'O(n^2.709)', promedio: 'O(n^2.709)', peor: 'O(n^2.709)',
    espacio: 'O(n)', estable: 'No', descripcion: 'Algoritmo recursivo ineficiente pero didáctico.'
  },
  merge: {
    nombre: 'Merge Sort', generador: mergeSort,
    mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n log n)',
    espacio: 'O(n)', estable: 'Sí', descripcion: 'Divide en mitades, ordena y combina.'
  },
  quick: {
    nombre: 'Quick Sort', generador: quickSort,
    mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)',
    espacio: 'O(log n)', estable: 'No', descripcion: 'Elige un pivote y particiona los elementos (in-place).'
  }
};