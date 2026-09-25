/**
 * js/motor/reproductor.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 05 — Reproductor y control de velocidad.
 *
 * Es el reloj de la animación. No conoce algoritmos, paneles ni canvas:
 * en cada cuadro calcula cuántos pasos tocan según la velocidad (pasos por
 * segundo) y se los pide a quien lo creó con `alAvanzar(n)`.
 *
 * Por qué un acumulador: el navegador dibuja unos 60 cuadros por segundo.
 * A 5 pasos/s toca un paso cada 12 cuadros; a 2000 pasos/s tocan ~33 por
 * cuadro. El acumulador suma el tiempo transcurrido y convierte en pasos
 * solo la parte entera, así ambas velocidades salen exactas sin usar
 * setTimeout con retardos.
 */
import {
  VELOCIDAD_MIN,
  VELOCIDAD_MAX,
  VELOCIDAD_DEFECTO,
  MAX_PASOS_POR_CUADRO,
} from '../config.js';

/** Estados posibles del reproductor. */
export const ESTADOS_REPRODUCTOR = Object.freeze({
  DETENIDO: 'detenido',
  REPRODUCIENDO: 'reproduciendo',
  PAUSADO: 'pausado',
  TERMINADO: 'terminado',
});

/**
 * Si la pestaña estuvo oculta, el siguiente cuadro puede llegar segundos
 * después. Se limita el tiempo por cuadro para no ejecutar de golpe todos
 * los pasos "atrasados".
 */
const MAX_MS_POR_CUADRO = 100;

/**
 * Convierte la posición del deslizador (0 a 100) en pasos por segundo, con
 * escala logarítmica: la mitad del recorrido cubre de 1 a ~45 pasos/s, que
 * es donde se sigue cada operación a simple vista.
 *
 * @param {number} t  Posición del deslizador, de 0 a 100.
 * @returns {number}  Pasos por segundo, entero entre VELOCIDAD_MIN y VELOCIDAD_MAX.
 */
export function velocidadDesdeSlider(t) {
  const razon = VELOCIDAD_MAX / VELOCIDAD_MIN;
  return Math.round(VELOCIDAD_MIN * razon ** (t / 100));
}

/**
 * Operación inversa de velocidadDesdeSlider.
 *
 * @param {number} pps  Pasos por segundo.
 * @returns {number}    Posición del deslizador, de 0 a 100.
 */
export function sliderDesdeVelocidad(pps) {
  const razon = VELOCIDAD_MAX / VELOCIDAD_MIN;
  return Math.round((100 * Math.log(pps / VELOCIDAD_MIN)) / Math.log(razon));
}

/**
 * Crea un reproductor.
 *
 * @param {Object} opciones
 * @param {(n: number) => boolean} opciones.alAvanzar
 *   Ejecuta n pasos. Devuelve true si todavía queda trabajo.
 * @param {(estado: string) => void} [opciones.alCambiarEstado]
 *   Avisa cada cambio de estado (para habilitar o deshabilitar botones).
 */
export function crearReproductor({ alAvanzar, alCambiarEstado = () => {} }) {
  let estado = ESTADOS_REPRODUCTOR.DETENIDO;
  let velocidad = VELOCIDAD_DEFECTO;
  let acumulado = 0;
  let ultimoTiempo = 0;
  let idCuadro = null;

  function cambiarEstado(nuevo) {
    if (nuevo === estado) return;
    estado = nuevo;
    alCambiarEstado(estado);
  }

  function cancelarCuadro() {
    if (idCuadro !== null) cancelAnimationFrame(idCuadro);
    idCuadro = null;
  }

  /** Pide n pasos y detecta el final. */
  function avanzar(n) {
    if (!alAvanzar(n)) {
      cancelarCuadro();
      cambiarEstado(ESTADOS_REPRODUCTOR.TERMINADO);
    }
  }

  function cuadro(ahora) {
    const dt = Math.min(ahora - ultimoTiempo, MAX_MS_POR_CUADRO);
    ultimoTiempo = ahora;

    acumulado += (dt * velocidad) / 1000;
    const n = Math.min(Math.floor(acumulado), MAX_PASOS_POR_CUADRO);
    acumulado -= n;

    idCuadro = requestAnimationFrame(cuadro);
    if (n > 0) avanzar(n);
  }

  return {
    /** Empieza o continúa la animación. No hace nada si ya terminó. */
    reproducir() {
      if (estado === ESTADOS_REPRODUCTOR.REPRODUCIENDO || estado === ESTADOS_REPRODUCTOR.TERMINADO) return;
      cambiarEstado(ESTADOS_REPRODUCTOR.REPRODUCIENDO);
      ultimoTiempo = performance.now();
      idCuadro = requestAnimationFrame(cuadro);
    },

    /** Detiene la animación conservando el punto donde va. */
    pausar() {
      if (estado !== ESTADOS_REPRODUCTOR.REPRODUCIENDO) return;
      cancelarCuadro();
      cambiarEstado(ESTADOS_REPRODUCTOR.PAUSADO);
    },

    /** Pausa (si estaba reproduciendo) y ejecuta exactamente un paso. */
    paso() {
      if (estado === ESTADOS_REPRODUCTOR.TERMINADO) return;
      cancelarCuadro();
      cambiarEstado(ESTADOS_REPRODUCTOR.PAUSADO);
      avanzar(1);
    },

    /** Vuelve al estado inicial. Quien lo llama reinicia sus datos. */
    detener() {
      cancelarCuadro();
      acumulado = 0;
      cambiarEstado(ESTADOS_REPRODUCTOR.DETENIDO);
    },

    /** @param {number} pps  Pasos por segundo; se ajusta al rango permitido. */
    setVelocidad(pps) {
      velocidad = Math.min(VELOCIDAD_MAX, Math.max(VELOCIDAD_MIN, pps));
    },

    get estado() {
      return estado;
    },

    get velocidad() {
      return velocidad;
    },
  };
}
