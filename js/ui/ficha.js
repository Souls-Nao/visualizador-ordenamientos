/**
 * js/ui/ficha.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Ficha del algoritmo y leyenda de colores.
 *
 * La ficha muestra nombre, complejidad (requisitos 7 y 8 de la actividad),
 * espacio, estabilidad y una descripción, todo tomado del registro (B03).
 * La leyenda se genera desde COLORES (B04), la misma fuente que usa el canvas.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { COLORES, NOMBRES_ESTADO } from '../render/canvasBarras.js';

/**
 * @param {HTMLElement} contenedor
 * @param {string} id
 */
export function pintarFicha(contenedor, id) {
  const a = ALGORITMOS[id];
  const filas = [
    ['Mejor caso', a.mejor],
    ['Caso promedio', a.promedio],
    ['Peor caso', a.peor],
    ['Espacio adicional', a.espacio],
    ['Estable', a.estable],
  ];

  const titulo = document.createElement('h3');
  titulo.textContent = a.nombre;

  const tabla = document.createElement('table');
  tabla.className = 'ficha__tabla';
  for (const [etiqueta, valor] of filas) {
    const fila = tabla.insertRow();
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = etiqueta;
    fila.append(th);
    fila.insertCell().textContent = valor;
  }

  const descripcion = document.createElement('p');
  descripcion.textContent = a.descripcion;

  contenedor.replaceChildren(titulo, tabla, descripcion);
}

/** @param {HTMLElement} contenedor */
export function pintarLeyenda(contenedor) {
  const items = Object.entries(COLORES).map(([estado, color]) => {
    const item = document.createElement('span');
    item.className = 'leyenda__item';
    const muestra = document.createElement('span');
    muestra.className = 'leyenda__color';
    muestra.style.background = color;
    item.append(muestra, NOMBRES_ESTADO[estado]);
    return item;
  });
  contenedor.replaceChildren(...items);
}
