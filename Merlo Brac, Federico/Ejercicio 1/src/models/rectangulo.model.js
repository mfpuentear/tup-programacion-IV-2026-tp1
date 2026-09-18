/**
 * Modelo de dominio Rectángulo.
 * Almacena únicamente datos primitivos: id, base y altura.
 * El perímetro, la superficie y la distinción de cuadrado se calculan dinámicamente.
 */
export class Rectangulo {
  constructor(id, base, altura, nombre = '') {
    this.id = Number(id);
    this.base = Number(base);
    this.altura = Number(altura);
    this.nombre = nombre || `Rectangulo ${id}`;
  }

  get perimetro() {
    return 2 * (this.base + this.altura);
  }

  get superficie() {
    return this.base * this.altura;
  }

  get esCuadrado() {
    return this.base === this.altura;
  }

  get tipo() {
    return this.esCuadrado ? 'cuadrado' : 'rectangulo';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      base: this.base,
      altura: this.altura,
      perimetro: this.perimetro,
      superficie: this.superficie,
      esCuadrado: this.esCuadrado,
      tipo: this.tipo
    };
  }
}
