/**
 * js/benchmark/fieles.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 10 — Versiones fieles de la práctica para el benchmark.
 *
 * Traducción directa de docs/referencia/ordenamientos.py, SIN las mejoras
 * del visualizador y sin eventos: el benchmark mide los mismos algoritmos
 * que la práctica original (Bubble sin salida temprana, Selection que
 * intercambia siempre, Merge y Quick creando listas nuevas).
 *
 * Cada función recibe una lista y devuelve una lista NUEVA ordenada, igual
 * que `arr = lista.copy()` en Python. No importa nada del DOM: la usa el
 * Web Worker (worker.js).
 */

function selectionSort(lista) {
  const arr = [...lista];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

function bubbleSort(lista) {
  const arr = [...lista];
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}

function insertionSort(lista) {
  const arr = [...lista];
  for (let i = 1; i < arr.length; i++) {
    const clave = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > clave) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = clave;
  }
  return arr;
}

function gnomeSort(lista) {
  const arr = [...lista];
  const n = arr.length;
  let i = 0;
  while (i < n) {
    if (i === 0 || arr[i] >= arr[i - 1]) {
      i++;
    } else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      i--;
    }
  }
  return arr;
}

function exchangeSort(lista) {
  const arr = [...lista];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[i]) [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

function stoogeSortRec(arr, l, h) {
  if (l >= h) return;
  if (arr[l] > arr[h]) [arr[l], arr[h]] = [arr[h], arr[l]];
  if (h - l + 1 > 2) {
    const t = Math.floor((h - l + 1) / 3);
    stoogeSortRec(arr, l, h - t);
    stoogeSortRec(arr, l + t, h);
    stoogeSortRec(arr, l, h - t);
  }
}

function stoogeSort(lista) {
  const arr = [...lista];
  stoogeSortRec(arr, 0, arr.length - 1);
  return arr;
}

function mergeSortRec(arr) {
  if (arr.length <= 1) return;
  const mid = Math.floor(arr.length / 2);
  const izquierda = arr.slice(0, mid);
  const derecha = arr.slice(mid);

  mergeSortRec(izquierda);
  mergeSortRec(derecha);

  let i = 0;
  let j = 0;
  let k = 0;
  while (i < izquierda.length && j < derecha.length) {
    if (izquierda[i] < derecha[j]) arr[k++] = izquierda[i++];
    else arr[k++] = derecha[j++];
  }
  while (i < izquierda.length) arr[k++] = izquierda[i++];
  while (j < derecha.length) arr[k++] = derecha[j++];
}

function mergeSort(lista) {
  const arr = [...lista];
  mergeSortRec(arr);
  return arr;
}

function quickSort(lista) {
  const arr = [...lista];
  if (arr.length <= 1) return arr;
  const pivote = arr[Math.floor(arr.length / 2)];
  const izquierda = arr.filter((x) => x < pivote);
  const centro = arr.filter((x) => x === pivote);
  const derecha = arr.filter((x) => x > pivote);
  return [...quickSort(izquierda), ...centro, ...quickSort(derecha)];
}

/** Mismas claves y orden que ALGORITMOS (Bloque 03). */
export const FIELES = Object.freeze({
  selection: selectionSort,
  bubble: bubbleSort,
  insertion: insertionSort,
  gnome: gnomeSort,
  exchange: exchangeSort,
  stooge: stoogeSort,
  merge: mergeSort,
  quick: quickSort,
});
