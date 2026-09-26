/**
 * js/core/eventos.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 01 — Contrato de eventos.
 *
 * Este módulo define la ÚNICA forma en que el motor de algoritmos
 * (js/algoritmos/*) se comunica con todo lo demás (Canvas, reproductor,
 * panel de código, contadores). Ningún otro módulo debe inventar su propia
 * forma de evento: si algo nuevo hace falta, se agrega aquí primero y se
 * documenta en docs/eventos.md.
 *
 * Decisión de diseño (ver sección 5.1 del entregable de planeación,
 * referente DSA_Algorithms_Visualizer): los eventos NUNCA llevan una copia
 * completa del arreglo. Solo llevan índices y, cuando aplica, el valor
 * escrito. Quien necesita los valores del arreglo mantiene su propia copia
 * (el espejo, js/render/espejo.js) y aplica la operación que el evento
 * describe; las métricas (js/core/metricas.js) solo cuentan eventos.
 *
 * No importa nada de otros módulos del proyecto (es la base de todo).
 */

/**
 * Tipos de evento que puede emitir un generador de algoritmo.
 *
 * - COMPARAR:     se están comparando dos posiciones, sin modificarlas.
 * - INTERCAMBIAR: dos posiciones intercambian su valor entre sí.
 * - ESCRIBIR:     una posición recibe un valor nuevo (no es un intercambio
 *                 entre dos posiciones del mismo arreglo; por ejemplo,
 *                 Merge Sort escribiendo el resultado combinado).
 * - PIVOTE:       se marca una posición como pivote (solo lo usa Quick Sort).
 * - ORDENADO:     una posición queda en su lugar definitivo.
 * - TERMINADO:    el algoritmo ya no tiene más eventos que emitir. Es el
 *                 último evento de toda ejecución y no lleva `indices`
 *                 ni `line`.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const TIPOS_EVENTO = Object.freeze({
  COMPARAR: 'compare',
  INTERCAMBIAR: 'swap',
  ESCRIBIR: 'write',
  PIVOTE: 'pivot',
  ORDENADO: 'sorted',
  TERMINADO: 'done',
});

/**
 * Claves de estado visual (color) que puede tener una barra en el Canvas.
 * El Bloque 04 (render/canvasBarras.js) es quien traduce estas claves a
 * colores concretos; aquí solo se fija el vocabulario para que todos los
 * módulos hablen igual.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const ESTADOS_COLOR = Object.freeze({
  SIN_TOCAR: 'sin-tocar',
  COMPARANDO: 'comparando',
  INTERCAMBIO: 'intercambio',
  PIVOTE: 'pivote',
  ORDENADO: 'ordenado',
});

/**
 * Relación fija entre cada tipo de evento y el estado de color que debería
 * activar en las posiciones que afecta. El Bloque 04 se apoya en este mapa
 * para no tener que repetir esta lógica (evento → color) en cada renderer.
 * TERMINADO no aparece porque no afecta a ninguna posición en particular.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const COLOR_POR_TIPO = Object.freeze({
  [TIPOS_EVENTO.COMPARAR]: ESTADOS_COLOR.COMPARANDO,
  [TIPOS_EVENTO.INTERCAMBIAR]: ESTADOS_COLOR.INTERCAMBIO,
  [TIPOS_EVENTO.ESCRIBIR]: ESTADOS_COLOR.INTERCAMBIO,
  [TIPOS_EVENTO.PIVOTE]: ESTADOS_COLOR.PIVOTE,
  [TIPOS_EVENTO.ORDENADO]: ESTADOS_COLOR.ORDENADO,
});

/**
 * Construye un evento de comparación entre dos posiciones.
 *
 * @param {number} i     Primer índice comparado.
 * @param {number} j     Segundo índice comparado.
 * @param {number} line  Línea del código Python que representa esta
 *                        comparación (para el panel de código, Bloque 06).
 * @returns {{type: string, indices: number[], line: number}}
 */
export function crearEventoComparar(i, j, line) {
  return { type: TIPOS_EVENTO.COMPARAR, indices: [i, j], line };
}

/**
 * Construye un evento de intercambio entre dos posiciones.
 *
 * @param {number} i
 * @param {number} j
 * @param {number} line
 * @returns {{type: string, indices: number[], line: number}}
 */
export function crearEventoIntercambiar(i, j, line) {
  return { type: TIPOS_EVENTO.INTERCAMBIAR, indices: [i, j], line };
}

/**
 * Construye un evento de escritura de un valor nuevo en una posición.
 * Lo usan los algoritmos que no intercambian dos posiciones del mismo
 * arreglo entre sí, como Merge Sort al copiar el resultado combinado.
 *
 * @param {number} index  Posición que recibe el valor.
 * @param {number} value  Valor que se escribe.
 * @param {number} line
 * @returns {{type: string, indices: number[], value: number, line: number}}
 */
export function crearEventoEscribir(index, value, line) {
  return { type: TIPOS_EVENTO.ESCRIBIR, indices: [index], value, line };
}

/**
 * Construye un evento que marca una posición como pivote (Quick Sort).
 *
 * @param {number} index
 * @param {number} line
 * @returns {{type: string, indices: number[], line: number}}
 */
export function crearEventoPivote(index, line) {
  return { type: TIPOS_EVENTO.PIVOTE, indices: [index], line };
}

/**
 * Construye un evento que marca una posición como ordenada en definitiva.
 *
 * @param {number} index
 * @param {number} line
 * @returns {{type: string, indices: number[], line: number}}
 */
export function crearEventoOrdenado(index, line) {
  return { type: TIPOS_EVENTO.ORDENADO, indices: [index], line };
}

/**
 * Construye el evento final de una ejecución. No lleva índices ni línea:
 * es la señal de que el algoritmo terminó. Al recibirlo, el espejo
 * (Bloque 04) pinta todas las barras como ordenadas y el panel deja de
 * pedir eventos.
 *
 * @returns {{type: string}}
 */
export function crearEventoTerminado() {
  return { type: TIPOS_EVENTO.TERMINADO };
}