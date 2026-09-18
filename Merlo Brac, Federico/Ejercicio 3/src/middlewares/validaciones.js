export function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Parámetro inválido',
      mensaje: 'El parámetro :id debe ser un número entero positivo mayor a 0.'
    });
  }
  req.parsedId = id;
  next();
}

export function validarBodyCrear(req, res, next) {
  const { nombre, completada } = req.body;
  const errores = [];

  if (nombre === undefined || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push("El campo 'nombre' es requerido y debe ser una cadena de texto no vacía.");
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    errores.push("El campo 'completada' debe ser un valor booleano (true o false).");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  req.body.nombre = nombre.trim();
  req.body.completada = completada !== undefined ? completada : false;
  next();
}

export function validarBodyModificar(req, res, next) {
  const { nombre, completada } = req.body;
  const errores = [];

  if (nombre === undefined && completada === undefined) {
    return res.status(400).json({
      error: 'Datos inválidos',
      mensaje: "Debe proporcionar al menos 'nombre' o 'completada' para actualizar la tarea."
    });
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    errores.push("El campo 'nombre' debe ser una cadena de texto no vacía.");
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    errores.push("El campo 'completada' debe ser un valor booleano (true o false).");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  if (nombre !== undefined) req.body.nombre = nombre.trim();
  next();
}

export function validarQueryFiltro(req, res, next) {
  const { completada, estado } = req.query;

  if (completada !== undefined && completada !== 'true' && completada !== 'false') {
    return res.status(400).json({
      error: 'Query param inválido',
      mensaje: "El parámetro 'completada' debe ser 'true' o 'false'."
    });
  }

  if (estado !== undefined) {
    const norm = String(estado).trim().toLowerCase();
    if (norm !== 'completada' && norm !== 'pendiente') {
      return res.status(400).json({
        error: 'Query param inválido',
        mensaje: "El parámetro 'estado' debe ser 'completada' o 'pendiente'."
      });
    }
    req.query.estado = norm;
  }

  next();
}
