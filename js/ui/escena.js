/**
 * js/ui/escena.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 08 — Escena del visualizador.
 *
 * Guarda el estado del visualizador y coordina:
 *   - la lista base, que es la MISMA para todos los paneles (requisito 9);
 *   - los paneles de los algoritmos seleccionados;
 *   - un único reproductor (B05) que avanza todos los paneles al mismo ritmo;
 *   - el panel de código (B06), que sigue al panel activo.
 *
 * B09 le agrega lo propio de la comparación: orden de llegada y resumen.
 */
import { generarDatos } from '../core/datos.js';
import { crearReproductor } from '../motor/reproductor.js';
import { crearPanelAlgoritmo } from './panelAlgoritmo.js';

/**
 * @param {Object} opciones
 * @param {HTMLElement} opciones.zonaPaneles
 * @param {ReturnType<import('./panelCodigo.js').crearPanelCodigo>} opciones.panelCodigo
 * @param {(estado: string) => void} [opciones.alCambiarEstado]   estado del reproductor
 * @param {(id: string|null) => void} [opciones.alCambiarActivo]   panel seleccionado
 */
export function crearEscena({
  zonaPaneles,
  panelCodigo,
  alCambiarEstado = () => {},
  alCambiarActivo = () => {},
}) {
  const estado = {
    listaBase: [],       // nunca se modifica; cada panel trabaja sobre su copia
    seleccionados: [],   // ids en el orden de ALGORITMOS
    panelActivo: null,   // id cuyo código y ficha se muestran
  };
  /** @type {ReturnType<typeof crearPanelAlgoritmo>[]} */
  let paneles = [];

  const reproductor = crearReproductor({
    alCambiarEstado,
    alAvanzar(n) {
      let quedaTrabajo = false;
      for (const panel of paneles) {
        if (!panel.terminado && panel.avanzar(n)) quedaTrabajo = true;
      }
      resaltarLineaActiva();
      return quedaTrabajo;
    },
  });

  function resaltarLineaActiva() {
    const activo = paneles.find((p) => p.id === estado.panelActivo);
    panelCodigo.resaltar(activo?.linea ?? null);
  }

  function seleccionarPanel(id) {
    estado.panelActivo = id;
    for (const panel of paneles) panel.setActivo(panel.id === id);
    if (id) panelCodigo.mostrar(id);
    resaltarLineaActiva();
    alCambiarActivo(id);
  }

  /** Vuelve a crear los paneles con la selección y la lista actuales. */
  function construirPaneles() {
    reproductor.detener();
    paneles.forEach((p) => p.destruir());
    zonaPaneles.replaceChildren();

    paneles = estado.seleccionados.map((id) => crearPanelAlgoritmo({
      contenedor: zonaPaneles,
      id,
      lista: estado.listaBase,
      alSeleccionar: seleccionarPanel,
    }));

    if (paneles.length === 0) {
      const aviso = document.createElement('p');
      aviso.className = 'marcador';
      aviso.textContent = 'Selecciona al menos un algoritmo.';
      zonaPaneles.append(aviso);
      panelCodigo.limpiar();
    }

    const sigueActivo = estado.seleccionados.includes(estado.panelActivo);
    seleccionarPanel(sigueActivo ? estado.panelActivo : (estado.seleccionados[0] ?? null));
  }

  return {
    /** @param {string[]} ids  Algoritmos a mostrar; conserva la lista actual. */
    setSeleccion(ids) {
      estado.seleccionados = [...ids];
      construirPaneles();
    },

    /** Genera una lista nueva y reinicia todos los paneles con ella. */
    nuevaLista(tamano, patron) {
      estado.listaBase = generarDatos(tamano, patron);
      construirPaneles();
    },

    /** Vuelve al inicio con la MISMA lista. */
    reiniciar() {
      reproductor.detener();
      paneles.forEach((p) => p.reiniciar(estado.listaBase));
      panelCodigo.limpiar();
    },

    reproducir() {
      if (paneles.length) reproductor.reproducir();
    },
    pausar: () => reproductor.pausar(),
    paso() {
      if (paneles.length) reproductor.paso();
    },
    setVelocidad: (pps) => reproductor.setVelocidad(pps),
    seleccionarPanel,

    get estado() {
      return {
        ...estado,
        listaBase: [...estado.listaBase],
        reproductor: reproductor.estado,
        velocidad: reproductor.velocidad,
      };
    },
  };
}
