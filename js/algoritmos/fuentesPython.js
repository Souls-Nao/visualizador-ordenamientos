/**
 * js/algoritmos/fuentesPython.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Código Python que se muestra en pantalla.
 *
 * El campo `line` de cada evento (Bloque 01) es el número de línea, contando
 * desde 1, dentro de la fuente de su algoritmo en este archivo. El panel de
 * código (Bloque 06) muestra estas líneas y resalta la del evento actual.
 *
 * Las fuentes parten de la práctica (docs/referencia/ordenamientos.py), con
 * los cambios necesarios para este visualizador:
 * - Insertion, Gnome, Exchange y Stooge: igual que el original.
 * - Selection: solo intercambia si el mínimo no está ya en su lugar.
 * - Bubble: cada pasada recorre solo la parte sin ordenar y termina antes
 *   si una pasada no hizo intercambios.
 * - Merge: índices lo/hi sobre un solo arreglo, para dibujarlo como una
 *   sola fila de barras (decisión 5.2 de la planeación), y `<=` para que
 *   sea estable.
 * - Quick: versión en el lugar. Conserva la idea del original (pivote al
 *   centro y tres grupos: menores, iguales y mayores), pero acomoda los
 *   grupos dentro del mismo arreglo en lugar de crear listas nuevas.
 *
 * Los generadores JS son la traducción exacta de estas fuentes:
 * docs/referencia/conteos.py ejecuta este mismo código Python y test.html
 * comprueba que el JS hace las mismas comparaciones y escrituras. Si se
 * modifica una fuente, hay que actualizar su generador y volver a correr
 * ese script.
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
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
`),

  bubble: lineas(`
def bubble_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n - 1):
        hubo_intercambio = False
        for j in range(0, n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                hubo_intercambio = True
        if not hubo_intercambio:
            break
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
        if izquierda[i] <= derecha[j]:
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
