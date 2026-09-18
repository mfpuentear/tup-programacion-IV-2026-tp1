/**
 * Modelo de dominio para representar a un Alumno.
 *
 * Cumplimiento de consigna:
 * - Se almacenan en el estado interno únicamente 'id', 'nombre' y 'notas' (exactamente 3).
 * - 'promedio' y 'condicion' son datos derivados (getters) y NO se almacenan en el arreglo interno.
 */
export class Alumno {
  constructor(id, nombre, notas) {
    this.id = Number(id);
    this.nombre = String(nombre).trim();
    this.notas = notas.map(Number);
  }

  get promedio() {
    const suma = this.notas.reduce((acc, curr) => acc + curr, 0);
    return Number((suma / this.notas.length).toFixed(2));
  }

  get condicion() {
    const prom = this.promedio;
    if (prom < 6) return 'reprobado';
    if (prom < 8) return 'aprobado';
    return 'promocionado';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      notas: [...this.notas],
      promedio: this.promedio,
      condicion: this.condicion
    };
  }
}
