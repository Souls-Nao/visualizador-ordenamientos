/**
 * js/ui/graficaCrecimiento.js
 * ─────────────────────────────────────────────────────────────────────────
 * Gráfica "Crecimiento según el tamaño" (requisito 8): la gráfica de la
 * práctica en Python (benchmark.py) dentro del visualizador.
 *
 * Aparece debajo cuando terminan todos los algoritmos. Usa prefijos del
 * mismo arreglo de las barras (core/crecimiento.js): una línea por
 * algoritmo y, en modo comparaciones, las curvas teóricas n log n y n² de
 * fondo. El último punto, resaltado, es la ejecución que se acaba de ver.
 * Debajo va la tabla con los datos.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { CLASES } from './complejidad.js';
import {
  MEDIDAS, CRECIMIENTO_N_MAX, LIMITE_STOOGE_CRECIMIENTO, calcularCrecimiento,
} from '../core/crecimiento.js';

/** Un color por algoritmo: los mismos de COLORES en benchmark.py (paleta "tab"). */
export const COLOR_ALGORITMO = Object.freeze({
  selection: '#1f77b4', bubble: '#ff7f0e', insertion: '#8c564b', gnome: '#d62728',
  exchange: '#9467bd', stooge: '#7f7f7f', merge: '#2ca02c', quick: '#17becf',
});

/**
 * Con listas pequeñas el tiempo lo domina el costo fijo de cada ejecución
 * y las curvas de tiempo salen engañosas; por debajo de esto se avisa.
 */
const N_TIEMPO_CONFIABLE = 500;

const SVG = 'http://www.w3.org/2000/svg';
const ANCHO = 720;
const ALTO = 380;
const M = { izq: 72, der: 64, arr: 16, aba: 46 };

/** Crea un elemento SVG con sus atributos. También lo usa graficaVivo.js. */
export function nodo(nombre, atributos = {}, texto) {
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
      // El último tamaño es la ejecución que se animó: su punto va más grande.
      const esActual = n === nMax;
      const punto = nodo('circle', {
        cx: x(n), cy: y(v), r: esActual ? 6 : 3.5, fill: color,
        class: esActual ? 'grafica-crecimiento__actual' : '',
      });
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

/**
 * Leyenda con el color de cada algoritmo y una nota opcional.
 * También la usa graficaVivo.js.
 */
export function crearLeyenda(ids, nota) {
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
  if (nota) {
    const texto = document.createElement('span');
    texto.className = 'leyenda__item leyenda__nota';
    texto.textContent = nota;
    leyenda.append(texto);
  }
  return leyenda;
}

/**
 * Controla la tarjeta de crecimiento: se muestra al terminar todos los
 * algoritmos y se oculta al volver a empezar. El selector de medida vuelve
 * a calcular con los mismos datos.
 *
 * @param {Object} elementos
 * @param {HTMLElement} elementos.zona         Donde va la gráfica.
 * @param {HTMLTableElement} elementos.tabla
 * @param {HTMLSelectElement} elementos.selMedida
 * @param {HTMLElement} elementos.mensaje
 * @returns {{ mostrar(ids: string[], lista: number[]): void, ocultar(): void }}
 */
export function crearSeccionCrecimiento({ zona, tabla, selMedida, mensaje }) {
  const MENSAJE_INICIAL = 'Aparece cuando terminan todos los algoritmos.';
  let ids = [];
  let lista = [];
  let calculo = 0; // identifica el cálculo en curso; uno nuevo invalida al anterior

  function limpiar(texto) {
    zona.replaceChildren();
    tabla.replaceChildren();
    mensaje.textContent = texto;
  }

  async function calcular() {
    if (!ids.length) return;
    const miCalculo = ++calculo;
    const medida = selMedida.value;
    const resultado = await calcularCrecimiento({
      ids, lista, medida,
      alProgreso: (hecho, total) => {
        if (miCalculo === calculo) mensaje.textContent = `Calculando… ${hecho} de ${total} tamaños`;
      },
    });
    if (miCalculo !== calculo) return; // se reinició o se pidió otra medida mientras tanto

    const notas = ['Cada tamaño n usa los primeros n elementos de tu lista; el punto grande es la ejecución que viste.'];
    if (resultado.recortada) notas.push(`Se miden hasta los primeros ${CRECIMIENTO_N_MAX} elementos.`);
    if (medida === MEDIDAS.TIEMPO && lista.length < N_TIEMPO_CONFIABLE) {
      notas.push(`Con menos de ${N_TIEMPO_CONFIABLE} elementos el tiempo es poco confiable (domina el costo fijo de cada ejecución); las comparaciones muestran mejor la complejidad.`);
    }
    if (resultado.omitidos.length) notas.push(`Stooge Sort se omite con n > ${LIMITE_STOOGE_CRECIMIENTO}.`);

    zona.replaceChildren(
      crearGraficaCrecimiento(resultado),
      crearLeyenda(ids, medida === MEDIDAS.COMPARACIONES ? 'Punteadas: referencia n log n y n²' : null),
    );
    pintarTablaCrecimiento(tabla, resultado);
    mensaje.textContent = notas.join(' ');
  }

  selMedida.addEventListener('change', calcular);
  limpiar(MENSAJE_INICIAL);

  return {
    mostrar(nuevosIds, nuevaLista) {
      ids = [...nuevosIds];
      lista = [...nuevaLista];
      calcular();
    },
    ocultar() {
      calculo++; // descarta un cálculo en curso
      ids = [];
      limpiar(MENSAJE_INICIAL);
    },
  };
}
