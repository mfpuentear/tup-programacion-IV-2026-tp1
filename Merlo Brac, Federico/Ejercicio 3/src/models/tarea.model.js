/**
 * Modelo de dominio para representar una Tarea.
 * Almacena id, nombre y el estado que indica si fue completada (booleano).
 */
export class Tarea {
  constructor(id, nombre, completada = false) {
    this.id = Number(id);
    this.nombre = String(nombre).trim();
    this.completada = Boolean(completada);
  }

  get estado() {
    return this.completada ? 'completada' : 'pendiente';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      completada: this.completada,
      estado: this.estado
    };
  }
}
