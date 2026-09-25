"""
Conteos de referencia para test.html (Bloque 03).

Lee el código Python que muestra la página (js/algoritmos/fuentesPython.js),
lo ejecuta tal cual y cuenta, para cada algoritmo y cada lista de prueba:
  - comparaciones: veces que se comparan dos elementos de la lista;
  - escrituras: veces que se asigna una posición del arreglo
    (un intercambio a, b = b, a cuenta como 2 escrituras).

test.html comprueba que los generadores de JavaScript hacen exactamente las
mismas comparaciones y escrituras. Si se cambia una fuente, se vuelve a
correr este script y se copian los resultados a CONTEOS_PYTHON en test.html.

Uso (desde la raíz del repositorio):  python docs/referencia/conteos.py
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FUENTES = RAIZ / "js" / "algoritmos" / "fuentesPython.js"

LISTAS = {
    "invertida5": [5, 4, 3, 2, 1],
    "ordenada10": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "duplicados10": [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    "aleatoria30": [15, 40, 64, 65, 82, 13, 28, 76, 79, 71, 53, 100, 73, 70, 93,
                    99, 98, 62, 96, 98, 75, 56, 30, 0, 78, 10, 14, 36, 12, 57],
}

contador = {"comparaciones": 0, "escrituras": 0}


class Valor:
    """Envuelve un número y cuenta cada vez que se compara con otro."""

    def __init__(self, v):
        self.v = v

    def _cmp(self, otro, op):
        contador["comparaciones"] += 1
        return op(self.v, otro.v)

    def __lt__(self, o): return self._cmp(o, lambda a, b: a < b)
    def __le__(self, o): return self._cmp(o, lambda a, b: a <= b)
    def __gt__(self, o): return self._cmp(o, lambda a, b: a > b)
    def __ge__(self, o): return self._cmp(o, lambda a, b: a >= b)


class Lista(list):
    """Lista que cuenta las escrituras en sus posiciones."""

    def __setitem__(self, i, v):
        contador["escrituras"] += 1
        super().__setitem__(i, v)

    def copy(self):
        return Lista(self)


def cargar_fuentes():
    texto = FUENTES.read_text(encoding="utf-8")
    return dict(re.findall(r"(\w+): lineas\(`\n(.*?)\n`\)", texto, re.S))


def main():
    resultado = {}
    for id_, codigo in cargar_fuentes().items():
        espacio = {}
        exec(codigo, espacio)
        # La función pública es la última `def ...(lista):` de la fuente.
        nombre = re.findall(r"def (\w+)\(lista\):", codigo)[-1]
        funcion = espacio[nombre]

        resultado[id_] = {}
        for nombre_lista, lista in LISTAS.items():
            contador.update(comparaciones=0, escrituras=0)
            salida = funcion(Lista(Valor(v) for v in lista))
            conteo = [contador["comparaciones"], contador["escrituras"]]
            assert [x.v for x in salida] == sorted(lista), (id_, nombre_lista)
            resultado[id_][nombre_lista] = conteo

    print("const LISTAS_PYTHON =", json.dumps(LISTAS) + ";")
    print("const CONTEOS_PYTHON = {")
    for id_, conteos in resultado.items():
        print(f"  {id_}: {json.dumps(conteos)},")
    print("};")


if __name__ == "__main__":
    main()
