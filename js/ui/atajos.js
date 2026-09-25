/**
 * js/ui/atajos.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 12 — Atajos de teclado del visualizador.
 *
 *   Espacio  reproducir / pausar
 *   →        un paso
 *   R        reiniciar (misma lista)
 *   N        nueva lista
 *
 * Cada atajo pulsa el botón correspondiente, así respeta si está
 * deshabilitado y no duplica la lógica de controles.js. No actúa si el foco
 * está en un campo o botón (ahí la tecla ya tiene su propio efecto) ni fuera
 * de la pestaña Visualizador.
 */

const BOTON_POR_TECLA = Object.freeze({
  ArrowRight: 'btn-paso',
  r: 'btn-reiniciar',
  n: 'btn-nueva-lista',
});

export function iniciarAtajos() {
  const $ = (id) => document.getElementById(id);

  document.addEventListener('keydown', (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (!$('vista-visualizador').classList.contains('vista--activa')) return;
    if (evento.target.closest('input, select, textarea, button, a')) return;

    const id = evento.key === ' '
      ? ($('btn-pausar').disabled ? 'btn-reproducir' : 'btn-pausar')
      : BOTON_POR_TECLA[evento.key.length === 1 ? evento.key.toLowerCase() : evento.key];
    const boton = id && $(id);
    if (!boton || boton.disabled) return;

    evento.preventDefault();
    boton.click();
  });
}
