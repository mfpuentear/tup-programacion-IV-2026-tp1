const LARGO_MAXIMO_NOMBRE = 100

function validarNombre (valor, errores) {
  if (typeof valor !== 'string') {
    errores.push('nombre es obligatorio y debe ser una cadena de texto')
    return null
  }

  const nombre = valor.trim().replace(/\s+/g, ' ')

  if (nombre === '') {
    errores.push('nombre no puede estar vacio')
    return null
  }

  if (nombre.length > LARGO_MAXIMO_NOMBRE) {
    errores.push(`nombre no puede superar los ${LARGO_MAXIMO_NOMBRE} caracteres`)
    return null
  }

  return nombre
}

function validarCompletada (valor, errores) {
  if (typeof valor !== 'boolean') {
    errores.push('completada debe ser true o false')
    return null
  }

  return valor
}

// POST: el nombre es obligatorio; si no se aclara el estado, la tarea nace
// pendiente, que es lo esperable al dar de alta algo por hacer.
function validarTareaNueva (req, res, next) {
  const cuerpo = req.body || {}
  const errores = []

  const nombre = validarNombre(cuerpo.nombre, errores)
  let completada = false

  if (cuerpo.completada !== undefined) {
    completada = validarCompletada(cuerpo.completada, errores)
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos de la tarea invalidos', detalles: errores })
  }

  req.tarea = { nombre, completada }
  next()
}

// PUT: reemplazo completo, los dos campos son obligatorios.
function validarTareaCompleta (req, res, next) {
  const cuerpo = req.body || {}
  const errores = []

  const nombre = validarNombre(cuerpo.nombre, errores)
  const completada = validarCompletada(cuerpo.completada, errores)

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos de la tarea invalidos', detalles: errores })
  }

  req.tarea = { nombre, completada }
  next()
}

// PATCH: actualizacion parcial, alcanza con que venga uno de los dos campos.
function validarCambioParcial (req, res, next) {
  const cuerpo = req.body || {}
  const errores = []
  const cambios = {}

  if (cuerpo.nombre !== undefined) {
    const nombre = validarNombre(cuerpo.nombre, errores)
    if (nombre !== null) cambios.nombre = nombre
  }

  if (cuerpo.completada !== undefined) {
    const completada = validarCompletada(cuerpo.completada, errores)
    if (completada !== null) cambios.completada = completada
  }

  if (cuerpo.nombre === undefined && cuerpo.completada === undefined) {
    errores.push('hay que enviar al menos nombre o completada')
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos de la tarea invalidos', detalles: errores })
  }

  req.cambios = cambios
  next()
}

module.exports = { validarTareaNueva, validarTareaCompleta, validarCambioParcial }
