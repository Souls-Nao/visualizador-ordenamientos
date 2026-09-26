/**
 * js/ui/ventanaCrecimiento.js
 * ─────────────────────────────────────────────────────────────────────────
 * Ventana "Crecimiento" (requisito 8): la gráfica de la práctica en Python
 * (benchmark.py) dentro del visualizador.
 *
 * Muestra, para los algoritmos seleccionados, cómo crece el trabajo al
 * crecer n: una línea por algoritmo y, en modo comparaciones, las curvas
 * teóricas n log n y n² de fondo como referencia. Debajo, la tabla con
 * los datos. La medición está en js/core/crecimiento.js.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { CLASES } from './complejidad.js';
import {
  MEDIDAS, CRECIMIENTO_N_MIN, CRECIMIENTO_N_MAX, LIMITE_STOOGE_CRECIMIENTO, calcularCrecimiento,
} from '../core/crecimiento.js';

/** Un color por algoritmo: los mismos de COLORES en benchmark.py (paleta "tab"). */
export const COLOR_ALGORITMO = Object.freeze({
  selection: '#1f77b4', bubble: '#ff7f0e', insertion: '#8c564b', gnome: '#d62728',
  exchange: '#9467bd', stooge: '#7f7f7f', merge: '#2ca02c', quick: '#17becf',
});

/**
 * Tamaño sugerido al abrir: el de la lista actual, pero al menos 100 para
 * que se vea la forma. Con tiempo se sube a 1000: con listas pequeñas pesa
 * más el costo fijo de cada ejecución que el algoritmo, y las curvas salen
 * engañosas (Merge parecería más lento que Selection).
 */
const N_SUGERIDO_MIN = 100;
const N_SUGERIDO_TIEMPO = 1000;

const SVG = 'http://www.w3.org/2000/svg';
const ANCHO = 720;
const ALTO = 380;
const M = { izq: 72, der: 64, arr: 16, aba: 46 };

