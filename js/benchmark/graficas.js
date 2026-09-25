/**
 * js/benchmark/graficas.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 11 — Gráficas y tabla del benchmark.
 *
 * Reproduce las cuatro gráficas de benchmark.py con Chart.js (copia local
 * en vendor/, cargada como script global `Chart` desde index.html):
 *   1. Stooge Sort solo
 *   2. Fuerza bruta sin Stooge
 *   3. Fuerza bruta vs Merge Sort
 *   4. Fuerza bruta vs Quick Sort
 */
import { ALGORITMOS } from '../algoritmos/index.js';

const FUERZA_BRUTA_SIN_STOOGE = ['selection', 'bubble', 'insertion', 'gnome', 'exchange'];

/** Las cuatro gráficas de benchmark.py; `destacado` se dibuja con línea más gruesa. */
export const GRUPOS_GRAFICAS = Object.freeze([
  { titulo: 'Stooge Sort (solo)', ids: ['stooge'] },
  { titulo: 'Fuerza bruta', ids: FUERZA_BRUTA_SIN_STOOGE },
  { titulo: 'Fuerza bruta vs Merge Sort', ids: [...FUERZA_BRUTA_SIN_STOOGE, 'merge'], destacado: 'merge' },
  { titulo: 'Fuerza bruta vs Quick Sort', ids: [...FUERZA_BRUTA_SIN_STOOGE, 'quick'], destacado: 'quick' },
]);

/** Mismos colores que COLORES de benchmark.py (paleta "tab" de matplotlib). */
const COLOR_ALGORITMO = Object.freeze({
  selection: '#1f77b4', // tab:blue
  bubble: '#ff7f0e',    // tab:orange
  insertion: '#8c564b', // tab:brown
  gnome: '#d62728',     // tab:red
  exchange: '#9467bd',  // tab:purple
  stooge: '#7f7f7f',    // tab:gray
  merge: '#2ca02c',     // tab:green
  quick: '#17becf',     // tab:cyan
});

/** Gráficas creadas en la última ejecución, para destruirlas antes de crear otras. */
let graficasActuales = [];

/**
 * Dibuja las cuatro gráficas. Si ya había gráficas, las reemplaza.
 *
 * @param {HTMLElement} contenedor
 * @param {Object} resultados  Salida del Worker (Bloque 10).
 */
export function dibujarGraficas(contenedor, resultados) {
  graficasActuales.forEach((g) => g.destroy());
  graficasActuales = [];
  contenedor.replaceChildren();

  // Colores de texto y rejilla desde el CSS, para que se lean en tema claro y oscuro.
  const estilos = getComputedStyle(document.documentElement);
  const colorTexto = estilos.getPropertyValue('--texto-suave').trim();
  const colorRejilla = estilos.getPropertyValue('--borde').trim();
  const ejes = (titulo) => ({
    title: { display: true, text: titulo, color: colorTexto },
    ticks: { color: colorTexto },
    grid: { color: colorRejilla },
  });

  for (const grupo of GRUPOS_GRAFICAS) {
    const caja = document.createElement('div');
    caja.className = 'grafica';
    const canvas = document.createElement('canvas');
    caja.append(canvas);
    contenedor.append(caja);

    const series = grupo.ids.map((id) => ({
      label: ALGORITMOS[id].nombre,
      data: resultados.tiempos[id],
      borderColor: COLOR_ALGORITMO[id],
      backgroundColor: COLOR_ALGORITMO[id],
      borderWidth: id === grupo.destacado ? 3 : 1.5,
      pointRadius: 3,
      spanGaps: false, // un tiempo omitido (null) deja un hueco en la línea
    }));

    graficasActuales.push(new window.Chart(canvas, {
      type: 'line',
      data: { labels: resultados.tamanos, datasets: series },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          title: { display: true, text: grupo.titulo, color: colorTexto, font: { size: 14 } },
          legend: { labels: { color: colorTexto, boxWidth: 12 } },
          tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y.toFixed(3)} ms` } },
        },
        scales: { x: ejes('Tamaño de entrada n'), y: { ...ejes('Tiempo de ejecución (ms)'), beginAtZero: true } },
      },
    }));
  }
}

/**
 * Tabla de tiempos: una fila por tamaño y una columna por algoritmo.
 *
 * @param {HTMLTableElement} tabla
 * @param {Object} resultados
 */
export function pintarTablaBench(tabla, resultados) {
  const ids = Object.keys(resultados.tiempos);
  tabla.replaceChildren();

  const encabezado = tabla.createTHead().insertRow();
  for (const titulo of ['n', ...ids.map((id) => `${ALGORITMOS[id].nombre} (ms)`)]) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = titulo;
    encabezado.append(th);
  }

  const cuerpo = tabla.createTBody();
  resultados.tamanos.forEach((n, k) => {
    const fila = cuerpo.insertRow();
    fila.insertCell().textContent = n;
    for (const id of ids) {
      const ms = resultados.tiempos[id][k];
      fila.insertCell().textContent = ms === null ? '—' : ms.toFixed(3);
    }
  });
}

/** Quita gráficas y tabla (al empezar una medición nueva). */
export function limpiarResultados(contenedor, tabla) {
  graficasActuales.forEach((g) => g.destroy());
  graficasActuales = [];
  contenedor.replaceChildren();
  tabla.replaceChildren();
}
