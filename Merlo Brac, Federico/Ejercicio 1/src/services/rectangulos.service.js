import { Rectangulo } from '../models/rectangulo.model.js';

class RectangulosService {
  constructor() {
    this.rectangulos = [];
    this.proximoId = 1;

    // Precargamos figuras iniciales (rectángulos y cuadrados)
    this.crear({ base: 10, altura: 5, nombre: 'Rectángulo Estándar' });
    this.crear({ base: 6, altura: 6, nombre: 'Cuadrado Modelo' });
    this.crear({ base: 14, altura: 8, nombre: 'Rectángulo Mediano' });
    this.crear({ base: 4, altura: 4, nombre: 'Cuadrado Pequeño' });
  }

  obtenerTodos(filtros = {}) {
    if (filtros.esCuadrado !== undefined) {
      return this.rectangulos.filter((r) => r.esCuadrado === filtros.esCuadrado);
    }
    return [...this.rectangulos];
  }

  obtenerPorId(id) {
    return this.rectangulos.find((r) => r.id === id);
  }

  crear({ base, altura, nombre }) {
    const nuevo = new Rectangulo(this.proximoId++, base, altura, nombre);
    this.rectangulos.push(nuevo);
    return nuevo;
  }

  actualizar(id, { base, altura, nombre }) {
    const rectangulo = this.obtenerPorId(id);
    if (!rectangulo) return null;

    if (base !== undefined) rectangulo.base = Number(base);
    if (altura !== undefined) rectangulo.altura = Number(altura);
    if (nombre !== undefined) rectangulo.nombre = nombre;

    return rectangulo;
  }

  eliminar(id) {
    const index = this.rectangulos.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.rectangulos.splice(index, 1);
    return true;
  }

  calcularDirecto(base, altura) {
    const b = Number(base);
    const h = Number(altura);
    const esCuadrado = b === h;
    return {
      base: b,
      altura: h,
      perimetro: 2 * (b + h),
      superficie: b * h,
      esCuadrado,
      tipo: esCuadrado ? 'cuadrado' : 'rectangulo'
    };
  }
}

export const rectangulosService = new RectangulosService();
