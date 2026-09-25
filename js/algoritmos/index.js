/**
 * js/algoritmos/index.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Registro central de los algoritmos.
 *
 * Es el único punto por el que el resto de la aplicación obtiene un
 * algoritmo: ningún otro módulo importa directamente bubbleSort.js,
 * quickSort.js, etc. El orden de las claves es el orden en que se muestran
 * en la interfaz (el mismo de benchmark.py).
 *
 * Cada entrada tiene:
 *   nombre       nombre para mostrar (requisito 7 de la actividad)
 *   generador    function* que emite los eventos del Bloque 01
 *   fuente       líneas de Python que se muestran en pantalla (Bloque 06)
 *   categoria    'fuerza-bruta' | 'divide-y-venceras'
 *   mejor, promedio, peor   complejidad temporal (requisito 8)
 *   espacio      espacio adicional de la versión que se anima
 *   estable      'Sí' | 'No', según la implementación de este proyecto
 *   descripcion  una frase para la ficha del algoritmo
 */
import { selectionSort } from './selectionSort.js';
import { bubbleSort } from './bubbleSort.js';
import { insertionSort } from './insertionSort.js';
import { gnomeSort } from './gnomeSort.js';
import { exchangeSort } from './exchangeSort.js';
import { stoogeSort } from './stoogeSort.js';
import { mergeSort } from './mergeSort.js';
import { quickSort } from './quickSort.js';
import { FUENTES_PYTHON } from './fuentesPython.js';

export const ALGORITMOS = Object.freeze({
  selection: {
    nombre: 'Selection Sort', generador: selectionSort, fuente: FUENTES_PYTHON.selection,
    categoria: 'fuerza-bruta',
    mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'No',
    descripcion: 'Busca el mínimo de la parte sin ordenar y lo intercambia con la primera posición de esa parte.',
  },
  bubble: {
    nombre: 'Bubble Sort', generador: bubbleSort, fuente: FUENTES_PYTHON.bubble,
    categoria: 'fuerza-bruta',
    // Sin salida temprana (como el original): siempre hace n pasadas.
    mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí',
    descripcion: 'Recorre la lista comparando vecinos e intercambiándolos si están en desorden; cada pasada lleva el mayor al final.',
  },
  insertion: {
    nombre: 'Insertion Sort', generador: insertionSort, fuente: FUENTES_PYTHON.insertion,
    categoria: 'fuerza-bruta',
    mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí',
    descripcion: 'Toma cada elemento y lo inserta en su lugar dentro de la parte ya ordenada, desplazando los mayores.',
  },
  gnome: {
    nombre: 'Gnome Sort', generador: gnomeSort, fuente: FUENTES_PYTHON.gnome,
    categoria: 'fuerza-bruta',
    mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'Sí',
    descripcion: 'Avanza mientras el par actual está en orden; si no, lo intercambia y retrocede un paso.',
  },
  exchange: {
    nombre: 'Exchange Sort', generador: exchangeSort, fuente: FUENTES_PYTHON.exchange,
    categoria: 'fuerza-bruta',
    mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)',
    espacio: 'O(1)', estable: 'No',
    descripcion: 'Compara cada posición con todas las siguientes e intercambia en cuanto encuentra un valor menor.',
  },
  stooge: {
    nombre: 'Stooge Sort', generador: stoogeSort, fuente: FUENTES_PYTHON.stooge,
    categoria: 'fuerza-bruta',
    mejor: 'O(n^2.71)', promedio: 'O(n^2.71)', peor: 'O(n^2.71)',
    // La recursión reduce el tramo a 2/3 en cada nivel: profundidad O(log n).
    espacio: 'O(log n)', estable: 'No',
    descripcion: 'Ordena recursivamente los primeros 2/3, luego los últimos 2/3 y otra vez los primeros 2/3.',
  },
  merge: {
    nombre: 'Merge Sort', generador: mergeSort, fuente: FUENTES_PYTHON.merge,
    categoria: 'divide-y-venceras',
    mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n log n)',
    // El original compara con `<`: ante un empate toma el de la derecha
    // primero, así que esta implementación no conserva el orden de los iguales.
    espacio: 'O(n)', estable: 'No',
    descripcion: 'Divide la lista en mitades, ordena cada una y las mezcla tomando siempre el menor de los dos frentes.',
  },
  quick: {
    nombre: 'Quick Sort', generador: quickSort, fuente: FUENTES_PYTHON.quick,
    categoria: 'divide-y-venceras',
    mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)',
    espacio: 'O(log n)', estable: 'No',
    descripcion: 'Toma el pivote del centro, separa menores, iguales y mayores, y ordena recursivamente los menores y los mayores.',
  },
});
