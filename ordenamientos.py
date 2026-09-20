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

def bubble_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n):
        for j in range(0, n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

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

def exchange_sort(lista):
    arr = lista.copy()
    n = len(arr)
    for i in range(n - 1):
        for j in range(i + 1, n):
            if arr[j] < arr[i]:
                arr[i], arr[j] = arr[j], arr[i]
    return arr

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

#Nuevo algoritmo para comparar

def _merge_sort_rec(arr):
    if len(arr) <= 1:
        return

    mid = len(arr) // 2
    izquierda = arr[:mid]
    derecha = arr[mid:]

    _merge_sort_rec(izquierda)
    _merge_sort_rec(derecha)

    i = j = k = 0
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
    _merge_sort_rec(arr)
    return arr

#Nuevo algoritmo para comparar

def quick_sort(lista):
    arr = lista.copy()
    if len(arr) <= 1:
        return arr

    pivote = arr[len(arr) // 2]
    izquierda = [x for x in arr if x < pivote]
    centro = [x for x in arr if x == pivote]
    derecha = [x for x in arr if x > pivote]

    return quick_sort(izquierda) + centro + quick_sort(derecha)
