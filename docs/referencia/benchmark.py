import random
import time
 
import matplotlib.pyplot as plt
 
from ordenamientos import (
    selection_sort,
    bubble_sort,
    insertion_sort,
    gnome_sort,
    exchange_sort,
    stooge_sort,
    merge_sort,
    quick_sort,
)
 
ALGORITMOS_FUERZA_BRUTA = {
    "Selection Sort": selection_sort,
    "Bubble Sort": bubble_sort,
    "Insertion Sort": insertion_sort,
    "Gnome Sort": gnome_sort,
    "Exchange Sort": exchange_sort,
    "Stooge Sort": stooge_sort,
}
 
ALGORITMOS_DIVIDE_VENCERAS = {
    "Merge Sort": merge_sort,
    "Quick Sort": quick_sort,
}
 
ALGORITMOS = {**ALGORITMOS_FUERZA_BRUTA, **ALGORITMOS_DIVIDE_VENCERAS}
 
ALGORITMOS_FUERZA_BRUTA_SIN_STOOGE = {
    nombre: funcion
    for nombre, funcion in ALGORITMOS_FUERZA_BRUTA.items()
    if nombre != "Stooge Sort"
}
 
COLORES = {
    "Selection Sort": "tab:blue",
    "Bubble Sort": "tab:orange",
    "Insertion Sort": "tab:brown",
    "Gnome Sort": "tab:red",
    "Exchange Sort": "tab:purple",
    "Stooge Sort": "tab:gray",
    "Merge Sort": "tab:green",
    "Quick Sort": "tab:cyan",
}
 
def generar_lista(n, minimo, maximo):
    temp = []
    for i in range(n):
        temp.append(random.randint(minimo, maximo))
    return temp
 
def calcular_tiempos(inicio, incremento, fin):
    tamanios = []
    tiempos = {nombre: [] for nombre in ALGORITMOS}
 
    n = inicio
    while n <= fin:
        lista_base = generar_lista(n, 0, 10000)
 
        for nombre, funcion in ALGORITMOS.items():
            copia = lista_base.copy()
            t_inicio = time.perf_counter()
            funcion(copia)
            t_fin = time.perf_counter()
            tiempos[nombre].append(t_fin - t_inicio)
 
        tamanios.append(n)
        n += incremento
 
    return tamanios, tiempos
 
def graficar_stooge(tamanios, tiempos):
    plt.figure()
    plt.plot(tamanios, tiempos["Stooge Sort"], marker="o", color=COLORES["Stooge Sort"], label="Stooge Sort")
    plt.title("Stooge Sort (solo)")
    plt.xlabel("Tamanio de entrada n")
    plt.ylabel("Tiempo de ejecucion (s)")
    plt.legend()
    plt.grid()
 
def graficar_todos(tamanios, tiempos):
    plt.figure()
    for nombre in ALGORITMOS_FUERZA_BRUTA_SIN_STOOGE:
        plt.plot(tamanios, tiempos[nombre], marker="o", color=COLORES[nombre], label=nombre)
 
    plt.title("Comparacion de Algoritmos de Ordenamiento (Fuerza Bruta)")
    plt.xlabel("Tamanio de entrada n")
    plt.ylabel("Tiempo de ejecucion (s)")
    plt.legend()
    plt.grid()
 
def graficar_comparacion_merge(tamanios, tiempos):
    plt.figure()
    for nombre in ALGORITMOS_FUERZA_BRUTA_SIN_STOOGE:
        plt.plot(tamanios, tiempos[nombre], marker="o", color=COLORES[nombre], label=nombre)
    plt.plot(tamanios, tiempos["Merge Sort"], marker="o", color=COLORES["Merge Sort"], linewidth=2, label="Merge Sort")
 
    plt.title("Fuerza Bruta vs Merge Sort")
    plt.xlabel("Tamanio de entrada n")
    plt.ylabel("Tiempo de ejecucion (s)")
    plt.legend()
    plt.grid()
 
def graficar_comparacion_quick(tamanios, tiempos):
    plt.figure()
    for nombre in ALGORITMOS_FUERZA_BRUTA_SIN_STOOGE:
        plt.plot(tamanios, tiempos[nombre], marker="o", color=COLORES[nombre], label=nombre)
    plt.plot(tamanios, tiempos["Quick Sort"], marker="o", color=COLORES["Quick Sort"], linewidth=2, label="Quick Sort")
 
    plt.title("Fuerza Bruta vs Quick Sort")
    plt.xlabel("Tamanio de entrada n")
    plt.ylabel("Tiempo de ejecucion (s)")
    plt.legend()
    plt.grid()
 
def graficar(tamanios, tiempos):
    graficar_stooge(tamanios, tiempos)
    graficar_todos(tamanios, tiempos)
    graficar_comparacion_merge(tamanios, tiempos)
    graficar_comparacion_quick(tamanios, tiempos)
    plt.show()