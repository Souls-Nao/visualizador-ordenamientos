# Curso desde cero: índice propuesto

Propuesta de capítulos para enseñar el proyecto a alguien que **nunca ha visto un programa**.
Cubre los 46 archivos del repositorio (sin contar las 4 capturas), el porqué de cada carpeta y de
cada nombre. Total: **33 capítulos en 3 partes**.

## Por qué tantos

- Antes de abrir un solo archivo del proyecto, el estudiante necesita saber qué es un archivo,
  un navegador, HTML, CSS y JavaScript. Eso es la Parte 1 (11 capítulos).
- Después, cada archivo se explica completo, línea por línea cuando haga falta. Los archivos
  pequeños o muy parecidos se agrupan en un capítulo; los centrales (eventos, espejo,
  reproductor, escena) tienen el suyo.
- Cada capítulo debe poder leerse en una sesión de 30 a 45 minutos y terminar con algo que el
  estudiante pueda hacer por su cuenta.

## Parte 1: Fundamentos (antes del proyecto)

| # | Capítulo | Qué aprende |
|---|---|---|
| 1 | ¿Qué es un programa? | Instrucciones, computadora, archivos, carpetas, extensiones (`.html`, `.js`) |
| 2 | Tus herramientas | Editor, navegador, consola (F12), terminal, servidor local |
| 3 | Cómo funciona una página web | Qué hace el HTML, el CSS y el JavaScript, y cómo se juntan |
| 4 | HTML desde cero | Etiquetas, atributos, `id`, `class`, estructura de una página |
| 5 | CSS desde cero | Selectores, colores, cajas, Flexbox, Grid, variables |
| 6 | JavaScript I | Valores, variables, operaciones, `if` |
| 7 | JavaScript II | Funciones, arreglos, ciclos `for`, objetos |
| 8 | JavaScript III | El DOM: leer y cambiar la página, reaccionar a clics |
| 9 | JavaScript IV | Módulos: `import`, `export` y por qué necesitan servidor |
| 10 | ¿Qué es ordenar? | Algoritmos, comparar e intercambiar, contar el trabajo, notación O |
| 11 | Git y GitHub | Repositorio, commit, push, historial |

## Parte 2: El proyecto, archivo por archivo

| # | Capítulo | Archivos |
|---|---|---|
| 12 | El mapa: carpetas y nombres | Toda la estructura; por qué `css/`, `js/core`, `js/algoritmos`, `js/render`, `js/motor`, `js/ui`, `docs/`; convenciones de nombres (español, camelCase, `crear…`, prefijos de ID, clases BEM) |
| 13 | Los archivos de la raíz | `index.html`, `.gitignore`, `.nojekyll`, `README.md`, `BLOQUES.md`, `DIARIO.md` |
| 14 | Los estilos | `css/base.css`, `css/layout.css`, `css/componentes.css` |
| 15 | El arranque | `js/main.js`, `js/config.js` |
| 16 | Los eventos y los generadores | `js/core/eventos.js`, `docs/eventos.md` |
| 17 | Los datos | `js/core/datos.js` |
| 18 | El registro de algoritmos | `js/algoritmos/index.js`, `js/algoritmos/fuentesPython.js` |
| 19 | Algoritmos que intercambian | `selectionSort.js`, `bubbleSort.js`, `exchangeSort.js` |
| 20 | Algoritmos que desplazan | `insertionSort.js`, `gnomeSort.js` |
| 21 | Algoritmos recursivos | `stoogeSort.js`, `mergeSort.js`, `quickSort.js` |
| 22 | El espejo | `js/render/espejo.js` |
| 23 | Dibujar barras | `js/render/canvasBarras.js` |
| 24 | El reloj de la animación | `js/motor/reproductor.js` |
| 25 | Contar el trabajo | `js/core/metricas.js` |
| 26 | Navegar y mostrar código | `js/ui/pestanas.js`, `js/ui/panelCodigo.js` |
| 27 | Un panel completo | `js/ui/panelAlgoritmo.js` |
| 28 | La escena | `js/ui/escena.js` |
| 29 | Controles del usuario | `js/ui/controles.js`, `js/ui/preferencias.js`, `js/ui/atajos.js` |
| 30 | Ficha y complejidad | `js/ui/ficha.js`, `js/ui/complejidad.js` |
| 31 | Las gráficas | `js/core/crecimiento.js`, `js/ui/graficaVivo.js`, `js/ui/graficaCrecimiento.js` |

## Parte 3: Probar, publicar y crear lo tuyo

| # | Capítulo | Archivos |
|---|---|---|
| 32 | Probar que funciona | `test.html`, `docs/referencia/` (`ordenamientos.py`, `benchmark.py`, `main.py`, `conteos.py`) |
| 33 | Publicar y construir tu propio proyecto | GitHub Pages, capturas (`docs/capturas/`), ruta y retos |

## Formato de cada capítulo

1. **Qué vas a aprender** (una frase).
2. **La idea explicada con algo cotidiano** (una analogía antes del código).
3. **El archivo o el concepto**, en partes pequeñas, cada una explicada.
4. **Pruébalo tú**: un ejercicio corto con su solución al final.
5. **Resumen** en tres puntos.
