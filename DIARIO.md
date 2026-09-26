# DIARIO.md: Diario de actualizaciones

Explicación de cada cambio: qué se hizo, por qué y cómo se comprobó. La estructura y los contratos
están en [BLOQUES.md](BLOQUES.md); aquí va el razonamiento, para poder explicarlo en la revisión.
La entrada más reciente va arriba.

---

## 25/09/2026 · B15 (revisión): Complejidad en acción

**Decisión:** se eligió "vivo + final" (ver el análisis más abajo).

**Gráfica en vivo: "Comparaciones durante la animación"** (`graficaVivo.js`).
- La escena llama a `alActualizar` después de cada avance; `main.js` le pasa a la gráfica el resumen
  de los paneles (pasos y comparaciones de cada uno).
- Cada algoritmo es una línea: X = pasos que lleva, Y = comparaciones acumuladas. Como todos avanzan
  los mismos pasos por cuadro, las líneas crecen al ritmo de las barras; un algoritmo que termina deja
  de avanzar.
- Líneas punteadas horizontales con lo esperado para el n actual ("n² ≈ 3,600", "n log n ≈ 354"): se
  ve hacia dónde va cada uno.
- Para no crecer sin límite, cada línea guarda como máximo 400 puntos: al pasarse se descarta uno de
  cada dos, conservando el primero y el último.
- Se reinicia sola si cambian los algoritmos o el tamaño, o si todo vuelve a cero (Reiniciar).

**Gráfica final: "Crecimiento según el tamaño"** (`graficaCrecimiento.js` + `core/crecimiento.js`).
- Aparece cuando terminan todos y se oculta al volver a empezar.
- Usa el **mismo arreglo** de las barras: para n = 60 mide los primeros 6, 12, …, 60 elementos. El
  último punto (más grande) es exactamente la ejecución que se acaba de ver.
- Selector "Comparaciones / Tiempo (ms)"; con tiempo y menos de 500 elementos se avisa que no es
  confiable. Con más de 2000 elementos se miden los primeros 2000.
- La tabla de datos va en un desplegable "Ver datos" para no ocupar espacio.

**Incidente durante el cambio:** un script de edición falló a la mitad y borró de `index.html` el
bloque de código, leyenda y ficha. Se detectó con `git diff` y se reconstruyó a partir de la versión
confirmada (`git show HEAD:index.html`), aplicando solo los cambios buscados.

**Pruebas (80/80):** prefijos del arreglo (el último punto es la lista completa) y gráfica en vivo (un
punto por avance, referencias n log n y n², reinicio al volver a cero).

---

## Análisis: crecimiento con el mismo arreglo y como apartado de la interfaz (25/09/2026)

**Propuesta del integrante:** que Crecimiento use el mismo arreglo de las barras, que deje de ser un
botón y pase a ser un apartado debajo, con la gráfica animándose junto con el proceso.

**1. Mismo arreglo: sí, buena idea.** Se puede hacer usando **prefijos** de la lista del usuario: con
n = 60, los tamaños 6, 12, …, 60 son los primeros 6, 12, … elementos de esa misma lista. El último punto
es exactamente la ejecución que se ve en las barras, así que la gráfica y la animación hablan de los
mismos datos.

**2. ¿Animar la gráfica de crecimiento?** Hay un problema de fondo: esa gráfica pone en el eje X el
**tamaño n**, y la animación corre con **un solo n**. Los otros tamaños no se animan: se calculan al
instante. Si la gráfica "se fuera dibujando" durante la animación, sería una animación de adorno, no el
proceso real.

**Lo que sí se puede animar de verdad** es otra gráfica: **"Comparaciones a lo largo del tiempo"**.
- Eje X: pasos de la animación. Eje Y: comparaciones acumuladas de cada algoritmo.
- Se actualiza en cada cuadro con los mismos contadores de los paneles: avanza exactamente al ritmo
  de las barras.
- Líneas horizontales punteadas marcan lo esperado para ese n (n log n y n²): se ve hacia dónde va cada
  algoritmo, y los rápidos se aplanan al terminar mientras los O(n²) siguen subiendo.
- Es la "temporalidad" real del proceso, sincronizada con la animación.

**Recomendación: un apartado inferior con las dos gráficas.**
- Durante la animación: la gráfica en vivo **comparaciones vs pasos**.
- Al terminar todos los algoritmos aparece debajo la gráfica **crecimiento vs n** (con prefijos del
  mismo arreglo, comparaciones o tiempo), marcando el punto del n actual. Es el resumen: muestra por
  qué terminaron en ese orden.
