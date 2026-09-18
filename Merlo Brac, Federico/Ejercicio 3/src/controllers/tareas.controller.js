import { tareasService } from '../services/tareas.service.js';

export function listarTareas(req, res) {
  const { completada, estado, nombre } = req.query;
  const filtros = {};

  if (completada !== undefined) {
    filtros.completada = completada === 'true';
  } else if (estado !== undefined) {
    filtros.completada = estado === 'completada';
  }

  if (nombre) {
    filtros.nombre = nombre;
  }

  const tareas = tareasService.obtenerTodas(filtros);
  res.status(200).json({
    total: tareas.length,
    tareas
  });
}

export function obtenerPorId(req, res) {
  const tarea = tareasService.obtenerPorId(req.parsedId);
  if (!tarea) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No existe ninguna tarea con el ID ${req.parsedId}.`
    });
  }
  res.status(200).json(tarea);
}

export function crearTarea(req, res) {
  const { nombre, completada } = req.body;
  const resultado = tareasService.crear({ nombre, completada });

  if (resultado.error === 'DUPLICATE_NAME') {
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      mensaje: `Ya existe una tarea registrada con el nombre '${nombre}'.`
    });
  }

  res.status(201).json({
    mensaje: 'Tarea creada con éxito.',
    tarea: resultado.tarea
  });
}

export function modificarTarea(req, res) {
  const { nombre, completada } = req.body;
  const resultado = tareasService.actualizar(req.parsedId, { nombre, completada });

  if (resultado.error === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo actualizar. No existe la tarea con ID ${req.parsedId}.`
    });
  }

  if (resultado.error === 'DUPLICATE_NAME') {
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      mensaje: `No se puede actualizar el nombre a '${nombre}' porque ya existe otra tarea con esa denominación.`
    });
  }

  res.status(200).json({
    mensaje: 'Tarea actualizada exitosamente.',
    tarea: resultado.tarea
  });
}

export function eliminarTarea(req, res) {
  const eliminada = tareasService.eliminar(req.parsedId);
  if (!eliminada) {
    return res.status(404).json({
      error: 'No encontrado',
      mensaje: `No se pudo eliminar. No existe la tarea con ID ${req.parsedId}.`
    });
  }
  res.status(200).json({
    mensaje: `Tarea con ID ${req.parsedId} eliminada correctamente.`
  });
}
