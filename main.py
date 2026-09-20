import tkinter as tk
from tkinter import messagebox

from benchmark import calcular_tiempos, graficar

def al_presionar_calcular():
    try:
        inicio = int(entrada_inicio.get())
        incremento = int(entrada_incremento.get())
        fin = int(entrada_fin.get())
    except ValueError:
        messagebox.showerror("Error", "Ingresa solo numeros enteros.")
        return

    if incremento <= 0 or inicio > fin:
        messagebox.showerror("Error", "Verifica los valores ingresados.")
        return

    tamanios, tiempos = calcular_tiempos(inicio, incremento, fin)
    graficar(tamanios, tiempos)

ventana = tk.Tk()
ventana.title("Comparacion de Algoritmos de Ordenamiento")

contenedor = tk.Frame(ventana, padx=25, pady=25)
contenedor.grid(row=0, column=0)

tk.Label(contenedor, text="Inicio").grid(row=0, column=0, sticky="w", padx=(0, 15), pady=10)
entrada_inicio = tk.Entry(contenedor)
entrada_inicio.grid(row=0, column=1, pady=10)

tk.Label(contenedor, text="Incremento").grid(row=1, column=0, sticky="w", padx=(0, 15), pady=10)
entrada_incremento = tk.Entry(contenedor)
entrada_incremento.grid(row=1, column=1, pady=10)

tk.Label(contenedor, text="Fin").grid(row=2, column=0, sticky="w", padx=(0, 15), pady=10)
entrada_fin = tk.Entry(contenedor)
entrada_fin.grid(row=2, column=1, pady=10)

tk.Button(
    contenedor, text="Calcular y graficar", command=al_presionar_calcular
).grid(row=3, column=0, columnspan=2, pady=(15, 0))

ventana.mainloop()