- El botón y la ventana desaparecen; todo queda visible en la página.

---

## 25/09/2026 · B15: Ventana Crecimiento

**Decisión:** de las propuestas para el requisito 8 se eligió la **A** (la gráfica de la práctica en
Python), con comparaciones por defecto y la opción de ver tiempo.

**Qué hace.** El botón **Ver crecimiento** (junto a Todos / Ninguno) pausa la animación y abre una
ventana. Para los algoritmos seleccionados (o todos si no hay ninguno), mide 10 tamaños de n/10 hasta
n y dibuja una línea por algoritmo, con los colores de `benchmark.py`. Debajo va la tabla con los datos.

**Cómo mide** (`js/core/crecimiento.js`, sin DOM):
- Igual que `calcular_tiempos` de la práctica: una lista aleatoria por tamaño y todos los algoritmos
  ordenan esa misma lista.
- **Comparaciones:** se recorre el generador sin animar con `contarEjecucion` (B07). No dependen de la
  computadora, así que las curvas salen limpias. Se dibujan también n log n y n² punteadas como
  referencia: se ve que Selection y Bubble siguen la forma de n² y Merge la de n log n.
- **Tiempo (ms):** como en la práctica, con `performance.now()` y por lotes de al menos 5 ms (el reloj
  del navegador redondea a ~0.1 ms). Al elegir tiempo, n sube a 1000: con listas pequeñas pesa más el
  costo fijo de cada ejecución que el algoritmo, y Merge parecería más lento que Selection.
- Entre un tamaño y otro se cede el control (`await setTimeout 0`) para mostrar el progreso y que la
  página no se congele. Con n = 1000 y 5 algoritmos tarda menos de un segundo.
- Stooge se omite con n > 200 (con n^2.71 tardaría varios segundos por punto).

**Gráfica.** SVG hecho a mano, sin librerías (Chart.js se retiró en B14): rejilla, ejes con los tamaños
medidos, curvas teóricas recortadas al área, y un punto por medición que muestra su valor al pasar el
ratón.

**Pruebas (78/78):** tamaños y conteo, medición de 3 algoritmos (crece con n, Stooge omitido, Merge <
Bubble) y la gráfica (una línea por algoritmo, curvas teóricas solo con comparaciones).

---

## Propuestas para el requisito 8 (complejidad) (25/09/2026)

Hoy ya existe: etiqueta de color por clase, ficha con mejor/promedio/peor caso, gráfica teórica
"¿Cómo crece el trabajo?" y columna "Esperado para n" en el resumen. Opciones para ir más allá:

**A. Ventana "Crecimiento" (la idea de la práctica en Python).** Un botón abre una ventana (`<dialog>`)
con una gráfica como las de `benchmark.py`: eje X = tamaño n, eje Y = trabajo. Para cada algoritmo
seleccionado se ejecuta sin animar con varios tamaños (por ejemplo 10, 20, … hasta el tamaño actual) y
se dibuja una línea por algoritmo, con las curvas teóricas n, n log n y n² de fondo.
- **Qué medir:** propongo **comparaciones** (o pasos) en lugar de milisegundos. Salen idénticas en
  cada ejecución, no dependen de la computadora y muestran la complejidad sin ruido; con tiempos, las
  listas pequeñas dan casi 0 ms y las curvas salen irregulares (fue el problema del benchmark).
  Opcional: un selector "Comparaciones / Tiempo (ms)" para tener ambas, como en la práctica.
- Sin librerías: SVG hecho a mano, como la gráfica de la ficha.
- Costo: medio. Es la opción que mejor demuestra la complejidad.

**B. Barra "trabajo vs. esperado" en cada panel (sencilla).** Una barra delgada bajo los contadores
que se llena según `comparaciones / f(n)`. Mientras se anima se ve cómo Bubble llena su barra hacia n²
y Merge apenas avanza hacia n log n. Costo: bajo.

**C. Gráfica de barras en el resumen (sencilla).** Al terminar, barras horizontales con las
comparaciones de cada algoritmo, con marcas verticales en n log n y n². Se ve de un vistazo quién
hizo más trabajo y en qué zona cae. Costo: bajo.

**Recomendación:** A (con comparaciones y selector opcional de tiempo) + B.

