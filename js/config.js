/**
 * js/config.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 00 — Configuración de la interfaz.
 *
 * Límites y ajustes que usa la interfaz del visualizador y del benchmark.
 * Cada valor vive solo aquí: ningún otro módulo debe escribir estos números
 * a mano (ver BLOQUES.md, sección 3.2).
 *
 * Lo que NO está aquí, porque ya tiene su propio dueño:
 * - Tipos de evento y estados de color → js/core/eventos.js (Bloque 01).
 * - Rango de valores y patrones de datos → js/core/datos.js (Bloque 02).
 * - Colores concretos de las barras → js/render/canvasBarras.js (Bloque 04).
 *
 * No importa nada de otros módulos del proyecto.
 */

/**
 * Tamaño de la lista en el visualizador (sección 5.4 de la planeación).
 * El benchmark no usa estos límites: puede generar listas mucho mayores.
 */
export const TAMANO_MIN = 5;
export const TAMANO_MAX = 120;
export const TAMANO_DEFECTO = 30;

/**
 * Tamaño máximo con el que se permite animar Stooge Sort. Su cantidad de
 * pasos crece como n^2.7, así que con listas grandes la animación no
 * terminaría en un tiempo razonable.
 */
export const LIMITE_STOOGE_VISUAL = 30;

/**
 * Tamaño máximo con el que Stooge Sort entra al benchmark. Por encima de
 * este valor se omite y se avisa al usuario, para que la medición no tarde
 * minutos.
 */
export const LIMITE_STOOGE_BENCH = 500;

/**
 * Velocidad de la animación, en pasos (eventos) por segundo.
 * El deslizador usa una escala logarítmica entre el mínimo y el máximo
 * (Bloque 05), para que las velocidades lentas sean fáciles de elegir.
 */
export const VELOCIDAD_MIN = 1;
export const VELOCIDAD_MAX = 2000;
export const VELOCIDAD_DEFECTO = 20;

/**
 * Tope de pasos que el reproductor ejecuta en un solo cuadro de animación.
 * Evita que la página se congele si el navegador tarda en dibujar un cuadro
 * y el acumulador de tiempo crece de golpe.
 */
export const MAX_PASOS_POR_CUADRO = 5000;

/** Clave de localStorage donde se guardan las preferencias (Bloque 12). */
export const CLAVE_PREFERENCIAS = 'vo.preferencias';

/** Enlaces del proyecto que se muestran en la página. */
export const ENLACES = Object.freeze({
  repositorio: 'https://github.com/Souls-Nao/visualizador-ordenamientos',
  tablero: 'https://github.com/users/Souls-Nao/projects/2/views/1',
  sitio: 'https://souls-nao.github.io/visualizador-ordenamientos/',
});
