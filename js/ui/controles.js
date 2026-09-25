/**
 * js/ui/controles.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Controles del visualizador.
 *
 * Conecta los elementos de index.html (IDs de BLOQUES.md 3.3) con la escena.
 * Aquí se validan los límites de la interfaz: tamaño de 5 a 120 y Stooge
 * Sort limitado a LIMITE_STOOGE_VISUAL elementos.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import {
  TAMANO_MIN, TAMANO_MAX, TAMANO_DEFECTO, LIMITE_STOOGE_VISUAL, VELOCIDAD_DEFECTO,
} from '../config.js';
import { ESTADOS_REPRODUCTOR, velocidadDesdeSlider, sliderDesdeVelocidad } from '../motor/reproductor.js';

/** Algoritmo marcado al abrir la página. */
const SELECCION_INICIAL = ['bubble'];

/**
 * @param {ReturnType<import('./escena.js').crearEscena>} escena
 * @returns {{ actualizarBotones(): void }}
 */
export function iniciarControles(escena) {
  const $ = (id) => document.getElementById(id);
  const inpTamano = $('inp-tamano');
  const lblTamano = $('lbl-tamano');
  const selPatron = $('sel-patron');
  const inpVelocidad = $('inp-velocidad');
  const lblVelocidad = $('lbl-velocidad');
  const lblAviso = $('lbl-aviso');
  const botones = {
    reproducir: $('btn-reproducir'),
    pausar: $('btn-pausar'),
    paso: $('btn-paso'),
    reiniciar: $('btn-reiniciar'),
  };

  // ── Casillas de algoritmos, generadas desde el registro ──
  const casillas = Object.entries(ALGORITMOS).map(([id, { nombre }]) => {
    const etiqueta = document.createElement('label');
    etiqueta.className = 'casilla';
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.value = id;
    casilla.checked = SELECCION_INICIAL.includes(id);
    etiqueta.append(casilla, nombre);
    return etiqueta;
  });
  $('zona-seleccion').replaceChildren(...casillas);
  const seleccionados = () =>
    casillas.map((e) => e.firstChild).filter((c) => c.checked).map((c) => c.value);

  // ── Tamaño de la lista ──
  function mostrarAviso(texto) {
    lblAviso.textContent = texto ?? '';
    lblAviso.classList.toggle('oculto', !texto);
  }

  /**
   * Ajusta el tamaño pedido a los límites y devuelve el que se usará.
   * Mientras Stooge Sort esté seleccionado, el máximo del deslizador baja a
   * LIMITE_STOOGE_VISUAL y se muestra el motivo.
   */
  function tamanoPermitido() {
    const conStooge = seleccionados().includes('stooge');
    const maximo = conStooge ? LIMITE_STOOGE_VISUAL : TAMANO_MAX;
    const n = Math.min(maximo, Math.max(TAMANO_MIN, Number(inpTamano.value)));
    inpTamano.max = maximo;
    inpTamano.value = n;
    lblTamano.textContent = n;
    mostrarAviso(conStooge
      ? `Stooge Sort crece muy rápido (n^2.71): mientras esté seleccionado, la lista se limita a ${LIMITE_STOOGE_VISUAL} elementos.`
      : null);
    return n;
  }

  function nuevaLista() {
    escena.nuevaLista(tamanoPermitido(), selPatron.value);
    actualizarBotones();
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
  $('zona-seleccion').addEventListener('change', () => {
    const antes = Number(inpTamano.value);
    const n = tamanoPermitido();
    escena.setSeleccion(seleccionados());
    // Si Stooge obligó a reducir el tamaño, hace falta una lista nueva.
    if (n !== antes) escena.nuevaLista(n, selPatron.value);
    actualizarBotones();
  });

  inpTamano.addEventListener('input', () => { lblTamano.textContent = inpTamano.value; });
  inpTamano.addEventListener('change', nuevaLista);
  selPatron.addEventListener('change', nuevaLista);
  $('btn-nueva-lista').addEventListener('click', nuevaLista);

  inpVelocidad.addEventListener('input', () => {
    const pps = velocidadDesdeSlider(Number(inpVelocidad.value));
    escena.setVelocidad(pps);
    lblVelocidad.textContent = pps;
  });

  botones.reproducir.addEventListener('click', () => escena.reproducir());
  botones.pausar.addEventListener('click', () => escena.pausar());
  botones.paso.addEventListener('click', () => escena.paso());
  botones.reiniciar.addEventListener('click', () => {
    escena.reiniciar();
    actualizarBotones();
  });

  // ── Estado inicial ──
  inpTamano.min = TAMANO_MIN;
  inpTamano.value = TAMANO_DEFECTO;
  inpVelocidad.value = sliderDesdeVelocidad(VELOCIDAD_DEFECTO);
  lblVelocidad.textContent = VELOCIDAD_DEFECTO;
  escena.setVelocidad(VELOCIDAD_DEFECTO);
  escena.setSeleccion(seleccionados());
  nuevaLista();

  return { actualizarBotones };
}
