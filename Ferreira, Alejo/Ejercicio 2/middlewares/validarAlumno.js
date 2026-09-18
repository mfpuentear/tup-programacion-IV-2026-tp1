const CANTIDAD_DE_NOTAS = 3
const NOTA_MINIMA = 0
const NOTA_MAXIMA = 10
const LARGO_MAXIMO_NOMBRE = 60

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

function validarNotas (valor, errores) {
  if (!Array.isArray(valor)) {
    errores.push('notas debe ser un arreglo')
    return null
  }

  if (valor.length !== CANTIDAD_DE_NOTAS) {
    errores.push(`notas debe tener exactamente ${CANTIDAD_DE_NOTAS} elementos`)
    return null
  }

  const invalidas = valor.some(
    (nota) =>
      typeof nota !== 'number' ||
      !Number.isFinite(nota) ||
      nota < NOTA_MINIMA ||
      nota > NOTA_MAXIMA
  )

  if (invalidas) {
    errores.push(`cada nota debe ser un numero entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}`)
    return null
  }

  return [...valor]
}

// Usado en POST y en PUT: el cuerpo tiene que traer el alumno completo.
function validarCuerpoAlumno (req, res, next) {
  const cuerpo = req.body || {}
  const errores = []

  const nombre = validarNombre(cuerpo.nombre, errores)
  const notas = validarNotas(cuerpo.notas, errores)

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos del alumno invalidos', detalles: errores })
  }

  req.alumno = { nombre, notas }
  next()
}

// Usado en PUT /:nombre/notas: solo se reemplazan las calificaciones.
function validarCuerpoNotas (req, res, next) {
  const cuerpo = req.body || {}
  const errores = []

  const notas = validarNotas(cuerpo.notas, errores)

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Notas invalidas', detalles: errores })
  }

  req.notas = notas
  next()
}

module.exports = { validarCuerpoAlumno, validarCuerpoNotas }
