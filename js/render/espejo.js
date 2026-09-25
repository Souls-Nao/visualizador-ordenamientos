/**
 * js/render/espejo.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 04 — Espejo del arreglo.
 *
 * Los eventos no llevan el arreglo completo (Bloque 01), así que quien los
 * dibuja mantiene su propia copia: el "espejo". Este módulo aplica cada
 * evento sobre esa copia y calcula el estado de color de cada barra.
 * Es lógica pura, sin DOM: se prueba en test.html.
 *
 * Reglas de color:
 * - Los colores de un evento (comparando, intercambio) duran un solo paso.
 * - 'ordenado' es permanente.
 * - El pivote conserva su color mientras dura su partición (también al
 *   compararse) y lo sigue si un intercambio lo mueve de lugar.
 * - `done` pinta todo como ordenado.
 */
import { TIPOS_EVENTO, ESTADOS_COLOR, COLOR_POR_TIPO } from '../core/eventos.js';

/**
 * @typedef {Object} Espejo
 * @property {number[]} valores     Copia del arreglo, actualizada evento a evento.
 * @property {string[]} estados     Estado de color de cada posición (ESTADOS_COLOR).
 * @property {Set<number>} ordenados Posiciones que ya están en su lugar final.
 * @property {number|null} pivote   Posición actual del pivote, si hay uno.
 * @property {number[]} marcados    Posiciones pintadas por el último evento.
 * @property {boolean} terminado    true después de recibir `done`.
 */

/**
 * Crea el espejo de una lista, con todas las barras sin tocar.
 *
 * @param {number[]} arreglo
 * @returns {Espejo}
 */
export function crearEspejo(arreglo) {
  return {
    valores: [...arreglo],
    estados: new Array(arreglo.length).fill(ESTADOS_COLOR.SIN_TOCAR),
    ordenados: new Set(),
    pivote: null,
    marcados: [],
    terminado: false,
  };
}

/** Color que tiene una posición cuando ningún evento la está señalando. */
function estadoBase(espejo, i) {
  if (espejo.ordenados.has(i)) return ESTADOS_COLOR.ORDENADO;
  if (i === espejo.pivote) return ESTADOS_COLOR.PIVOTE;
  return ESTADOS_COLOR.SIN_TOCAR;
}

/**
 * Aplica un evento sobre el espejo (lo modifica).
 * Solo toca las posiciones del evento anterior y del actual, así que su
 * costo no depende del tamaño de la lista.
 *
 * @param {Espejo} espejo
 * @param {{type: string, indices?: number[], value?: number}} evento
 */
export function aplicarEvento(espejo, evento) {
  // 1) Las marcas del paso anterior vuelven a su color base.
  for (const i of espejo.marcados) {
    espejo.estados[i] = estadoBase(espejo, i);
  }
  espejo.marcados.length = 0;

  switch (evento.type) {
    case TIPOS_EVENTO.INTERCAMBIAR: {
      const [i, j] = evento.indices;
      [espejo.valores[i], espejo.valores[j]] = [espejo.valores[j], espejo.valores[i]];
      if (espejo.pivote === i) espejo.pivote = j;
      else if (espejo.pivote === j) espejo.pivote = i;
      break;
    }
    case TIPOS_EVENTO.ESCRIBIR:
      espejo.valores[evento.indices[0]] = evento.value;
      break;
    case TIPOS_EVENTO.PIVOTE: {
      const anterior = espejo.pivote;
      espejo.pivote = evento.indices[0];
      if (anterior !== null) espejo.estados[anterior] = estadoBase(espejo, anterior);
      break;
    }
    case TIPOS_EVENTO.ORDENADO:
      espejo.ordenados.add(evento.indices[0]);
      break;
    case TIPOS_EVENTO.TERMINADO:
      marcarTodoOrdenado(espejo);
      return;
  }

  // 2) Las posiciones del evento toman su color durante este paso. Al
  //    comparar contra el pivote, este conserva su morado para que se vea
  //    contra qué se compara.
  const color = COLOR_POR_TIPO[evento.type];
  for (const i of evento.indices) {
    const esPivoteComparado = evento.type === TIPOS_EVENTO.COMPARAR && i === espejo.pivote;
    espejo.estados[i] = esPivoteComparado ? ESTADOS_COLOR.PIVOTE : color;
    espejo.marcados.push(i);
  }
}

/**
 * Pinta todas las barras como ordenadas y cierra el espejo.
 *
 * @param {Espejo} espejo
 */
export function marcarTodoOrdenado(espejo) {
  espejo.valores.forEach((_, i) => espejo.ordenados.add(i));
  espejo.estados.fill(ESTADOS_COLOR.ORDENADO);
  espejo.pivote = null;
  espejo.marcados.length = 0;
  espejo.terminado = true;
}
