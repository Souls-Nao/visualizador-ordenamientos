# DIARIO.md: Diario de actualizaciones

Explicación de cada cambio: qué se hizo, por qué y cómo se comprobó. La estructura y los contratos
están en [BLOQUES.md](BLOQUES.md); aquí va el razonamiento, para poder explicarlo en la revisión.
La entrada más reciente va arriba.

---

## 25/09/2026 · B04: Render (espejo y barras en canvas)

**Archivos:** `js/render/espejo.js`, `js/render/canvasBarras.js`, `test.html`.

**Espejo (`espejo.js`).** Los eventos solo traen índices, no el arreglo, así que quien dibuja
mantiene una copia propia: el espejo. `aplicarEvento(espejo, evento)` hace dos cosas:
1. Actualiza los valores: `swap` intercambia dos posiciones y `write` escribe un valor.
2. Calcula el color de cada barra en `estados[]`.

Reglas de color y por qué:
- Amarillo (comparando) y rojo (intercambio) duran **un paso**; al siguiente evento esas barras
  vuelven a su color base. Para no recorrer todo el arreglo en cada evento, el espejo guarda en
  `marcados` qué posiciones pintó el evento anterior y solo restaura esas. Así el costo no depende
  del tamaño de la lista, lo que importa cuando se ejecutan miles de pasos por segundo en 8 paneles.
- Verde (`ordenado`) es permanente: se guarda en el conjunto `ordenados`.
- Morado (pivote) dura toda la partición de Quick Sort. Como en Quick el pivote participa en casi
  todas las comparaciones, si se pintara de amarillo el morado casi no se vería; por eso conserva su
  color al compararse. Si un `swap` mueve el pivote, el espejo lo sigue a su nueva posición.
- `done` pinta todo de verde. Por eso Insertion, Gnome, Stooge y Merge no necesitan emitir `sorted`.

**Canvas (`canvasBarras.js`).**
- `COLORES` es la única fuente de los 5 colores; la leyenda (B08) se generará desde ahí y desde
  `NOMBRES_ESTADO`.
- La altura de cada barra es `valor / máximo de la lista × alto del canvas`. Se usa el máximo de la
  lista y no 10000 para que, con listas pequeñas, las barras ocupen todo el alto.
- `ResizeObserver` ajusta el canvas cuando cambia su tamaño en pantalla, y `devicePixelRatio` evita
  que se vea borroso en pantallas de alta densidad.

**Pruebas.** `test.html` ya no tiene su propio espejo: usa `crearEspejo` y `aplicarEvento`, y exige
que al final todas las barras estén en verde. 48/48 pruebas pasan. El canvas se probó a mano
dibujando Quick Sort a medio camino (se ven azul, amarillo, rojo, morado y verde).

---

## 25/09/2026 · B03: mejoras para el visualizador

La práctica de Python es la base; en JS se cambió solo lo que mejora el visualizador:
- **Selection:** intercambia solo si `min_idx != i` (sin intercambios de una barra consigo misma).
- **Bubble:** recorre hasta `n - 1 - i` y termina si una pasada no intercambia.
- **Merge:** `<=` en lugar de `<`, para que sea estable.

El código Python que se ve en pantalla (`fuentesPython.js`) incluye esos cambios.
`docs/referencia/conteos.py` ejecuta ese mismo Python y cuenta comparaciones y escrituras;
`test.html` exige que el JS dé exactamente los mismos números en los 8 algoritmos. El benchmark (B10)
usará las funciones originales de la práctica.

---

## 25/09/2026 · B03: generadores traducidos y líneas de código

- Los 8 generadores se reescribieron siguiendo `ordenamientos.py`.
- Se creó `fuentesPython.js` (planeado para B06) porque sin él no se podían fijar los números de
  línea. Cada generador define `const LINEA = {...}` con las líneas que usa.
- Merge usa índices `lo`/`hi` sobre un solo arreglo y Quick es en el lugar, con pivote al centro y
  tres grupos, porque las versiones originales crean listas nuevas y no se pueden dibujar como una
  sola fila de barras.
- Errores corregidos: Gnome se ciclaba con n = 1 y Exchange marcaba la posición -1 con la lista vacía.

---

## 25/09/2026 · B00: base, maqueta y publicación

- `index.html` con todos los IDs del contrato (BLOQUES.md 3.3), tres CSS con tema claro y oscuro, y
  navegación por pestañas que guarda la sección en la dirección (`#benchmark`).
- `config.js` concentra los límites de la interfaz.
- Se borró `-Nao main --rebase`, un volcado de `git config` subido por error.
- Publicado en GitHub Pages desde `main` / raíz.