**Decisión (25/09/2026):** se implementó A con comparaciones y tiempo (ver B15).

---

## Propuestas pendientes de decidir (25/09/2026)

Cambios que no se hicieron, para platicarlos. Ninguno es obligatorio para la actividad.

1. **Velocidad máxima mayor.** Ahora que el tamaño es libre, 2000 pasos/s se queda corto: Bubble con
   500 elementos (~125 000 pasos) tarda más de un minuto. Subir el máximo a 20 000 pasos/s es cambiar
   una constante (`VELOCIDAD_MAX`); el deslizador logarítmico lo absorbe.
2. **Botón "Ir al final".** Ejecuta lo que falta sin animar y muestra el resultado y el resumen al
   instante. Útil para comparar con listas grandes sin esperar. Es poco código: `avanzar(Infinity)`.
3. ~~Tiempo de ejecución en el resumen.~~ Resuelto por la ventana Crecimiento (B15), que mide tiempo.

---

## 25/09/2026 · B14: Ajustes de alcance

Revisión de los requisitos con el integrante.

**1. Se quitó el benchmark.** La actividad solo pide el visualizador. Se eliminaron la pestaña, el
código (`js/benchmark/`) y Chart.js (`vendor/`). Sigue en el historial de git por si se necesita. La
evidencia cuantitativa que pide la comparación la dan los contadores y la tabla resumen.

**2. Tamaño libre (requisito 2).** Antes era un deslizador de 5 a 120 que bajaba a 30 con Stooge. Ahora
es un campo numérico: cualquier entero de 2 a 10 000. El tope existe solo por razones técnicas: con más
barras que píxeles ya no se distinguen, y Bubble con 10 000 elementos haría unos 50 millones de pasos.
Si se escribe algo inválido ("abc", 0, 1.5) se muestra el motivo y se restaura el tamaño anterior. Con
Stooge ya no se limita el tamaño: se avisa cuántos pasos hará aproximadamente (n^2.71).

**3. Sin patrones.** Los datos siempre son aleatorios. `generarDatos` conserva sus 4 patrones (B02 es un
contrato cerrado y las pruebas los usan), pero la interfaz siempre pide `aleatoria`.

**4. Complejidad visual (requisito 8).** Tres formas de verla:
- **Color por clase:** verde O(n), azul O(n log n), naranja O(n²) y rojo O(n^2.71), en la etiqueta de
  cada panel, en la ficha, en el resumen y en la pestaña Algoritmos. Los colores viven solo en `CLASES`
  (`complejidad.js`).
- **Gráfica "¿Cómo crece el trabajo?"** en la ficha (SVG hecho a mano, sin librerías): curvas de n,
  n log n y n² de 1 hasta el tamaño de la lista actual (más n^2.71 para Stooge). La del algoritmo va
  gruesa y, si su peor caso es distinto (Quick), punteada. Se ve de inmediato que n² se dispara y
  n log n casi no crece. Debajo: "Con tu lista (n = 30), n² ≈ 900 operaciones".
- **Columna "Esperado para n"** en el resumen: el valor de la fórmula junto a las comparaciones reales,
  para comprobar que los conteos siguen la complejidad (por ejemplo, Bubble con n = 30: n² ≈ 900 y hace
  unas 430 comparaciones, del orden de n²/2).

**Otros ajustes.** La velocidad se guardaba reconvertida desde el deslizador (20 → 19); ahora se
guarda la real. Una prueba del panel de código dependía del ancho de la ventana; ahora usa un
contenedor de ancho fijo. Capturas del README regeneradas.

**Pruebas:** 75/75.

---

## 25/09/2026 · B13: README, pruebas finales y despliegue

**README.** Cubre todo lo que pide la actividad: URL publicada, integrantes, instrucciones de
ejecución, descripción de los algoritmos, capturas, documentación y código fuente. Además explica la
arquitectura, dónde se calcula cada métrica, las pruebas, las limitaciones conocidas y el uso de IA.

**Capturas.** En la computadora no hay Chrome ni Edge para sacarlas en modo automático. Se generaron
desde el navegador integrado con html2canvas (solo para tomarlas, no forma parte del proyecto) y un
servidor temporal que guardó los PNG en `docs/capturas/`. html2canvas no dibuja los deslizadores,
así que en las capturas se reemplazaron por una barra equivalente.

