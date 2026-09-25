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
import { iniciarAtajos } from './ui/atajos.js';
import { ESTADOS_REPRODUCTOR } from './motor/reproductor.js';
import { iniciarBenchmark } from './benchmark/benchmark.js';
import { dibujarGraficas, pintarTablaBench, limpiarResultados } from './benchmark/graficas.js';
import { descargarCSV } from './benchmark/csv.js';

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
    pintarResumen($('tabla-resumen'), resumen);
    $('zona-resumen').classList.remove('oculto');
  },
  alCambiarActivo: (id) => {
    if (id) pintarFicha($('zona-ficha'), id);
    else $('zona-ficha').replaceChildren();
  },
});
pintarLeyenda($('zona-leyenda'));
controles = iniciarControles(escena);

// Bloque 10 — Benchmark (medición en Web Worker).
// Bloque 11 — Gráficas, tabla y exportación a CSV de los resultados.
let ultimosResultados = null;
iniciarBenchmark({
  alIniciar: () => {
    ultimosResultados = null;
    $('btn-bench-csv').disabled = true;
    limpiarResultados($('zona-graficas'), $('tabla-bench'));
  },
  alTerminar: (resultados) => {
    ultimosResultados = resultados;
    dibujarGraficas($('zona-graficas'), resultados);
    pintarTablaBench($('tabla-bench'), resultados);
    $('btn-bench-csv').disabled = false;
  },
});
$('btn-bench-csv').addEventListener('click', () => {
  if (ultimosResultados) descargarCSV(ultimosResultados);
});

// Bloque 12 — Atajos de teclado y pestaña Algoritmos.
iniciarAtajos();
pintarTablaAlgoritmos($('tabla-algoritmos'));
