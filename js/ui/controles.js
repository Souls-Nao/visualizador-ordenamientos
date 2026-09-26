/**
 * js/ui/controles.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Controles del visualizador.
 *
 * Conecta los elementos de index.html (IDs de BLOQUES.md 3.3) con la escena.
 * Todos / Ninguno marcan o desmarcan todas las casillas (Bloque 09).
 * La selección, el tamaño y la velocidad se recuerdan entre visitas
 * (Bloque 12, preferencias.js).
 *
 * El tamaño de la lista es libre (entero entre TAMANO_MIN y TAMANO_MAX) y
 * los datos siempre son aleatorios. Con Stooge Sort y listas grandes solo
 * se avisa que tardará mucho.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { PATRONES } from '../core/datos.js';
import {
  TAMANO_MIN, TAMANO_MAX, TAMANO_DEFECTO, LIMITE_STOOGE_VISUAL, VELOCIDAD_DEFECTO,
} from '../config.js';
import { ESTADOS_REPRODUCTOR, velocidadDesdeSlider, sliderDesdeVelocidad } from '../motor/reproductor.js';
import { cargarPreferencias, guardarPreferencias } from './preferencias.js';

/** Algoritmo marcado al abrir la página. */
const SELECCION_INICIAL = ['bubble'];

/**
 * @param {ReturnType<import('./escena.js').crearEscena>} escena
 * @returns {{ actualizarBotones(): void }}
 */
export function iniciarControles(escena) {
  const $ = (id) => document.getElementById(id);
  const inpTamano = $('inp-tamano');
  const inpVelocidad = $('inp-velocidad');
  const lblVelocidad = $('lbl-velocidad');
  const lblAviso = $('lbl-aviso');
  const botones = {
    reproducir: $('btn-reproducir'),
    pausar: $('btn-pausar'),
    paso: $('btn-paso'),
    reiniciar: $('btn-reiniciar'),
  };

  // Preferencias de la visita anterior; se ignora lo que ya no sea válido.
  const prefs = cargarPreferencias() ?? {};
  const seleccionInicial = Array.isArray(prefs.seleccionados)
    ? prefs.seleccionados.filter((id) => id in ALGORITMOS)
    : SELECCION_INICIAL;

  // ── Casillas de algoritmos, generadas desde el registro ──
  const casillas = Object.entries(ALGORITMOS).map(([id, { nombre }]) => {
    const etiqueta = document.createElement('label');
    etiqueta.className = 'casilla';
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.value = id;
    casilla.checked = seleccionInicial.includes(id);
    etiqueta.append(casilla, nombre);
    return etiqueta;
  });
  $('zona-seleccion').replaceChildren(...casillas);
  const seleccionados = () =>
    casillas.map((e) => e.firstChild).filter((c) => c.checked).map((c) => c.value);

  // ── Tamaño de la lista y velocidad en uso ──
  let tamanoActual = TAMANO_DEFECTO;
  let velocidadActual = Number(prefs.velocidad) || VELOCIDAD_DEFECTO;

  function mostrarAviso(texto, esError = false) {
    lblAviso.textContent = texto ?? '';
    lblAviso.classList.toggle('oculto', !texto);
    lblAviso.classList.toggle('aviso--error', esError);
  }

  /** Aviso informativo si Stooge está marcado con una lista grande. */
  function revisarStooge() {
    const lento = seleccionados().includes('stooge') && tamanoActual > LIMITE_STOOGE_VISUAL;
    mostrarAviso(lento
      ? `Stooge Sort crece como n^2.71: con ${tamanoActual} elementos hará cerca de ` +
        `${Math.round(tamanoActual ** 2.71).toLocaleString('es-MX')} pasos y puede tardar mucho. ` +
        'Sube la velocidad o usa una lista más pequeña.'
      : null);
  }

  /**
   * Lee el tamaño escrito. Si no es válido, muestra el motivo, restaura el
   * anterior y devuelve null.
   */
  function leerTamano() {
    const n = Number(inpTamano.value);
    if (!Number.isInteger(n) || n < TAMANO_MIN || n > TAMANO_MAX) {
      mostrarAviso(`El tamaño debe ser un número entero entre ${TAMANO_MIN} y ` +
        `${TAMANO_MAX.toLocaleString('es-MX')}.`, true);
      inpTamano.value = tamanoActual;
      return null;
    }
    return n;
  }

  function nuevaLista() {
    const n = leerTamano();
    if (n === null) return;
    tamanoActual = n;
    escena.nuevaLista(n, PATRONES.ALEATORIA);
    revisarStooge();
    actualizarBotones();
    guardar();
  }

  function guardar() {
    guardarPreferencias({
      seleccionados: seleccionados(),
      tamano: tamanoActual,
      velocidad: velocidadActual,
    });
  }

  // ── Botones según el estado del reproductor ──
  function actualizarBotones() {
    const { reproductor, seleccionados: ids } = escena.estado;
    const hayPaneles = ids.length > 0;
    const terminado = reproductor === ESTADOS_REPRODUCTOR.TERMINADO;
    botones.reproducir.disabled = !hayPaneles || terminado || reproductor === ESTADOS_REPRODUCTOR.REPRODUCIENDO;
    botones.pausar.disabled = reproductor !== ESTADOS_REPRODUCTOR.REPRODUCIENDO;
    botones.paso.disabled = !hayPaneles || terminado;
    botones.reiniciar.disabled = !hayPaneles;
  }

  // ── Eventos ──
  /** Aplica la selección actual de casillas a la escena (misma lista). */
  function aplicarSeleccion() {
    escena.setSeleccion(seleccionados());
    revisarStooge();
    actualizarBotones();
    guardar();
  }

  function marcarTodas(marcar) {
    for (const etiqueta of casillas) etiqueta.firstChild.checked = marcar;
    aplicarSeleccion();
  }

  $('zona-seleccion').addEventListener('change', aplicarSeleccion);
  $('btn-todos').addEventListener('click', () => marcarTodas(true));
  $('btn-ninguno').addEventListener('click', () => marcarTodas(false));

  // `change` se dispara al pulsar Enter o al salir del campo.
  inpTamano.addEventListener('change', nuevaLista);
  $('btn-nueva-lista').addEventListener('click', nuevaLista);

  inpVelocidad.addEventListener('input', () => {
    velocidadActual = velocidadDesdeSlider(Number(inpVelocidad.value));
    escena.setVelocidad(velocidadActual);
    lblVelocidad.textContent = velocidadActual;
  });
  inpVelocidad.addEventListener('change', guardar);

  botones.reproducir.addEventListener('click', () => escena.reproducir());
  botones.pausar.addEventListener('click', () => escena.pausar());
  botones.paso.addEventListener('click', () => escena.paso());
  botones.reiniciar.addEventListener('click', () => {
    escena.reiniciar();
    actualizarBotones();
  });

  // ── Estado inicial ──
  inpTamano.min = TAMANO_MIN;
  inpTamano.max = TAMANO_MAX;
  inpTamano.value = Number.isInteger(prefs.tamano) ? prefs.tamano : TAMANO_DEFECTO;
  // La velocidad inicial se usa tal cual; el deslizador solo se acerca a
  // ella (ida y vuelta por la escala logarítmica, 20 daría 19).
  inpVelocidad.value = sliderDesdeVelocidad(velocidadActual);
  lblVelocidad.textContent = velocidadActual;
  escena.setVelocidad(velocidadActual);
  escena.setSeleccion(seleccionados());
  nuevaLista();

  return { actualizarBotones };
}