function nodo(nombre, atributos = {}, texto) {
  const el = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function formatear(valor, medida) {
  if (valor === null) return '—';
  return medida === MEDIDAS.TIEMPO
    ? `${valor.toFixed(valor < 1 ? 3 : 2)} ms`
    : Math.round(valor).toLocaleString('es-MX');
}

/**
 * Dibuja la gráfica de crecimiento en SVG.
 *
 * @param {Object} resultado  Salida de calcularCrecimiento.
 * @returns {SVGSVGElement}
 */
export function crearGraficaCrecimiento(resultado) {
  const { medida, tamanos, series } = resultado;
  const ids = Object.keys(series);
  const nMax = tamanos.at(-1);
  const valores = ids.flatMap((id) => series[id]).filter((v) => v !== null);
  const yMax = Math.max(...valores, 1e-9) * 1.1;

  const anchoUtil = ANCHO - M.izq - M.der;
  const altoUtil = ALTO - M.arr - M.aba;
  const x = (n) => M.izq + (n / nMax) * anchoUtil;
  const y = (v) => M.arr + altoUtil - (v / yMax) * altoUtil;
  const base = M.arr + altoUtil;

  const svg = nodo('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'grafica-crecimiento',
    role: 'img',
    'aria-label': `${medida === MEDIDAS.TIEMPO ? 'Tiempo' : 'Comparaciones'} según el tamaño de la lista`,
  });

  // Área de dibujo: lo que se salga (curvas teóricas muy altas) se recorta.
  const recorte = nodo('clipPath', { id: 'recorte-crecimiento' });
  recorte.append(nodo('rect', { x: M.izq, y: M.arr, width: anchoUtil, height: altoUtil }));
  svg.append(recorte);

  // Rejilla y eje Y (5 divisiones)
  for (let k = 0; k <= 5; k++) {
    const v = (yMax * k) / 5;
    svg.append(
      nodo('line', { x1: M.izq, y1: y(v), x2: M.izq + anchoUtil, y2: y(v), class: 'grafica-crecimiento__rejilla' }),
      nodo('text', { x: M.izq - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'grafica-crecimiento__texto' },
        formatear(v, medida).replace(' ms', '')),
    );
  }
  // Eje X con los tamaños medidos
  for (const n of tamanos) {
    svg.append(nodo('text', { x: x(n), y: base + 18, 'text-anchor': 'middle', class: 'grafica-crecimiento__texto' }, n));
  }
  svg.append(
    nodo('line', { x1: M.izq, y1: base, x2: M.izq + anchoUtil, y2: base, class: 'grafica-crecimiento__eje' }),
    nodo('text', { x: M.izq + anchoUtil / 2, y: ALTO - 6, 'text-anchor': 'middle', class: 'grafica-crecimiento__titulo' },
      'Tamaño de la lista (n)'),
    nodo('text', { x: 16, y: M.arr + altoUtil / 2, 'text-anchor': 'middle', class: 'grafica-crecimiento__titulo',
      transform: `rotate(-90 16 ${M.arr + altoUtil / 2})` },
      medida === MEDIDAS.TIEMPO ? 'Tiempo por ejecución (ms)' : 'Comparaciones'),
  );

  const zona = nodo('g', { 'clip-path': 'url(#recorte-crecimiento)' });
  svg.append(zona);

  // Curvas teóricas de referencia (solo con comparaciones: con ms no tienen la misma unidad).
  if (medida === MEDIDAS.COMPARACIONES) {
    const teoricas = ['O(n log n)', 'O(n²)'];
    if (ids.includes('stooge')) teoricas.push('O(n^2.71)');
    for (const notacion of teoricas) {
      const { f, etiqueta } = CLASES[notacion];
      const puntos = [];
      for (let k = 1; k <= 60; k++) {
        const n = (k / 60) * nMax;
        puntos.push(`${x(n).toFixed(1)},${y(f(Math.max(n, 1))).toFixed(1)}`);
      }
      zona.append(nodo('polyline', { points: puntos.join(' '), class: 'grafica-crecimiento__teorica' }));
      // Etiqueta donde la curva sale del área o al final, lo que ocurra antes.
      const nSalida = Math.min(nMax, ...Array.from({ length: 60 }, (_, k) => ((k + 1) / 60) * nMax)
        .filter((n) => f(n) > yMax));
      const yEtiqueta = Math.max(M.arr + 10, y(Math.min(f(nSalida), yMax)));
      svg.append(nodo('text', { x: Math.min(x(nSalida) + 4, M.izq + anchoUtil + 4), y: yEtiqueta,
        class: 'grafica-crecimiento__texto grafica-crecimiento__texto--teorica' }, etiqueta));
    }
  }

  // Una línea por algoritmo, con un punto por tamaño (al pasar el ratón muestra el valor).
  for (const id of ids) {
    const color = COLOR_ALGORITMO[id];
    const puntos = tamanos
      .map((n, k) => [n, series[id][k]])
      .filter(([, v]) => v !== null);
    zona.append(nodo('polyline', {
      points: puntos.map(([n, v]) => `${x(n).toFixed(1)},${y(v).toFixed(1)}`).join(' '),
      stroke: color,
      class: 'grafica-crecimiento__serie',
    }));
    for (const [n, v] of puntos) {
      const punto = nodo('circle', { cx: x(n), cy: y(v), r: 3.5, fill: color });
      punto.append(nodo('title', {}, `${ALGORITMOS[id].nombre} · n = ${n}: ${formatear(v, medida)}`));
      zona.append(punto);
    }
  }
  return svg;
}

/** Tabla con los datos de la gráfica: una fila por tamaño, una columna por algoritmo. */
export function pintarTablaCrecimiento(tabla, { medida, tamanos, series }) {
  const ids = Object.keys(series);
  tabla.replaceChildren();
  const encabezado = tabla.createTHead().insertRow();
  for (const titulo of ['n', ...ids.map((id) => ALGORITMOS[id].nombre)]) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = titulo;
    encabezado.append(th);
  }
  const cuerpo = tabla.createTBody();
  tamanos.forEach((n, k) => {
    const fila = cuerpo.insertRow();
    fila.insertCell().textContent = n;
    for (const id of ids) fila.insertCell().textContent = formatear(series[id][k], medida);
  });
}

