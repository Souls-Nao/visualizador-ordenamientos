/**
 * js/ui/ficha.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Ficha del algoritmo y leyenda de colores.
 *
 * La ficha muestra nombre, complejidad (requisitos 7 y 8 de la actividad),
 * espacio, estabilidad y una descripción, todo tomado del registro (B03).
 * La leyenda se genera desde COLORES (B04), la misma fuente que usa el canvas.
 * El resumen de la comparación (Bloque 09) se pinta con pintarResumen.
 * La tabla de la pestaña Algoritmos (Bloque 12) sale del mismo registro.
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

/** Columnas de la tabla resumen: [encabezado, campo del resumen]. */
const COLUMNAS_RESUMEN = [
  ['Llegada', 'llegada'],
  ['Algoritmo', 'nombre'],
  ['Complejidad promedio', 'complejidad'],
  ['Comparaciones', 'comparaciones'],
  ['Intercambios', 'intercambios'],
  ['Escrituras', 'escrituras'],
  ['Pasos', 'pasos'],
];

/**
 * Tabla con los contadores de cada algoritmo, en orden de llegada.
 *
 * @param {HTMLTableElement} tabla
 * @param {Object[]} resumen  Salida de escena.resumen (Bloque 09).
 */
export function pintarResumen(tabla, resumen) {
  tabla.replaceChildren();
  const encabezado = tabla.createTHead().insertRow();
  for (const [titulo] of COLUMNAS_RESUMEN) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = titulo;
    encabezado.append(th);
  }

  const cuerpo = tabla.createTBody();
  for (const fila of resumen) {
    const tr = cuerpo.insertRow();
    for (const [, campo] of COLUMNAS_RESUMEN) {
      const valor = fila[campo];
      tr.insertCell().textContent =
        campo === 'llegada' ? `${valor}.º` :
        typeof valor === 'number' ? valor.toLocaleString('es-MX') : valor;
    }
  }
}

/**
 * Tabla comparativa de los 8 algoritmos para la pestaña Algoritmos.
 *
 * @param {HTMLTableElement} tabla
 */
export function pintarTablaAlgoritmos(tabla) {
  const columnas = ['Algoritmo', 'Tipo', 'Mejor', 'Promedio', 'Peor', 'Espacio', 'Estable', 'Idea'];
  tabla.replaceChildren();
  const encabezado = tabla.createTHead().insertRow();
  for (const titulo of columnas) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = titulo;
    encabezado.append(th);
  }

  const cuerpo = tabla.createTBody();
  for (const a of Object.values(ALGORITMOS)) {
    const fila = cuerpo.insertRow();
    const tipo = a.categoria === 'fuerza-bruta' ? 'Fuerza bruta' : 'Divide y vencerás';
    for (const valor of [a.nombre, tipo, a.mejor, a.promedio, a.peor, a.espacio, a.estable, a.descripcion]) {
      fila.insertCell().textContent = valor;
    }
  }
}
