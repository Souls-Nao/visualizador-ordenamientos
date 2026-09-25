/**
 * js/algoritmos/quickSort.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 03 — Quick Sort (versión en el lugar) como generador.
 *
 * El original (quick_sort en docs/referencia/ordenamientos.py) toma el
 * pivote del centro y arma tres listas nuevas: menores, iguales y mayores.
 * Como eso no se puede dibujar sobre un solo arreglo (decisión 5.2 de la
 * planeación), esta versión conserva la misma idea pero acomoda los tres
 * grupos dentro del arreglo, con tres índices:
 *
 *   [lo, menor)     valores < pivote
 *   [menor, i)      valores == pivote
 *   [i, mayor)      todavía sin revisar
 *   [mayor, hi)     valores > pivote
 *
 * Al terminar la partición, los iguales al pivote ya están en su lugar
 * definitivo y solo se ordenan los grupos de menores y de mayores.
 *
 * El benchmark (Bloque 10) usa además la versión original con listas
 * nuevas, para medir tiempos igual que la práctica.
 */
import {
  crearEventoComparar,
  crearEventoIntercambiar,
  crearEventoPivote,
  crearEventoOrdenado,
  crearEventoTerminado,
} from '../core/eventos.js';

/** Líneas de FUENTES_PYTHON.quick que representa cada evento. */
const LINEA = Object.freeze({
  CASO_BASE: 3,
  PIVOTE: 5,
  COMPARAR_MENOR: 8,
  MOVER_MENOR: 9,
  COMPARAR_MAYOR: 12,
  MOVER_MAYOR: 14,
  IGUALES_LISTOS: 18,
});

export function* quickSort(arregloInicial) {
  const arr = [...arregloInicial];

  /**
   * Intercambia dos posiciones y devuelve dónde quedó el pivote, para
   * seguir resaltándolo aunque se mueva durante la partición.
   */
  function intercambiar(a, b, posPivote) {
    [arr[a], arr[b]] = [arr[b], arr[a]];
    if (posPivote === a) return b;
    if (posPivote === b) return a;
    return posPivote;
  }

  /** _quick_sort_rec(arr, lo, hi), con hi excluido. */
  function* ordenar(lo, hi) {
    if (hi - lo <= 1) {
      // Un solo elemento ya está en su lugar.
      if (hi - lo === 1) yield crearEventoOrdenado(lo, LINEA.CASO_BASE);
      return;
    }

    let posPivote = lo + Math.floor((hi - lo) / 2);
    const pivote = arr[posPivote];
    yield crearEventoPivote(posPivote, LINEA.PIVOTE);

    let menor = lo;
    let i = lo;
    let mayor = hi;

    while (i < mayor) {
      yield crearEventoComparar(i, posPivote, LINEA.COMPARAR_MENOR);

      if (arr[i] < pivote) {
        yield crearEventoIntercambiar(menor, i, LINEA.MOVER_MENOR);
        posPivote = intercambiar(menor, i, posPivote);
        menor++;
        i++;
        continue;
      }

      yield crearEventoComparar(i, posPivote, LINEA.COMPARAR_MAYOR);

      if (arr[i] > pivote) {
        mayor--;
        yield crearEventoIntercambiar(i, mayor, LINEA.MOVER_MAYOR);
        posPivote = intercambiar(i, mayor, posPivote);
      } else {
        i++;
      }
    }

    for (let k = menor; k < mayor; k++) {
      yield crearEventoOrdenado(k, LINEA.IGUALES_LISTOS);
    }

    yield* ordenar(lo, menor);
    yield* ordenar(mayor, hi);
  }

  yield* ordenar(0, arr.length);
  yield crearEventoTerminado();
}
