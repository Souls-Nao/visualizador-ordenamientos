/**
 * js/algoritmos/fuentesPython.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Código Python que se muestra en pantalla.
 *
 * El campo `line` de cada evento (Bloque 01) es el número de línea, contando
 * desde 1, dentro de la fuente de su algoritmo en este archivo. El panel de
 * código (Bloque 06) muestra estas líneas y resalta la del evento actual.
 *
 * Origen de cada fuente (docs/referencia/ordenamientos.py):
 * - Los 6 de fuerza bruta: copia exacta de las funciones originales.
 * - Merge Sort: la misma lógica del original, pero con índices lo/hi sobre
 *   un solo arreglo, para poder dibujarlo como una sola fila de barras
 *   (decisión 5.2 de la planeación). Divide en el mismo punto, compara con
 *   el mismo `<` y hace las mismas comparaciones y escrituras.
 * - Quick Sort: versión en el lugar. Conserva la idea del original (pivote
 *   al centro y tres grupos: menores, iguales y mayores), pero acomoda los
 *   grupos dentro del mismo arreglo en lugar de crear listas nuevas.
 *
 * Si se modifica una fuente, hay que revisar los números de línea del
 * generador correspondiente; test.html avisa si alguno queda fuera de rango.
 *
 * No importa nada de otros módulos del proyecto.
 */

/**
 * Convierte un bloque de texto en un arreglo de líneas, quitando el salto
 * de línea inicial que deja el template literal.
 *
 * @param {string} texto
 * @returns {readonly string[]}
 */
function lineas(texto) {
  return Object.freeze(texto.replace(/^\n/, '').replace(/\n$/, '').split('\n'));
}

/** @type {Readonly<Record<string, readonly string[]>>} */
export const FUENTES_PYTHON = Object.freeze({
  selection: lineas(`
def selection_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
`),

  bubble: lineas(`
def bubble_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n):
        for j in range(0, n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`),

  insertion: lineas(`
def insertion_sort(lista):
    arr = lista.copy()
    for i in range(1, len(arr)):
        clave = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > clave:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = clave
    return arr
`),

  gnome: lineas(`
def gnome_sort(lista):
    arr = lista.copy()
    i = 0
    n = len(arr)
    while i < n:
        if i == 0 or arr[i] >= arr[i - 1]:
            i += 1
        else:
            arr[i], arr[i - 1] = arr[i - 1], arr[i]
            i -= 1
    return arr
`),

  exchange: lineas(`
def exchange_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n - 1):
        for j in range(i + 1, n):
            if arr[j] < arr[i]:
                arr[i], arr[j] = arr[j], arr[i]
    return arr
`),

  stooge: lineas(`
def _stooge_sort_rec(arr, l, h):
    if l >= h:
        return

    if arr[l] > arr[h]:
        arr[l], arr[h] = arr[h], arr[l]

    if h - l + 1 > 2:
        t = (h - l + 1) // 3
        _stooge_sort_rec(arr, l, h - t)
        _stooge_sort_rec(arr, l + t, h)
        _stooge_sort_rec(arr, l, h - t)

def stooge_sort(lista):
    arr = lista.copy()
    _stooge_sort_rec(arr, 0, len(arr) - 1)
    return arr
`),

  merge: lineas(`
def _merge_sort_rec(arr, lo, hi):
    if hi - lo <= 1:
        return

    mid = lo + (hi - lo) // 2
    _merge_sort_rec(arr, lo, mid)
    _merge_sort_rec(arr, mid, hi)

    izquierda = arr[lo:mid]
    derecha = arr[mid:hi]

    i = j = 0
    k = lo
    while i < len(izquierda) and j < len(derecha):
        if izquierda[i] < derecha[j]:
            arr[k] = izquierda[i]
            i += 1
        else:
            arr[k] = derecha[j]
            j += 1
        k += 1

    while i < len(izquierda):
        arr[k] = izquierda[i]
        i += 1
        k += 1

    while j < len(derecha):
        arr[k] = derecha[j]
        j += 1
        k += 1

def merge_sort(lista):
    arr = lista.copy()
    _merge_sort_rec(arr, 0, len(arr))
    return arr
`),

  quick: lineas(`
def _quick_sort_rec(arr, lo, hi):
    if hi - lo <= 1:
        return

    pivote = arr[lo + (hi - lo) // 2]
    menor, i, mayor = lo, lo, hi
    while i < mayor:
        if arr[i] < pivote:
            arr[menor], arr[i] = arr[i], arr[menor]
            menor += 1
            i += 1
        elif arr[i] > pivote:
            mayor -= 1
            arr[i], arr[mayor] = arr[mayor], arr[i]
        else:
            i += 1

    _quick_sort_rec(arr, lo, menor)
    _quick_sort_rec(arr, mayor, hi)

def quick_sort(lista):
    arr = lista.copy()
    _quick_sort_rec(arr, 0, len(arr))
    return arr
`),
});
