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
import { crearEscena } from './ui/escena.js';
import { iniciarControles } from './ui/controles.js';
import { pintarFicha, pintarLeyenda, pintarResumen, pintarTablaAlgoritmos } from './ui/ficha.js';
import { ESTADOS_REPRODUCTOR } from './motor/reproductor.js';
import { iniciarAtajos } from './ui/atajos.js';
import { iniciarVentanaCrecimiento } from './ui/ventanaCrecimiento.js';

const $ = (id) => document.getElementById(id);

// Bloque 00 — Base y navegación.
iniciarPestanas();
$('enlace-repo').href = ENLACES.repositorio;
$('enlace-tablero').href = ENLACES.tablero;

// Bloque 06 — Panel de código.
const panelCodigo = crearPanelCodigo($('zona-codigo'));

// Bloque 08 — Visualizador: escena, controles, ficha y leyenda.
// Bloque 09 — Comparación: al terminar todos se muestra el resumen; al
// volver a empezar (estado 'detenido') se oculta.
let controles = null;
const escena = crearEscena({
  zonaPaneles: $('zona-paneles'),
  panelCodigo,
  alCambiarEstado: (estado) => {
    if (estado === ESTADOS_REPRODUCTOR.DETENIDO) $('zona-resumen').classList.add('oculto');
    controles?.actualizarBotones();
  },
  alTerminarTodos: (resumen) => {
    pintarResumen($('tabla-resumen'), resumen, escena.estado.listaBase.length);
    $('zona-resumen').classList.remove('oculto');
  },
  alCambiarActivo: (id) => {
    if (id) pintarFicha($('zona-ficha'), id, escena.estado.listaBase.length);
    else $('zona-ficha').replaceChildren();
  },
});
pintarLeyenda($('zona-leyenda'));
controles = iniciarControles(escena);

// Bloque 12 — Atajos de teclado y pestaña Algoritmos.
iniciarAtajos();
pintarTablaAlgoritmos($('tabla-algoritmos'));

// Complejidad (requisito 8): ventana con la gráfica de crecimiento.
iniciarVentanaCrecimiento(escena);
