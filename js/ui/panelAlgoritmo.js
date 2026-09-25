/**
 * js/ui/panelAlgoritmo.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Panel de un algoritmo.
 *
 * Une las piezas de los bloques anteriores para UN algoritmo:
 *   generador (B03) → evento → espejo (B04) + contadores (B07) → canvas (B04)
 *
 * El reproductor (B05) no se crea aquí: la escena llama a `avanzar(n)` en
 * cada cuadro, así varios paneles pueden avanzar al mismo ritmo.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { crearEspejo, aplicarEvento } from '../render/espejo.js';
import { crearCanvasBarras } from '../render/canvasBarras.js';
import { crearContadores, registrarEvento, describirEvento } from '../core/metricas.js';

const MENSAJE_INICIAL = 'Listo para empezar.';

/**
 * Crea el panel dentro de `contenedor`.
 *
 * @param {Object} opciones
 * @param {HTMLElement} opciones.contenedor
 * @param {string} opciones.id                 Clave de ALGORITMOS.
 * @param {number[]} opciones.lista            Lista inicial (no se modifica).
 * @param {(id: string) => void} [opciones.alSeleccionar]  Clic en el panel.
 */
export function crearPanelAlgoritmo({ contenedor, id, lista, alSeleccionar = () => {} }) {
  const { nombre, generador: crearGenerador, promedio } = ALGORITMOS[id];

  // ── Estructura del panel (clases de BLOQUES.md 3.4) ──
  const panel = document.createElement('article');
  panel.className = 'panel';
  panel.tabIndex = 0;
  panel.setAttribute('aria-label', nombre);
  panel.innerHTML = `
    <header class="panel__cabecera">
      <h2 class="panel__titulo"></h2>
      <span class="panel__complejidad" title="Complejidad promedio"></span>
    </header>
    <canvas class="panel__lienzo"></canvas>
    <dl class="panel__contadores">
      <div><dt>Comparaciones</dt><dd data-contador="comparaciones">0</dd></div>
      <div><dt>Movimientos</dt><dd data-contador="movimientos">0</dd></div>
      <div><dt>Pasos</dt><dd data-contador="pasos">0</dd></div>
    </dl>
    <p class="panel__mensaje" aria-live="off"></p>`;
  panel.querySelector('.panel__titulo').textContent = nombre;
  panel.querySelector('.panel__complejidad').textContent = promedio;
  contenedor.append(panel);

  const salidaContadores = [...panel.querySelectorAll('[data-contador]')];
  const salidaMensaje = panel.querySelector('.panel__mensaje');
  const lienzo = crearCanvasBarras(panel.querySelector('.panel__lienzo'));

  panel.addEventListener('click', () => alSeleccionar(id));
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') alSeleccionar(id);
  });

  // ── Estado de la ejecución ──
  let generador;
  let espejo;
  let contadores;
  let linea = null;
  let mensaje = MENSAJE_INICIAL;

  function pintar() {
    lienzo.dibujar(espejo);
    for (const salida of salidaContadores) {
      salida.textContent = contadores[salida.dataset.contador].toLocaleString('es-MX');
    }
    salidaMensaje.textContent = mensaje;
    panel.classList.toggle('panel--terminado', espejo.terminado);
  }

  /** Vuelve a empezar con una lista (la misma u otra). */
  function reiniciar(nuevaLista) {
    generador = crearGenerador(nuevaLista);
    espejo = crearEspejo(nuevaLista);
    contadores = crearContadores();
    linea = null;
    mensaje = MENSAJE_INICIAL;
    pintar();
  }

  /**
   * Consume hasta n eventos y dibuja una sola vez al final.
   *
   * @param {number} n
   * @returns {boolean} true si todavía quedan eventos.
   */
  function avanzar(n) {
    for (let k = 0; k < n && !espejo.terminado; k++) {
      const { value: evento, done } = generador.next();
      if (done) break;
      // El mensaje se arma antes de aplicar, para mostrar los valores previos.
      mensaje = describirEvento(evento, espejo.valores);
      aplicarEvento(espejo, evento);
      registrarEvento(contadores, evento);
      if (evento.line) linea = evento.line;
    }
    pintar();
    return !espejo.terminado;
  }

  reiniciar(lista);

  return {
    id,
    avanzar,
    reiniciar,
    setActivo(activo) {
      panel.classList.toggle('panel--activo', activo);
    },
    get terminado() {
      return espejo.terminado;
    },
    get contadores() {
      return { ...contadores };
    },
    get linea() {
      return linea;
    },
    destruir() {
      lienzo.destruir();
      panel.remove();
    },
  };
}
