/**
 * js/ui/preferencias.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 12 — Preferencias guardadas en el navegador.
 *
 * Recuerda la selección de algoritmos, el tamaño y la velocidad
 * entre visitas (localStorage). Si el navegador bloquea el almacenamiento
 * (modo privado, permisos), la página funciona igual con los valores por
 * defecto: por eso todo va dentro de try/catch.
 */
import { CLAVE_PREFERENCIAS } from '../config.js';

/** @returns {{seleccionados?: string[], tamano?: number, velocidad?: number}|null} */
export function cargarPreferencias() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS));
    return guardado && typeof guardado === 'object' ? guardado : null;
  } catch {
    return null;
  }
}

/** @param {Object} preferencias */
export function guardarPreferencias(preferencias) {
  try {
    localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(preferencias));
  } catch {
    // Sin almacenamiento disponible: no se recuerdan, pero no es un error.
  }
}