**Bug encontrado al tomar las capturas.** La velocidad inicial mostraba 19 pasos/s en lugar de 20:
desde B12 se convertía velocidad → deslizador → velocidad, y la escala logarítmica redondea. Ahora la
velocidad inicial se usa tal cual y el deslizador solo se coloca cerca.

**Pruebas finales en la URL pública.** 76/76 pruebas, los 8 paneles animándose, las 4 pestañas,
benchmark con sus 4 gráficas y sin errores en consola. Repositorio, tablero y sitio abren sin sesión.

**Lo que falta (lo hace el integrante):** revisar el README, actualizar el tablero y entregar.

---

## 25/09/2026 · B12: Pulido y extras

**Archivos:** `js/ui/preferencias.js`, `js/ui/atajos.js` y ajustes en `controles.js`, `ficha.js`,
`main.js`, `index.html` y CSS.

**Preferencias.** Se recuerdan la selección de algoritmos, el tamaño, el patrón y la velocidad
(localStorage, clave `vo.preferencias`). Todo va en try/catch: si el navegador bloquea el
almacenamiento, la página usa los valores por defecto. Al cargar se descarta lo que ya no sea válido
(un id que no exista o un patrón desconocido).

**Atajos.** Espacio (reproducir/pausar), → (paso), R (reiniciar) y N (nueva lista). En lugar de
llamar a la escena, el atajo **pulsa el botón**: así respeta si está deshabilitado y no se duplica
lógica. No actúa si el foco está en un campo o botón, porque ahí la tecla ya hace algo (por ejemplo,
→ mueve un deslizador). Hay una línea de ayuda debajo de la velocidad.

**Pestaña Algoritmos.** Tabla con tipo, complejidad (mejor, promedio y peor), espacio, estabilidad
e idea de cada algoritmo, generada desde el mismo registro que la ficha, así nunca se contradicen.

**Celular.** Se revisaron las 4 pestañas a 360 y 375 px, también con los 8 paneles: no hay
desplazamiento horizontal. Las pestañas se achican un poco para caber sin desplazarse.

**Nota:** al probar, el navegador guardaba en caché el CSS viejo. GitHub Pages también guarda en
caché unos minutos: después de publicar puede hacer falta recargar con Ctrl + F5.

---

## 25/09/2026 · B11: Gráficas, tabla y CSV

**Archivos:** `js/benchmark/graficas.js`, `csv.js`, `vendor/chart.umd.min.js`, ajuste en `worker.js`.

**Gráficas.** Las mismas cuatro de `benchmark.py`, con sus títulos y colores (`tab:blue`,
`tab:orange`, ...): Stooge solo, fuerza bruta, fuerza bruta vs Merge y fuerza bruta vs Quick. Chart.js
está copiado en `vendor/` (no depende de internet) y se carga como script normal antes de los
módulos. Antes de dibujar se destruyen las gráficas anteriores, así repetir la medición no las
duplica. Los colores de texto se leen de las variables CSS para que se vean en tema claro y oscuro.

**Tabla y CSV.** Una fila por tamaño y una columna por algoritmo, en milisegundos. El CSV lleva BOM
para que Excel muestre bien los acentos. Un tiempo omitido (Stooge con listas grandes) aparece como
hueco en la gráfica, `—` en la tabla y vacío en el CSV.

**Problema encontrado y corregido en la medición** (vale la pena contarlo en la revisión):
1. *Curvas al revés:* Bubble tardaba más con n = 200 que con n = 500. Causa: el motor de JavaScript
   optimiza una función después de varias ejecuciones; los primeros tamaños se medían sin optimizar.
   Solución: un calentamiento general (5 rondas de todos los algoritmos) antes de medir.
2. *Tiempos en 0.000:* el navegador redondea `performance.now()` a unos 0.1 ms por seguridad, y
   ordenar 100 elementos tarda menos que eso. Solución: medir por lotes. Se repite el algoritmo
   (1, 2, 4, 8... veces) hasta que el lote dure al menos 5 ms y se divide entre las vueltas. Las
   versiones fieles copian la lista al empezar, como `lista.copy()` en Python, así que repetirlas
   sobre la misma lista es válido.

Con eso las curvas crecen como se espera (O(n²) y O(n log n) se distinguen) y dos ejecuciones
seguidas dan casi los mismos números. De 100 a 500 tarda unos 2 s.

**Pruebas (76/76).** Se agregó una prueba del CSV. Las gráficas se verificaron en la página.

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
