import { rectangulosService } from '../services/rectangulos.service.js';

export function listarRectangulos(req, res) {
  const { esCuadrado } = req.query;
  const filtros = {};

  if (esCuadrado !== undefined) {
    filtros.esCuadrado = esCuadrado === 'true';
  }

  const rectangulos = rectangulosService.obtenerTodos(filtros);
  res.status(200).json({
    total: rectangulos.length,
    rectangulos
  });
}

export function obtenerPorId(req, res) {
  const rectangulo = rectangulosService.obtenerPorId(req.parsedId);
  if (!rectangulo) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ningún rectángulo con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json(rectangulo);
}

export function obtenerPerimetro(req, res) {
  const rectangulo = rectangulosService.obtenerPorId(req.parsedId);
  if (!rectangulo) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ningún rectángulo con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    id: rectangulo.id,
    base: rectangulo.base,
    altura: rectangulo.altura,
    perimetro: rectangulo.perimetro,
    esCuadrado: rectangulo.esCuadrado,
    formula: '2 * (base + altura)'
  });
}

export function obtenerSuperficie(req, res) {
  const rectangulo = rectangulosService.obtenerPorId(req.parsedId);
  if (!rectangulo) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ningún rectángulo con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    id: rectangulo.id,
    base: rectangulo.base,
    altura: rectangulo.altura,
    superficie: rectangulo.superficie,
    esCuadrado: rectangulo.esCuadrado,
    formula: 'base * altura'
  });
}

export function crearRectangulo(req, res) {
  const { base, altura, nombre } = req.body;
  const nuevo = rectangulosService.crear({ base, altura, nombre });
  res.status(201).json({
    mensaje: nuevo.esCuadrado
      ? 'Figura creada exitosamente (constituye un cuadrado).'
      : 'Rectángulo creado exitosamente.',
    rectangulo: nuevo
  });
}

export function modificarRectangulo(req, res) {
  const actualizado = rectangulosService.actualizar(req.parsedId, req.body);
  if (!actualizado) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo actualizar. No existe el rectángulo con ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    mensaje: 'Rectángulo actualizado exitosamente.',
    rectangulo: actualizado
  });
}

export function eliminarRectangulo(req, res) {
  const eliminado = rectangulosService.eliminar(req.parsedId);
  if (!eliminado) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo eliminar. No existe el rectángulo con ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    mensaje: `Rectángulo con ID ${req.parsedId} eliminado correctamente.`
  });
}

export function calcularDirecto(req, res) {
  const { base, altura } = req.query;
  const resultado = rectangulosService.calcularDirecto(base, altura);
  res.status(200).json(resultado);
}
