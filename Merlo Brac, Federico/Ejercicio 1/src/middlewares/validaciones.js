function esNumeroPositivo(val) {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !Number.isNaN(num) && Number.isFinite(num) && num > 0;
}

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
  const { base, altura } = req.body;
  const errores = [];

  if (base === undefined) {
    errores.push("El campo 'base' es requerido.");
  } else if (!esNumeroPositivo(base)) {
    errores.push("El campo 'base' debe ser un número mayor a 0.");
  }

  if (altura === undefined) {
    errores.push("El campo 'altura' es requerido.");
  } else if (!esNumeroPositivo(altura)) {
    errores.push("El campo 'altura' debe ser un número mayor a 0.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  next();
}

export function validarBodyModificar(req, res, next) {
  const { base, altura, nombre } = req.body;
  const errores = [];

  if (base === undefined && altura === undefined && nombre === undefined) {
    return res.status(400).json({
      error: 'Datos inválidos',
      mensaje: "Debe proporcionar al menos 'base', 'altura' o 'nombre' para actualizar."
    });
  }

  if (base !== undefined && !esNumeroPositivo(base)) {
    errores.push("El campo 'base' debe ser un número mayor a 0.");
  }

  if (altura !== undefined && !esNumeroPositivo(altura)) {
    errores.push("El campo 'altura' debe ser un número mayor a 0.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  next();
}

export function validarFiltroCuadrado(req, res, next) {
  const { esCuadrado } = req.query;
  if (esCuadrado !== undefined && esCuadrado !== 'true' && esCuadrado !== 'false') {
    return res.status(400).json({
      error: 'Query param inválido',
      mensaje: "El parámetro 'esCuadrado' solo admite los valores 'true' o 'false'."
    });
  }
  next();
}

export function validarCalculoDirecto(req, res, next) {
  const { base, altura } = req.query;
  const errores = [];

  if (base === undefined || !esNumeroPositivo(base)) {
    errores.push("El parámetro 'base' es requerido y debe ser un número mayor a 0.");
  }

  if (altura === undefined || !esNumeroPositivo(altura)) {
    errores.push("El parámetro 'altura' es requerido y debe ser un número mayor a 0.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Parámetros de consulta inválidos',
      detalles: errores
    });
  }

  next();
}
