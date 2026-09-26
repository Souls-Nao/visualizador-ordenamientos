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
 * La complejidad se muestra con su color y con una gráfica de crecimiento
 * (complejidad.js).
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { COLORES, NOMBRES_ESTADO } from '../render/canvasBarras.js';
import {
  CLASES, claseDe, crearEtiquetaComplejidad, crearGraficaComplejidad, estimarOperaciones,
} from './complejidad.js';

const formato = (v) => v.toLocaleString('es-MX');

/**
 * @param {HTMLElement} contenedor
 * @param {string} id
 * @param {number} n  Tamaño de la lista actual, para la gráfica de complejidad.
 */
export function pintarFicha(contenedor, id, n) {
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
    const celda = fila.insertCell();
    if (CLASES[valor]) celda.append(crearEtiquetaComplejidad(valor));
    else celda.textContent = valor;
  }

  const descripcion = document.createElement('p');
  descripcion.textContent = a.descripcion;

  // ¿Cómo crece? Gráfica de 1 a n con la complejidad del algoritmo resaltada.
  const subtitulo = document.createElement('h4');
  subtitulo.textContent = '¿Cómo crece el trabajo?';
  const explicacion = document.createElement('p');
  explicacion.className = 'ficha__nota';
  const clase = claseDe(a.promedio);
  explicacion.textContent =
    `Con tu lista (n = ${n}), ${clase.etiqueta} ≈ ${formato(estimarOperaciones(id, n))} operaciones. ` +
    'La línea gruesa es el caso promedio' + (a.peor !== a.promedio ? ' y la punteada, el peor caso.' : '.');

  contenedor.replaceChildren(titulo, tabla, descripcion, subtitulo,
    crearGraficaComplejidad(id, n), explicacion);
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
  ['Esperado para n', 'esperado'],
  ['Comparaciones', 'comparaciones'],
  ['Intercambios', 'intercambios'],
  ['Escrituras', 'escrituras'],
  ['Pasos', 'pasos'],
];

/**
 * Tabla con los contadores de cada algoritmo, en orden de llegada.
 *
 * "Esperado para n" es el valor de la fórmula de complejidad con el tamaño
 * de la lista, para compararlo con las comparaciones reales.
 *
 * @param {HTMLTableElement} tabla
 * @param {Object[]} resumen  Salida de escena.resumen (Bloque 09).
 * @param {number} n          Tamaño de la lista.
 */
export function pintarResumen(tabla, resumen, n) {
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
      const celda = tr.insertCell();
      const valor = fila[campo];
      if (campo === 'llegada') celda.textContent = `${valor}.º`;
      else if (campo === 'complejidad') celda.append(crearEtiquetaComplejidad(valor));
      else if (campo === 'esperado') {
        celda.textContent = `${claseDe(fila.complejidad).etiqueta} ≈ ${formato(estimarOperaciones(fila.id, n))}`;
      } else celda.textContent = typeof valor === 'number' ? formato(valor) : valor;
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
    fila.insertCell().textContent = a.nombre;
    fila.insertCell().textContent = tipo;
    for (const notacion of [a.mejor, a.promedio, a.peor]) {
      fila.insertCell().append(crearEtiquetaComplejidad(notacion));
    }
    for (const valor of [a.espacio, a.estable, a.descripcion]) fila.insertCell().textContent = valor;
  }
}
