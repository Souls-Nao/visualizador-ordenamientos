/**
 * js/render/canvasBarras.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 04 — Dibujo de las barras en un <canvas>.
 *
 * Recibe un espejo (render/espejo.js) y dibuja una barra por posición, con
 * altura proporcional a su valor y color según su estado. No sabe nada de
 * algoritmos ni de eventos.
 *
 * El canvas se ajusta solo a su tamaño en pantalla (ResizeObserver) y a la
 * densidad de píxeles del dispositivo, para que las barras se vean nítidas.
 */
import { ESTADOS_COLOR } from '../core/eventos.js';

/**
 * Color de cada estado (sección 5.4 de la planeación). Es la única fuente
 * de estos colores: la leyenda de la interfaz también se genera desde aquí.
 */
export const COLORES = Object.freeze({
  [ESTADOS_COLOR.SIN_TOCAR]: '#3b82f6',   // azul
  [ESTADOS_COLOR.COMPARANDO]: '#facc15',  // amarillo
  [ESTADOS_COLOR.INTERCAMBIO]: '#ef4444', // rojo
  [ESTADOS_COLOR.PIVOTE]: '#a855f7',      // morado
  [ESTADOS_COLOR.ORDENADO]: '#22c55e',    // verde
});

/** Nombre de cada estado para mostrar en la leyenda. */
export const NOMBRES_ESTADO = Object.freeze({
  [ESTADOS_COLOR.SIN_TOCAR]: 'Sin tocar',
  [ESTADOS_COLOR.COMPARANDO]: 'Comparando',
  [ESTADOS_COLOR.INTERCAMBIO]: 'Intercambio o escritura',
  [ESTADOS_COLOR.PIVOTE]: 'Pivote',
  [ESTADOS_COLOR.ORDENADO]: 'Ordenado',
});

/** Separación entre barras, en píxeles de pantalla, cuando caben. */
const SEPARACION = 1;

/**
 * Prepara un canvas para dibujar barras.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {{ dibujar(espejo): void, redimensionar(): void, destruir(): void }}
 */
export function crearCanvasBarras(canvas) {
  const ctx = canvas.getContext('2d');
  let ultimoEspejo = null;

  function redimensionar() {
    const escala = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * escala));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * escala));
    if (ultimoEspejo) dibujar(ultimoEspejo);
  }

  /**
   * Dibuja el estado actual del espejo.
   *
   * @param {import('./espejo.js').Espejo} espejo
   */
  function dibujar(espejo) {
    ultimoEspejo = espejo;
    const { valores, estados } = espejo;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const n = valores.length;
    if (n === 0) return;

    // Altura relativa al mayor valor de la lista: siempre ocupa el alto completo.
    const maximo = Math.max(...valores, 1);
    const escala = window.devicePixelRatio || 1;
    const anchoBarra = width / n;
    const hueco = anchoBarra > 4 * escala ? SEPARACION * escala : 0;
    const alturaMinima = 2 * escala;

    for (let i = 0; i < n; i++) {
      const alto = Math.max(alturaMinima, (valores[i] / maximo) * height);
      ctx.fillStyle = COLORES[estados[i]];
      ctx.fillRect(i * anchoBarra, height - alto, anchoBarra - hueco, alto);
    }
  }

  const observador = new ResizeObserver(redimensionar);
  observador.observe(canvas);
  redimensionar();

  return {
    dibujar,
    redimensionar,
    destruir() {
      observador.disconnect();
    },
  };
}
