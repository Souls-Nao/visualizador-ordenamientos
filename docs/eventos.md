# Contrato de eventos

Fuente de verdad en código: `js/core/eventos.js`. Este documento es la versión legible de ese
contrato, tal como pide el criterio de terminado de la tarea D-04 del backlog.

## Qué es un evento

Cada algoritmo (`js/algoritmos/*Sort.js`) es una función generadora (`function*`) que, al
recorrer el arreglo, va emitiendo (`yield`) objetos "evento". Un evento describe **una sola
operación elemental** del algoritmo: una comparación, un intercambio, una escritura, marcar un
pivote o marcar una posición como ordenada. La secuencia completa de eventos, reproducida en
orden, es la animación.

Los algoritmos **no dibujan nada**. Solo emiten estos objetos. Quien los recibe (hoy, el
reproductor del Bloque 05, que a su vez los reparte al Canvas del Bloque 04, al panel de código
del Bloque 06 y a los contadores del Bloque 07) decide qué hacer con cada uno.

## Regla más importante: sin copias del arreglo

Ningún evento lleva el arreglo completo. Solo lleva índices (y, en `write`, el valor). Esto es
intencional (ver 5.1 del entregable de planeación, referente `DSA_Algorithms_Visualizer`): copiar
el arreglo en cada paso gasta memoria innecesaria. En su lugar, **quien consume los eventos
mantiene su propio espejo del arreglo** y lo actualiza aplicando la operación:

- Al recibir `swap` con `indices: [i, j]`, intercambia sus propios valores en `i` y `j`.
- Al recibir `write` con `indices: [i]` y `value`, escribe `value` en la posición `i` de su
  propio espejo.
- `compare`, `pivot` y `sorted` no modifican valores, solo el color de esas posiciones.

## Tipos de evento

| `type` | Campos además de `type` | Cuándo se usa |
|---|---|---|
| `compare` | `indices: [i, j]`, `line` | Se comparan dos posiciones, sin modificarlas. |
| `swap` | `indices: [i, j]`, `line` | Dos posiciones intercambian su valor entre sí. |
| `write` | `indices: [i]`, `value`, `line` | Una posición recibe un valor nuevo (por ejemplo, Merge Sort copiando el resultado combinado). |
| `pivot` | `indices: [i]`, `line` | Se marca una posición como pivote. Solo lo emite Quick Sort. |
| `sorted` | `indices: [i]`, `line` | Una posición queda en su lugar definitivo. |
| `done` | *(ninguno)* | Última señal de la ejecución. No lleva `indices` ni `line`. |

`line` es el número de línea, contando desde 1, dentro de la fuente Python de su algoritmo
(`FUENTES_PYTHON[id]` en `js/algoritmos/fuentesPython.js`, también disponible como
`ALGORITMOS[id].fuente`). Las fuentes parten de `ordenamientos.py`, con los ajustes para el
visualizador descritos en la ficha de B03 de `BLOQUES.md`. Lo usa el panel de código
(Bloque 06) para resaltar la línea activa, y `test.html` verifica que ninguna quede fuera de rango.

## Estados de color

El Bloque 04 traduce cada tipo de evento a un estado de color de barra, usando el mapa
`COLOR_POR_TIPO` de `js/core/eventos.js`:

| Estado | Se activa con |
|---|---|
| `sin-tocar` | Estado inicial, antes de cualquier evento sobre esa posición. |
| `comparando` | `compare` |
| `intercambio` | `swap` y `write` |
| `pivote` | `pivot` |
| `ordenado` | `sorted` |

## Ejemplo

Comparación de las posiciones 0 y 1, seguida de un intercambio entre ellas. En la fuente de
`bubble_sort`, la línea 6 es `if arr[j] > arr[j + 1]:` y la 7 es el intercambio:

```js
{ type: 'compare', indices: [0, 1], line: 6 }
{ type: 'swap',    indices: [0, 1], line: 7 }
```

Al terminar toda la ejecución:

```js
{ type: 'done' }
```

## Cómo construir un evento

No se arma el objeto a mano en cada algoritmo: se usan los helpers de `js/core/eventos.js`
(`crearEventoComparar`, `crearEventoIntercambiar`, `crearEventoEscribir`, `crearEventoPivote`,
`crearEventoOrdenado`, `crearEventoTerminado`), para que la forma del objeto quede en un solo
lugar y nunca se desvíe del contrato de este documento.