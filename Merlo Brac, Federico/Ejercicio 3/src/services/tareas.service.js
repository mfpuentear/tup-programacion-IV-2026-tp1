import { Tarea } from '../models/tarea.model.js';

class TareasService {
  constructor() {
    this.tareas = [];
    this.proximoId = 1;

    // Precargamos tareas iniciales (completadas y pendientes)
    this.crear({ nombre: 'Configurar entorno de desarrollo', completada: true });
    this.crear({ nombre: 'Diseñar arquitectura de la API', completada: true });
    this.crear({ nombre: 'Escribir endpoints de tareas', completada: false });
    this.crear({ nombre: 'Elaborar archivo de pruebas HTTP', completada: false });
  }

  buscarPorNombre(nombre, idExcluir = null) {
    const nombreNorm = nombre.trim().toLowerCase();
    return this.tareas.find(
      (t) => t.nombre.toLowerCase() === nombreNorm && (idExcluir === null || t.id !== idExcluir)
    );
  }

  obtenerTodas(filtros = {}) {
    let resultado = [...this.tareas];

    if (filtros.completada !== undefined) {
      resultado = resultado.filter((t) => t.completada === filtros.completada);
    }

    if (filtros.nombre) {
      const termino = filtros.nombre.trim().toLowerCase();
      resultado = resultado.filter((t) => t.nombre.toLowerCase().includes(termino));
    }

    return resultado;
  }

  obtenerPorId(id) {
    return this.tareas.find((t) => t.id === id);
  }

  crear({ nombre, completada = false }) {
    if (this.buscarPorNombre(nombre)) {
      return { error: 'DUPLICATE_NAME' };
    }

    const nueva = new Tarea(this.proximoId++, nombre, completada);
    this.tareas.push(nueva);
    return { tarea: nueva };
  }

  actualizar(id, { nombre, completada }) {
    const tarea = this.obtenerPorId(id);
    if (!tarea) {
      return { error: 'NOT_FOUND' };
    }

    if (nombre !== undefined) {
      const duplicada = this.buscarPorNombre(nombre, id);
      if (duplicada) {
        return { error: 'DUPLICATE_NAME' };
      }
      tarea.nombre = nombre.trim();
    }

    if (completada !== undefined) {
      tarea.completada = Boolean(completada);
    }

    return { tarea };
  }

  eliminar(id) {
    const index = this.tareas.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tareas.splice(index, 1);
    return true;
  }
}

export const tareasService = new TareasService();