/** Leyenda: color de cada algoritmo y, con comparaciones, las curvas de referencia. */
function crearLeyenda(ids, medida) {
  const leyenda = document.createElement('div');
  leyenda.className = 'leyenda leyenda--plana';
  for (const id of ids) {
    const item = document.createElement('span');
    item.className = 'leyenda__item';
    const muestra = document.createElement('span');
    muestra.className = 'leyenda__color';
    muestra.style.background = COLOR_ALGORITMO[id];
    item.append(muestra, ALGORITMOS[id].nombre);
    leyenda.append(item);
  }
  if (medida === MEDIDAS.COMPARACIONES) {
    const nota = document.createElement('span');
    nota.className = 'leyenda__item leyenda__nota';
    nota.textContent = 'Líneas punteadas: referencia n log n y n²';
    leyenda.append(nota);
  }
  return leyenda;
}

/**
 * Conecta el botón #btn-crecimiento con la ventana #dlg-crecimiento.
 *
 * @param {ReturnType<import('./escena.js').crearEscena>} escena
 */
export function iniciarVentanaCrecimiento(escena) {
  const $ = (id) => document.getElementById(id);
  const ventana = $('dlg-crecimiento');
  const inpN = $('inp-crecimiento-n');
  const selMedida = $('sel-medida');
  const btnCalcular = $('btn-calcular-crecimiento');
  const mensaje = $('lbl-crecimiento');
  const zonaGrafica = $('zona-grafica-crecimiento');
  const tabla = $('tabla-crecimiento');
  let ids = [];
  let calculo = 0; // identifica el cálculo en curso; uno nuevo invalida al anterior

  inpN.min = CRECIMIENTO_N_MIN;
  inpN.max = CRECIMIENTO_N_MAX;

  async function calcular() {
    const nMax = Number(inpN.value);
    if (!Number.isInteger(nMax) || nMax < CRECIMIENTO_N_MIN || nMax > CRECIMIENTO_N_MAX) {
      mensaje.textContent = `n debe ser un entero entre ${CRECIMIENTO_N_MIN} y ${CRECIMIENTO_N_MAX}.`;
      mensaje.classList.add('aviso--error');
      return;
    }
    const miCalculo = ++calculo;
    const medida = selMedida.value;
    mensaje.classList.remove('aviso--error');
    btnCalcular.disabled = true;

    const resultado = await calcularCrecimiento({
      ids, nMax, medida,
      alProgreso: (hecho, total) => {
        if (miCalculo === calculo) mensaje.textContent = `Calculando… ${hecho} de ${total} tamaños`;
      },
    });
    if (miCalculo !== calculo) return; // se pidió otro cálculo mientras tanto

    btnCalcular.disabled = false;
    zonaGrafica.replaceChildren(crearGraficaCrecimiento(resultado), crearLeyenda(ids, medida));
    pintarTablaCrecimiento(tabla, resultado);
    mensaje.textContent =
      'Cada punto ordena una lista aleatoria de tamaño n, la misma para todos los algoritmos. ' +
      (medida === MEDIDAS.TIEMPO
        ? 'El tiempo varía un poco entre ejecuciones y computadoras; la forma de las curvas se mantiene.'
        : 'Las comparaciones no dependen de la computadora, solo del algoritmo y de la lista.') +
      (resultado.omitidos.length ? ` Stooge Sort se omite con n > ${LIMITE_STOOGE_CRECIMIENTO}.` : '');
  }

  $('btn-crecimiento').addEventListener('click', () => {
    escena.pausar();
    const { seleccionados, listaBase } = escena.estado;
    ids = seleccionados.length ? seleccionados : Object.keys(ALGORITMOS);
    inpN.value = Math.min(CRECIMIENTO_N_MAX, Math.max(N_SUGERIDO_MIN, listaBase.length));
    zonaGrafica.replaceChildren();
    tabla.replaceChildren();
    ventana.showModal();
    calcular();
  });

  $('form-crecimiento').addEventListener('submit', (e) => {
    e.preventDefault();
    calcular();
  });
  selMedida.addEventListener('change', () => {
    if (selMedida.value === MEDIDAS.TIEMPO && Number(inpN.value) < N_SUGERIDO_TIEMPO) {
      inpN.value = N_SUGERIDO_TIEMPO;
    }
    calcular();
  });
  $('btn-cerrar-crecimiento').addEventListener('click', () => {
    calculo++; // descarta un cálculo en curso
    btnCalcular.disabled = false;
    ventana.close();
  });
}
