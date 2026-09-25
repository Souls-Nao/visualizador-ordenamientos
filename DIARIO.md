# DIARIO.md: Diario de actualizaciones

Explicación de cada cambio: qué se hizo, por qué y cómo se comprobó. La estructura y los contratos
están en [BLOQUES.md](BLOQUES.md); aquí va el razonamiento, para poder explicarlo en la revisión.
La entrada más reciente va arriba.

---

## 25/09/2026 · B10: Benchmark (medición)

**Archivos:** `js/benchmark/fieles.js`, `worker.js`, `benchmark.js`.

**Versiones fieles.** El visualizador usa algoritmos mejorados y con eventos; el benchmark mide la
práctica tal cual. `fieles.js` es la traducción directa de `ordenamientos.py`: Bubble sin salida
temprana, Selection que intercambia siempre, Merge con sublistas y Quick con tres listas nuevas
(`filter`). Son funciones normales, sin generadores, para que el tiempo medido sea solo el del
algoritmo.

**Web Worker.** Medir listas grandes puede tardar segundos; en el hilo principal la página se
congelaría. `worker.js` corre en otro hilo y se comunica por mensajes: recibe la configuración y
envía el progreso después de cada medición y los resultados al final. Cancelar es simplemente
`worker.terminate()`.

**Cómo se mide** (pregunta típica: "¿dónde se calcula el tiempo?", respuesta: `medirUnaVez` en
`worker.js`):
- Igual que `calcular_tiempos`: una lista por tamaño y cada algoritmo ordena una copia.
- Una ejecución de calentamiento que se descarta: el motor de JavaScript optimiza las funciones
  después de las primeras llamadas y la primera sería injustamente lenta.
- Varias repeticiones con `performance.now()` y se guarda la **mediana**, que no se altera por una
  medición suelta más lenta.
- Stooge se omite con más de 500 elementos (tardaría minutos) y se avisa.

**Validación.** Las reglas de `main.py` (enteros, incremento > 0, inicio ≤ fin) más límites de la
página: inicio ≥ 1, 1 a 20 repeticiones y como máximo 100 tamaños.

**Pruebas (75/75).** Las 8 versiones fieles ordenan las 27 listas; 7 casos de validación; y el
Worker real mide 3 tamaños × 8 algoritmos con 24 mensajes de progreso. En la página, de 100 a 500
tardó 1 s sin congelar la interfaz, y Cancelar detuvo una medición de 1000 a 10000.

---

## 25/09/2026 · B09: Comparación

**Archivos:** `escena.js`, `controles.js`, `ficha.js`, `main.js` (se amplían).

**Orden de llegada.** Todos los paneles reciben los mismos pasos en cada cuadro, así que el primero en
terminar es el que necesita menos pasos: la animación muestra la diferencia de complejidad. En
`alAvanzar` la escena anota qué paneles terminaron en ese cuadro; si terminan varios a la vez, los
ordena por número de pasos para que el orden sea justo.

**Resumen (evidencia cuantitativa).** Cuando el último panel termina, la escena llama a
`alTerminarTodos(resumen)` y `main.js` muestra la tabla con: llegada, algoritmo, complejidad
promedio, comparaciones, intercambios, escrituras y pasos. La tabla se oculta cuando el reproductor
vuelve a `detenido` (Reiniciar, Nueva lista o cambio de selección), porque esos datos ya no
corresponden a lo que se ve.

**Todos / Ninguno.** Marcan o desmarcan todas las casillas y aplican la selección con la misma
función que el cambio manual, así respetan el límite de Stooge.

**Pruebas (72/72).** Una escena con 4 algoritmos sobre la misma lista corre paso a paso hasta el
final: el resumen llega una sola vez, en orden de pasos y con los mismos conteos que
`contarEjecucion`. Reiniciar borra la llegada y conserva la lista.

---

## 25/09/2026 · B08: Visualizador funcional

