/**
 * js/ui/pestanas.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 00 — Navegación por pestañas.
 *
 * La página es una sola: cada pestaña del encabezado muestra una de las
 * secciones <section class="vista" id="vista-...">. El botón de la pestaña
 * indica qué sección abre con el atributo data-vista, por ejemplo
 * data-vista="algoritmos" abre #vista-algoritmos.
 *
 * La pestaña activa se guarda en la dirección (#algoritmos), así que al
 * recargar la página, o al compartir el enlace, se abre la misma sección.
 *
 * No importa nada de otros módulos del proyecto.
 */

/** Pestaña que se abre si la dirección no indica ninguna válida. */
const VISTA_INICIAL = 'visualizador';

/**
 * Conecta los botones de la barra de navegación con sus secciones.
 *
 * @param {HTMLElement} nav  Contenedor de los botones [data-vista].
 */
export function iniciarPestanas(nav = document.getElementById('nav-pestanas')) {
  const botones = [...nav.querySelectorAll('[data-vista]')];
  const nombres = botones.map((boton) => boton.dataset.vista);

  /**
   * Muestra la sección `nombre` y oculta las demás.
   *
   * @param {string} nombre  Valor de data-vista, por ejemplo 'algoritmos'.
   */
  function mostrar(nombre) {
    if (!nombres.includes(nombre)) nombre = VISTA_INICIAL;

    for (const boton of botones) {
      const activa = boton.dataset.vista === nombre;
      boton.classList.toggle('pestana--activa', activa);
      boton.setAttribute('aria-selected', String(activa));
      document.getElementById(`vista-${boton.dataset.vista}`)
        .classList.toggle('vista--activa', activa);
    }
  }

  nav.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-vista]');
    if (!boton) return;
    // Cambiar el hash dispara 'hashchange', que es quien muestra la sección.
    location.hash = boton.dataset.vista;
  });

  window.addEventListener('hashchange', () => mostrar(location.hash.slice(1)));

  mostrar(location.hash.slice(1));
}
