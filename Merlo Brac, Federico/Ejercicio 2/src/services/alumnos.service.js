import { Alumno } from '../models/alumno.model.js';

class AlumnosService {
  constructor() {
    this.alumnos = [];
    this.proximoId = 1;

    // Precargamos alumnos representativos de las tres condiciones
    this.crear({ nombre: 'Juan Pérez', notas: [8, 9, 8] });       // Promedio: 8.33 -> Promocionado
    this.crear({ nombre: 'María González', notas: [7, 6, 7] });   // Promedio: 6.67 -> Aprobado
    this.crear({ nombre: 'Carlos Rodríguez', notas: [4, 5, 5] }); // Promedio: 4.67 -> Reprobado
  }

  buscarPorNombre(nombre, idExcluir = null) {
    const nombreNorm = nombre.trim().toLowerCase();
    return this.alumnos.find(
      (a) => a.nombre.toLowerCase() === nombreNorm && (idExcluir === null || a.id !== idExcluir)
    );
  }

  obtenerTodos(filtros = {}) {
    let resultado = [...this.alumnos];

    if (filtros.condicion) {
      resultado = resultado.filter((a) => a.condicion === filtros.condicion);
    }

    if (filtros.nombre) {
      const termino = filtros.nombre.trim().toLowerCase();
      resultado = resultado.filter((a) => a.nombre.toLowerCase().includes(termino));
    }

    return resultado;
  }

  obtenerPorId(id) {
    return this.alumnos.find((a) => a.id === id);
  }

  crear({ nombre, notas }) {
    if (this.buscarPorNombre(nombre)) {
      return { error: 'DUPLICATE_NAME' };
    }

    const nuevo = new Alumno(this.proximoId++, nombre, notas);
    this.alumnos.push(nuevo);
    return { alumno: nuevo };
  }

  actualizar(id, { nombre, notas }) {
    const alumno = this.obtenerPorId(id);
    if (!alumno) {
      return { error: 'NOT_FOUND' };
    }

    if (nombre !== undefined) {
      const duplicado = this.buscarPorNombre(nombre, id);
      if (duplicado) {
        return { error: 'DUPLICATE_NAME' };
      }
      alumno.nombre = nombre.trim();
    }

    if (notas !== undefined) {
      alumno.notas = notas.map(Number);
    }

    return { alumno };
  }

  eliminar(id) {
    const index = this.alumnos.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.alumnos.splice(index, 1);
    return true;
  }
}

export const alumnosService = new AlumnosService();
