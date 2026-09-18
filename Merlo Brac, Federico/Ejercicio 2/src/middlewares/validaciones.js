function esNotaValida(val) {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !Number.isNaN(num) && Number.isFinite(num) && num >= 0 && num <= 10;
}

function extraerNotas(body) {
  if (Array.isArray(body.notas)) {
    return body.notas;
  }
  if (body.nota1 !== undefined && body.nota2 !== undefined && body.nota3 !== undefined) {
    return [body.nota1, body.nota2, body.nota3];
  }
  return null;
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
  const { nombre } = req.body;
  const errores = [];

  if (nombre === undefined || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push("El campo 'nombre' es requerido y debe ser una cadena de texto no vacía.");
  }

  const notas = extraerNotas(req.body);
  if (!notas) {
    errores.push("Se requieren exactamente tres notas (mediante el arreglo 'notas': [n1, n2, n3] o campos 'nota1', 'nota2', 'nota3').");
  } else if (!Array.isArray(notas) || notas.length !== 3) {
    errores.push(`Se deben enviar exactamente 3 notas. Se recibieron ${notas.length}.`);
  } else {
    notas.forEach((nota, index) => {
      if (!esNotaValida(nota)) {
        errores.push(`La nota ${index + 1} (${nota}) debe ser un número entre 0 y 10.`);
      }
    });
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  req.body.nombre = nombre.trim();
  req.body.notas = notas.map(Number);
  next();
}

export function validarBodyModificar(req, res, next) {
  const { nombre } = req.body;
  const notas = req.body.notas !== undefined || req.body.nota1 !== undefined ? extraerNotas(req.body) : undefined;
  const errores = [];

  if (nombre === undefined && notas === undefined) {
    return res.status(400).json({
      error: 'Datos inválidos',
      mensaje: "Debe enviar al menos 'nombre' o 'notas' para actualizar."
    });
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    errores.push("El campo 'nombre' debe ser una cadena de texto no vacía.");
  }

  if (notas !== undefined) {
    if (!notas || !Array.isArray(notas) || notas.length !== 3) {
      errores.push("Si envía notas, deben ser exactamente 3 calificaciones.");
    } else {
      notas.forEach((nota, index) => {
        if (!esNotaValida(nota)) {
          errores.push(`La nota ${index + 1} (${nota}) debe ser un número entre 0 y 10.`);
        }
      });
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores
    });
  }

  if (nombre !== undefined) req.body.nombre = nombre.trim();
  if (notas !== undefined) req.body.notas = notas.map(Number);
  next();
}

export function validarQueryFiltro(req, res, next) {
  const { condicion } = req.query;
  const validas = ['reprobado', 'aprobado', 'promocionado'];

  if (condicion !== undefined) {
    const norm = String(condicion).trim().toLowerCase();
    if (!validas.includes(norm)) {
      return res.status(400).json({
        error: 'Query param inválido',
        mensaje: `La condición '${condicion}' no es válida. Opciones permitidas: ${validas.join(', ')}.`
      });
    }
    req.query.condicion = norm;
  }
  next();
}
