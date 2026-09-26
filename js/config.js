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
 * Tamaño de la lista. El usuario escribe el que quiera; TAMANO_MAX es solo
 * un tope técnico: con más elementos que píxeles las barras se enciman y la
 * animación de un algoritmo O(n²) duraría horas.
 */
export const TAMANO_MIN = 2;
export const TAMANO_MAX = 10000;
export const TAMANO_DEFECTO = 30;

/**
 * A partir de este tamaño se avisa que Stooge Sort tardará mucho: su
 * cantidad de pasos crece como n^2.71 (con 30 elementos ya son ~10 000).
 * Es solo un aviso; no limita el tamaño.
 */
export const LIMITE_STOOGE_VISUAL = 30;

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
