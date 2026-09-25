/**
 * js/core/metricas.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 07 — Métricas: contadores y mensaje de estado.
 *
 * Es el único lugar donde se calculan las métricas del visualizador. Las
 * reglas son las mismas para los 8 algoritmos, así la comparación es justa:
 *
 *   compare        → comparaciones + 1
 *   swap           → intercambios + 1, movimientos + 1
 *   write          → escrituras + 1,   movimientos + 1
 *   todo evento    → pasos + 1   (salvo `done`, que solo avisa el final)
 *
 * "Movimientos" junta intercambios y escrituras porque unos algoritmos
 * intercambian (Bubble, Quick) y otros escriben (Insertion, Merge).
 *
 * No depende del DOM ni del dibujo.
 */
import { TIPOS_EVENTO } from './eventos.js';

/**
 * @typedef {Object} Contadores
 * @property {number} comparaciones
 * @property {number} intercambios
 * @property {number} escrituras
 * @property {number} movimientos   intercambios + escrituras
 * @property {number} pasos         eventos emitidos, sin contar `done`
 */

/** @returns {Contadores} */
export function crearContadores() {
  return { comparaciones: 0, intercambios: 0, escrituras: 0, movimientos: 0, pasos: 0 };
}

/**
 * Suma un evento a los contadores (los modifica).
 *
 * @param {Contadores} contadores
 * @param {{type: string}} evento
 */
export function registrarEvento(contadores, evento) {
  switch (evento.type) {
    case TIPOS_EVENTO.TERMINADO:
      return;
    case TIPOS_EVENTO.COMPARAR:
      contadores.comparaciones++;
      break;
    case TIPOS_EVENTO.INTERCAMBIAR:
      contadores.intercambios++;
      contadores.movimientos++;
      break;
    case TIPOS_EVENTO.ESCRIBIR:
      contadores.escrituras++;
      contadores.movimientos++;
      break;
  }
  contadores.pasos++;
}

/**
 * Recorre un generador completo y devuelve sus contadores, sin animar.
 * Sirve para las pruebas y para conocer los totales de antemano.
 *
 * @param {Iterable<{type: string}>} generador
 * @returns {Contadores}
 */
export function contarEjecucion(generador) {
  const contadores = crearContadores();
  for (const evento of generador) registrarEvento(contadores, evento);
  return contadores;
}

/**
 * Frase corta que describe un evento, para el mensaje de estado del panel.
 * Si se pasan los valores del arreglo (el espejo antes de aplicar el
 * evento), la frase incluye los números que se comparan o mueven.
 *
 * @param {{type: string, indices?: number[], value?: number}} evento
 * @param {number[]} [valores]
 * @returns {string}
 */
export function describirEvento(evento, valores) {
  const [i, j] = evento.indices ?? [];
  const v = (k) => (valores ? ` (${valores[k]})` : '');

  switch (evento.type) {
    case TIPOS_EVENTO.COMPARAR:
      return `Comparando posiciones ${i}${v(i)} y ${j}${v(j)}`;
    case TIPOS_EVENTO.INTERCAMBIAR:
      return i === j
        ? `La posición ${i}${v(i)} se queda en su lugar`
        : `Intercambiando posiciones ${i}${v(i)} y ${j}${v(j)}`;
    case TIPOS_EVENTO.ESCRIBIR:
      return `Escribiendo ${evento.value} en la posición ${i}`;
    case TIPOS_EVENTO.PIVOTE:
      return `Pivote en la posición ${i}${v(i)}`;
    case TIPOS_EVENTO.ORDENADO:
      return `La posición ${i} queda en su lugar final`;
    case TIPOS_EVENTO.TERMINADO:
      return 'Ordenamiento terminado';
    default:
      return '';
  }
}