**Archivos:** `js/ui/panelAlgoritmo.js`, `js/ui/escena.js`, `js/ui/controles.js`, `js/ui/ficha.js`,
`js/main.js`. Desde aquí la página ya anima los algoritmos.

**Cómo se conectan las piezas** (pregunta típica: "¿cómo funciona la visualización?"):
1. `controles.js` lee los botones y deslizadores y llama a la escena.
2. `escena.js` guarda la lista base, crea un panel por algoritmo marcado y tiene **un solo
   reproductor**. En cada cuadro, el reproductor pide `n` pasos y la escena los reparte:
   `panel.avanzar(n)` en cada panel que no haya terminado.
3. `panelAlgoritmo.js`, por cada paso: pide un evento al generador, arma el mensaje, lo aplica al
   espejo y lo suma a los contadores. Al final del cuadro dibuja **una sola vez** el canvas y los
   números. Dibujar por evento sería desperdicio: a 2000 pasos/s serían 33 dibujos por cuadro.
4. La escena resalta en el panel de código la línea del último evento del panel activo.

**Mismos datos (requisito 9).** `listaBase` vive en la escena y nunca se modifica; cada panel
recibe la lista y su generador trabaja sobre una copia. "Reiniciar" usa la misma lista y
"Nueva lista" genera otra.

**Por qué la escena se adelantó de B09 a B08.** Los controles necesitan una escena, y hacerla para
N paneles es el mismo código que para uno (un `for`). B09 solo agrega lo propio de la comparación:
Todos/Ninguno, orden de llegada y tabla resumen. Registrado como cambio de contrato.

**Stooge Sort.** Con n = 120 haría millones de pasos. Mientras está marcado, el máximo del
deslizador baja a 30 y se muestra un aviso con el motivo.

**Botones.** Se habilitan según el estado del reproductor (B05): no se puede reproducir si ya
terminó (hay que reiniciar) y Pausar solo se activa mientras se reproduce.

**Ficha y leyenda.** La ficha muestra nombre, complejidad (mejor, promedio y peor), espacio,
estabilidad y descripción del algoritmo activo (requisitos 7 y 8). Cada panel muestra también su
complejidad promedio junto al título. La leyenda se genera desde `COLORES`.

**Pruebas (70/70).** Cada uno de los 8 paneles corre hasta el final de 7 en 7 pasos y sus
contadores (y los números en pantalla) coinciden con `contarEjecucion`; reiniciar vuelve a cero.
Otra prueba lee `index.html` y comprueba que las opciones de patrón coincidan con `PATRONES`. El
flujo completo se probó en la página con los botones reales.

---

## 25/09/2026 · B07: Métricas

**Archivo:** `js/core/metricas.js`. Es **el único lugar donde se calculan las métricas** (pregunta
típica de la revisión: "¿dónde se calcula una métrica?").

**Contadores.** `registrarEvento(contadores, evento)` suma según el tipo de evento:
comparaciones, intercambios, escrituras, movimientos (intercambios + escrituras) y pasos (todo
evento menos `done`). Se guardan intercambios y escrituras por separado porque la actividad menciona
"número de intercambios", pero para comparar algoritmos se usa "movimientos": Bubble y Quick
intercambian, mientras que Insertion y Merge escriben, y así todos se miden igual.

**`contarEjecucion(generador)`** recorre un algoritmo completo sin animar. Lo usan las pruebas, y
B09 podrá usarlo para saber los totales de antemano.

**`describirEvento(evento, valores)`** arma el mensaje del panel, por ejemplo
"Comparando posiciones 3 (45) y 4 (12)". Los valores se toman del espejo antes de aplicar el evento;
si no se pasan, la frase sale sin números.

**Pruebas (68/68).** `test.html` ya no cuenta a mano: usa `registrarEvento`. Para compararse con
Python convierte a su unidad: en Python `a, b = b, a` son 2 escrituras, así que
`escrituras Python = 2 × intercambios + escrituras`. Se agregaron pruebas de Bubble con [5,4,3,2,1],
de Merge (solo escribe) y de las frases.

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
