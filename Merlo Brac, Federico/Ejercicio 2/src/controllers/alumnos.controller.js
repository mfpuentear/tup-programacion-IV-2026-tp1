import { alumnosService } from '../services/alumnos.service.js';

export function listarAlumnos(req, res) {
  const { condicion, nombre } = req.query;
  const alumnos = alumnosService.obtenerTodos({ condicion, nombre });
  res.status(200).json({
    total: alumnos.length,
    alumnos
  });
}

export function obtenerPorId(req, res) {
  const alumno = alumnosService.obtenerPorId(req.parsedId);
  if (!alumno) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ningún alumno con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json(alumno);
}

/**
 * Requerimiento explícito de la consigna:
 * "Al consultar las notas de un alumno, la API deberá informar su promedio y su condición académica"
 */
export function obtenerNotas(req, res) {
  const alumno = alumnosService.obtenerPorId(req.parsedId);
  if (!alumno) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ningún alumno con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: alumno.promedio,
    condicion: alumno.condicion
  });
}

export function crearAlumno(req, res) {
  const { nombre, notas } = req.body;
  const resultado = alumnosService.crear({ nombre, notas });

  if (resultado.error === 'DUPLICATE_NAME') {
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      mensaje: `Ya existe un alumno registrado con el nombre '${nombre}'.`
    });
  }

  res.status(201).json({
    mensaje: 'Alumno registrado con éxito.',
    alumno: resultado.alumno
  });
}

export function modificarAlumno(req, res) {
  const { nombre, notas } = req.body;
  const resultado = alumnosService.actualizar(req.parsedId, { nombre, notas });

  if (resultado.error === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo actualizar. No existe el alumno con ID ${req.parsedId}.`
    });
  }

  if (resultado.error === 'DUPLICATE_NAME') {
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      mensaje: `No se puede actualizar el nombre a '${nombre}' porque ya existe otro alumno con esa denominación.`
    });
  }

  res.status(200).json({
    mensaje: 'Alumno actualizado exitosamente.',
    alumno: resultado.alumno
  });
}

export function eliminarAlumno(req, res) {
  const eliminado = alumnosService.eliminar(req.parsedId);
  if (!eliminado) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo eliminar. No existe el alumno con ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    mensaje: `Alumno con ID ${req.parsedId} eliminado correctamente.`
  });
}
