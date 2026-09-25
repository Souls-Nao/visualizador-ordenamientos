/**
 * js/benchmark/benchmark.js
 * ─────────────────────────────────────────────────────────────────────────
 * Bloque 10 — Formulario del benchmark.
 *
 * Valida los datos con las reglas de main.py, lanza el Web Worker, muestra
 * el progreso y permite cancelar. Cuando termina entrega los resultados a
 * `alTerminar` (el Bloque 11 dibuja las gráficas y la tabla).
 */
import { PATRONES } from '../core/datos.js';

/** Límites propios de la página (main.py no los tenía). */
const MAX_TAMANOS = 100;
const MAX_REPETICIONES = 20;

/**
 * Valida los datos del formulario.
 * Reglas de main.py: enteros, incremento > 0 e inicio <= fin.
 *
 * @param {{inicio, incremento, fin, repeticiones, patron}} datos  Valores del formulario (texto).
 * @returns {{ ok: boolean, errores: string[], config: Object|null }}
 */
export function validarConfig(datos) {
  const nombres = { inicio: 'Tamaño inicial', incremento: 'Incremento', fin: 'Tamaño final',
                    repeticiones: 'Repeticiones' };
  const errores = [];
  const numeros = {};

  for (const [campo, nombre] of Object.entries(nombres)) {
    const texto = String(datos[campo] ?? '').trim();
    if (!/^-?\d+$/.test(texto)) errores.push(`${nombre}: ingresa solo números enteros.`);
    numeros[campo] = Number(texto);
  }
  if (errores.length) return { ok: false, errores, config: null };

  const { inicio, incremento, fin, repeticiones } = numeros;
  if (inicio < 1) errores.push('El tamaño inicial debe ser al menos 1.');
  if (incremento <= 0) errores.push('El incremento debe ser mayor que cero.');
  if (inicio > fin) errores.push('El tamaño inicial no puede ser mayor que el final.');
  if (repeticiones < 1 || repeticiones > MAX_REPETICIONES) {
    errores.push(`Las repeticiones deben estar entre 1 y ${MAX_REPETICIONES}.`);
  }
  if (!errores.length && Math.floor((fin - inicio) / incremento) + 1 > MAX_TAMANOS) {
    errores.push(`Son demasiados tamaños; usa un incremento mayor (máximo ${MAX_TAMANOS} tamaños).`);
  }
  if (!Object.values(PATRONES).includes(datos.patron)) errores.push('Tipo de datos no válido.');

  return errores.length
    ? { ok: false, errores, config: null }
    : { ok: true, errores, config: { ...numeros, patron: datos.patron } };
}

/**
 * Conecta el formulario #form-bench.
 *
 * @param {Object} [opciones]
 * @param {(resultados: Object) => void} [opciones.alTerminar]
 * @param {() => void} [opciones.alIniciar]  Para limpiar resultados anteriores.
 */
export function iniciarBenchmark({ alTerminar = () => {}, alIniciar = () => {} } = {}) {
  const $ = (id) => document.getElementById(id);
  const formulario = $('form-bench');
  const btnEjecutar = $('btn-bench-ejecutar');
  const btnCancelar = $('btn-bench-cancelar');
  const progreso = $('bench-progreso');
  const mensaje = $('bench-mensaje');
  let worker = null;

  function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle('aviso--error', esError);
    mensaje.classList.toggle('oculto', !texto);
  }

  function terminarTrabajo() {
    worker?.terminate();
    worker = null;
    btnEjecutar.disabled = false;
    btnCancelar.disabled = true;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const { ok, errores, config } = validarConfig({
      inicio: $('bench-inicio').value,
      incremento: $('bench-incremento').value,
      fin: $('bench-fin').value,
      repeticiones: $('bench-repeticiones').value,
      patron: $('bench-patron').value,
    });
    if (!ok) {
      mostrarMensaje(errores.join(' '), true);
      return;
    }

    alIniciar();
    btnEjecutar.disabled = true;
    btnCancelar.disabled = false;
    progreso.value = 0;
    mostrarMensaje('Midiendo…');
    const inicioReal = performance.now();

    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.tipo === 'progreso') {
        progreso.value = data.hecho / data.total;
        mostrarMensaje(`Midiendo… ${data.hecho} de ${data.total} mediciones`);
      } else if (data.tipo === 'fin') {
        terminarTrabajo();
        const segundos = ((performance.now() - inicioReal) / 1000).toFixed(1);
        const avisos = Object.values(data.resultados.omitidos).join(' ');
        mostrarMensaje(`Listo en ${segundos} s. ${avisos}`.trim());
        alTerminar(data.resultados);
      } else if (data.tipo === 'error') {
        terminarTrabajo();
        mostrarMensaje(`Error en la medición: ${data.mensaje}`, true);
      }
    };
    worker.onerror = (e) => {
      terminarTrabajo();
      mostrarMensaje(`No se pudo ejecutar el benchmark: ${e.message ?? 'error del worker'}`, true);
    };
    worker.postMessage({ tipo: 'iniciar', config });
  });

  btnCancelar.addEventListener('click', () => {
    terminarTrabajo();
    progreso.value = 0;
    mostrarMensaje('Medición cancelada.');
  });
}
