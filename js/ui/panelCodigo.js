/**
 * js/ui/panelCodigo.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 06 — Panel de código con la línea activa resaltada.
 *
 * Muestra el código Python de un algoritmo (ALGORITMOS[id].fuente) con sus
 * números de línea y resalta la línea del evento que se está animando
 * (campo `line`, Bloque 01).
 *
 * El desplazamiento se hace solo dentro del panel (scrollTop) y no con
 * scrollIntoView, para que la página no salte mientras corre la animación.
 */
import { ALGORITMOS } from '../algoritmos/index.js';

/**
 * Prepara el panel de código dentro de un contenedor.
 *
 * @param {HTMLElement} contenedor
 * @returns {{ mostrar(id: string): void, resaltar(line: number|null): void, limpiar(): void }}
 */
export function crearPanelCodigo(contenedor = document.getElementById('zona-codigo')) {
  /** @type {HTMLElement[]} Elementos de cada línea; lineas[0] es la línea 1. */
  let lineas = [];
  let activa = null;
  let idActual = null;

  /**
   * Muestra el código de un algoritmo. No hace nada si ya se está mostrando.
   *
   * @param {string} id  Clave de ALGORITMOS, por ejemplo 'bubble'.
   */
  function mostrar(id) {
    if (id === idActual) return;
    const { nombre, fuente } = ALGORITMOS[id];
    idActual = id;
    activa = null;

    const titulo = document.createElement('p');
    titulo.className = 'codigo__titulo';
    titulo.textContent = `${nombre} · Python`;

    lineas = fuente.map((texto, i) => {
      const linea = document.createElement('div');
      linea.className = 'codigo__linea';
      const numero = document.createElement('span');
      numero.className = 'codigo__num';
      numero.textContent = i + 1;
      linea.append(numero, texto);
      return linea;
    });

    contenedor.replaceChildren(titulo, ...lineas);
    contenedor.scrollTop = 0;
  }

  /**
   * Resalta una línea (1-indexada) y la mantiene a la vista.
   * Con null o un número fuera de rango solo quita el resaltado.
   *
   * @param {number|null} line
   */
  function resaltar(line) {
    const nueva = lineas[line - 1] ?? null;
    if (nueva === activa) return;

    activa?.classList.remove('codigo__linea--activa');
    activa = nueva;
    if (!activa) return;
    activa.classList.add('codigo__linea--activa');

    // Si la línea quedó fuera de la zona visible del panel, se desplaza lo
    // justo. El título fijo ocupa la parte de arriba, así que se descuenta.
    const alturaTitulo = contenedor.firstElementChild.offsetHeight;
    const arriba = activa.offsetTop;
    const abajo = arriba + activa.offsetHeight;
    if (arriba - alturaTitulo < contenedor.scrollTop) {
      contenedor.scrollTop = arriba - alturaTitulo;
    } else if (abajo > contenedor.scrollTop + contenedor.clientHeight) {
      contenedor.scrollTop = abajo - contenedor.clientHeight;
    }
  }

  return {
    mostrar,
    resaltar,
    limpiar: () => resaltar(null),
  };
}
