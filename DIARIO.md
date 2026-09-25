# DIARIO.md: Diario de actualizaciones

Explicación de cada cambio: qué se hizo, por qué y cómo se comprobó. La estructura y los contratos
están en [BLOQUES.md](BLOQUES.md); aquí va el razonamiento, para poder explicarlo en la revisión.
La entrada más reciente va arriba.

---

## 25/09/2026 · B06: Panel de código

**Archivo:** `js/ui/panelCodigo.js` (+ `.codigo__titulo` en CSS, montado en `main.js`).

**Qué hace.** `mostrar(id)` dibuja el Python de `ALGORITMOS[id].fuente`, una `<div>` por línea con
su número, y un título fijo "Merge Sort · Python". `resaltar(line)` pone la clase
`codigo__linea--activa` en la línea del evento actual.

**Decisiones.**
- Solo se toca el DOM cuando la línea cambia: a 2000 pasos/s la mayoría de los eventos repiten
  línea, así que no se hace trabajo de más.
- El panel se desplaza con `scrollTop` y no con `scrollIntoView`, porque este último también mueve la
  página y haría que la pantalla saltara durante la animación. Para medir la posición de la línea el
  panel tiene `position: relative` y se descuenta la altura del título fijo.
- Mientras B08 no conecte los controles, `main.js` muestra el código de Bubble Sort.

**Pruebas (65/65).** Además de mostrar, resaltar, desplazar y limpiar, hay una prueba para el
criterio de D-14 ("la línea resaltada corresponde a la operación"): ejecuta los 8 algoritmos y
comprueba que cada comparación apunte a una línea con `<` o `>`, cada intercambio a una línea
`arr[a], arr[b] = ...`, cada escritura a `arr[k] = ...` y cada pivote a `pivote = ...`.

---

## 25/09/2026 · B05: Reproductor y velocidad

**Archivo:** `js/motor/reproductor.js`.

**Qué hace.** Es el reloj de la animación. En cada cuadro de `requestAnimationFrame` calcula cuántos
pasos tocan y llama a `alAvanzar(n)`. No sabe qué es un paso: B08 y B09 deciden qué hacer con ellos
(pedir eventos al generador y dibujar una sola vez por cuadro).

**Acumulador.** `acumulado += dt × velocidad / 1000`; se ejecuta la parte entera y se guarda el
resto. Ejemplo: a 10 pasos/s y 60 cuadros/s, cada cuadro suma 0.167 y cada 6 cuadros toca un paso.
A 2000 pasos/s tocan ~33 por cuadro. Así no hace falta `setTimeout` y la velocidad es exacta.

**Protecciones.**
- Si la pestaña estuvo oculta, el siguiente cuadro llega tarde; se toman como máximo 100 ms por
  cuadro para no ejecutar de golpe miles de pasos atrasados.
- `MAX_PASOS_POR_CUADRO` (5000) evita congelar la página.

**Velocidad logarítmica.** El deslizador va de 0 a 100 y se convierte con
`pps = 1 × 2000^(t/100)`. Con una escala lineal casi todo el recorrido serían velocidades rápidas;
así la mitad del deslizador cubre de 1 a ~45 pasos/s, donde se sigue cada operación. El valor
inicial del HTML (39) corresponde a 20 pasos/s.

**Estados.** detenido → reproduciendo ⇄ pausado → terminado. `paso()` siempre deja en pausa.
Cuando `alAvanzar` devuelve false, pasa a terminado y ya no avanza hasta `detener()` (Reiniciar).

**Pruebas.** El navegador no ejecuta `requestAnimationFrame` si la pestaña está oculta, así que las
pruebas usan un reloj simulado: reemplazan `requestAnimationFrame` y `performance.now` y avanzan
cuadros a mano. Comprueban: el deslizador en los extremos, `paso()`, 10 y 2000 pasos exactos en 1 s,
que no avance tras pausar y el límite de 100 ms. 53/53 pruebas pasan.

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
