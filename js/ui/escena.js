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
 * Comparación (Bloque 09): como todos los paneles avanzan los mismos pasos
 * por segundo, termina primero el que necesita menos pasos. La escena
 * registra ese orden de llegada y, cuando terminan todos, entrega un
 * resumen con los contadores de cada algoritmo.
 */
import { ALGORITMOS } from '../algoritmos/index.js';
import { generarDatos } from '../core/datos.js';
import { crearReproductor } from '../motor/reproductor.js';
import { crearPanelAlgoritmo } from './panelAlgoritmo.js';

/**
 * @param {Object} opciones
 * @param {HTMLElement} opciones.zonaPaneles
 * @param {ReturnType<import('./panelCodigo.js').crearPanelCodigo>} opciones.panelCodigo
 * @param {(estado: string) => void} [opciones.alCambiarEstado]   estado del reproductor
 * @param {(id: string|null) => void} [opciones.alCambiarActivo]   panel seleccionado
 * @param {(resumen: Object[]) => void} [opciones.alTerminarTodos]  todos llegaron al final
 */
export function crearEscena({
  zonaPaneles,
  panelCodigo,
  alCambiarEstado = () => {},
  alCambiarActivo = () => {},
  alTerminarTodos = () => {},
}) {
  const estado = {
    listaBase: [],       // nunca se modifica; cada panel trabaja sobre su copia
    seleccionados: [],   // ids en el orden de ALGORITMOS
    panelActivo: null,   // id cuyo código y ficha se muestran
    llegada: [],         // ids en el orden en que terminaron
  };
  /** @type {ReturnType<typeof crearPanelAlgoritmo>[]} */
  let paneles = [];

  const reproductor = crearReproductor({
    alCambiarEstado,
    alAvanzar(n) {
      let quedaTrabajo = false;
      const recienTerminados = [];
      for (const panel of paneles) {
        if (panel.terminado) continue;
        if (panel.avanzar(n)) quedaTrabajo = true;
        else recienTerminados.push(panel);
      }
      // Si varios terminan en el mismo cuadro, llega antes el de menos pasos.
      recienTerminados.sort((a, b) => a.contadores.pasos - b.contadores.pasos);
      estado.llegada.push(...recienTerminados.map((p) => p.id));

      resaltarLineaActiva();
      if (!quedaTrabajo && paneles.length) alTerminarTodos(resumen());
      return quedaTrabajo;
    },
  });

  /**
   * Contadores de cada panel con su posición de llegada (null si no ha
   * terminado), ordenados por llegada.
   */
  function resumen() {
    return paneles
      .map((p) => {
        const posicion = estado.llegada.indexOf(p.id);
        return {
          id: p.id,
          nombre: ALGORITMOS[p.id].nombre,
          complejidad: ALGORITMOS[p.id].promedio,
          ...p.contadores,
          llegada: posicion === -1 ? null : posicion + 1,
        };
      })
      .sort((a, b) => (a.llegada ?? Infinity) - (b.llegada ?? Infinity));
  }

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
    estado.llegada = [];
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
      estado.llegada = [];
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

    get resumen() {
      return resumen();
    },

    get estado() {
      return {
        ...estado,
        listaBase: [...estado.listaBase],
        llegada: [...estado.llegada],
        reproductor: reproductor.estado,
        velocidad: reproductor.velocidad,
      };
    },
  };
}
