/**
 * js/core/datos.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 02 — Generación de datos de entrada.
 *
 * Genera los arreglos de números que se ordenan, tanto para el visualizador
 * como (más adelante) para el benchmark. Este módulo no sabe nada de
 * algoritmos, del DOM ni de límites de la interfaz: solo sabe construir
 * arreglos según un patrón. Los límites de tamaño del visualizador
 * (5 a 120 elementos, sección 5.4 del entregable de planeación) se validan
 * en la UI que llame a este módulo (Bloque 08/09), no aquí, porque el
 * benchmark (Bloque 10/11) necesita generar arreglos mucho más grandes.
 *
 * No importa nada de otros módulos del proyecto.
 */

/**
 * Rango de valores de cada elemento del arreglo. Se usa el mismo rango que
 * `generar_lista(n, 0, 10000)` en `benchmark.py`, para que los datos de
 * prueba sean equivalentes a los de la práctica original.
 *
 * @type {Readonly<{minimo: number, maximo: number}>}
 */
export const RANGO_VALORES = Object.freeze({ minimo: 0, maximo: 10000 });

/**
 * Patrones de datos disponibles.
 *
 * - ALEATORIA:     valores en orden aleatorio, sin ningún orden particular.
 * - ORDENADA:      valores de menor a mayor (mejor caso de varios algoritmos).
 * - INVERTIDA:      valores de mayor a menor (peor caso de varios algoritmos).
 * - CASI_ORDENADA: mayormente ordenada, con unos pocos elementos fuera de
 *                  lugar (caso intermedio, útil para ver algoritmos como
 *                  Insertion Sort o Gnome Sort comportarse mejor que en el
 *                  peor caso).
 *
 * @type {Readonly<Record<string, string>>}
 */
export const PATRONES = Object.freeze({
  ALEATORIA: 'aleatoria',
  ORDENADA: 'ordenada',
  INVERTIDA: 'invertida',
  CASI_ORDENADA: 'casi-ordenada',
});

/**
 * Fracción de elementos que se desordenan al construir el patrón
 * "casi ordenada". Con n = 20 esto desordena 1 elemento; con n = 100,
 * desordena 5. Nunca menos de un intercambio (para que el patrón nunca se
 * vea igual que "ordenada").
 *
 * @type {number}
 */
const FRACCION_DESORDEN_CASI_ORDENADA = 0.05;

/**
 * Genera `n` valores enteros aleatorios dentro de `RANGO_VALORES`.
 * Es el paso base del que parten los cuatro patrones: primero se generan
 * los valores, y después se acomodan según el patrón pedido.
 *
 * @param {number} n
 * @returns {number[]}
 */
function generarValoresAleatorios(n) {
  const { minimo, maximo } = RANGO_VALORES;
  const valores = new Array(n);
  for (let i = 0; i < n; i++) {
    valores[i] = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
  }
  return valores;
}

/**
 * Toma un arreglo ya ordenado y le hace unos pocos intercambios aleatorios,
 * para producir el patrón "casi ordenada". No modifica el arreglo recibido:
 * devuelve una copia.
 *
 * @param {number[]} arregloOrdenado
 * @returns {number[]}
 */
function desordenarUnPoco(arregloOrdenado) {
  const arr = [...arregloOrdenado];
  const n = arr.length;
  const intercambios = Math.max(1, Math.round(n * FRACCION_DESORDEN_CASI_ORDENADA));

  for (let k = 0; k < intercambios; k++) {
    const i = Math.floor(Math.random() * n);
    const j = Math.floor(Math.random() * n);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * Genera un arreglo de `n` elementos siguiendo el patrón indicado.
 *
 * @param {number} n        Cantidad de elementos. Debe ser un entero >= 0;
 *                            los límites de negocio (5 a 120 en el
 *                            visualizador) los valida quien llama a esta
 *                            función, no esta función.
 * @param {string} patron    Uno de los valores de {@link PATRONES}.
 * @returns {number[]}
 * @throws {RangeError} si `n` no es un entero >= 0.
 * @throws {Error}      si `patron` no es un patrón reconocido.
 */
export function generarDatos(n, patron) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`generarDatos: n debe ser un entero >= 0 (recibido: ${n})`);
  }

  switch (patron) {
    case PATRONES.ALEATORIA:
      return generarValoresAleatorios(n);

    case PATRONES.ORDENADA:
      return generarValoresAleatorios(n).sort((a, b) => a - b);

    case PATRONES.INVERTIDA:
      return generarValoresAleatorios(n).sort((a, b) => b - a);

    case PATRONES.CASI_ORDENADA: {
      const ordenado = generarValoresAleatorios(n).sort((a, b) => a - b);
      return desordenarUnPoco(ordenado);
    }

    default:
      throw new Error(`generarDatos: patrón no reconocido "${patron}"`);
  }
}