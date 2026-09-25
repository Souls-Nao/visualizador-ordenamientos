/**
 * js/main.js
 * ─────────────────────────────────────────────────────────────────────────
 * Punto de montaje de la aplicación.
 *
 * Es el único script que carga index.html. No contiene lógica propia: solo
 * arranca los módulos de cada bloque en orden. Cada bloque nuevo agrega aquí
 * su inicialización (ver BLOQUES.md, regla 1).
 */
import { ENLACES } from './config.js';
import { iniciarPestanas } from './ui/pestanas.js';
import { crearPanelCodigo } from './ui/panelCodigo.js';

// Bloque 00 — Base y navegación.
iniciarPestanas();
document.getElementById('enlace-repo').href = ENLACES.repositorio;
document.getElementById('enlace-tablero').href = ENLACES.tablero;

// Bloque 06 — Panel de código. B08 decide qué algoritmo mostrar y qué línea resaltar.
const panelCodigo = crearPanelCodigo();
panelCodigo.mostrar('bubble');
