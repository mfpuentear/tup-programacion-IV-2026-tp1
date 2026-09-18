// Limite arbitrario para evitar valores absurdos que hagan perder precision
// en el calculo (Number deja de ser exacto mucho antes, pero con 1.000.000
// alcanza de sobra para el dominio del ejercicio).
const MAXIMO = 1000000

function validarMedida (valor, nombre, errores) {
  const numero = Number(valor)

  if (valor.trim() === '' || !Number.isFinite(numero)) {
    errores.push(`${nombre} debe ser un numero`)
    return null
  }

  if (numero <= 0) {
    errores.push(`${nombre} debe ser mayor a 0`)
    return null
  }

  if (numero > MAXIMO) {
    errores.push(`${nombre} no puede superar ${MAXIMO}`)
    return null
  }

  return numero
}

function validarDimensiones (req, res, next) {
  const errores = []
  const base = validarMedida(req.params.base, 'La base', errores)
  const altura = validarMedida(req.params.altura, 'La altura', errores)

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Dimensiones invalidas',
      detalles: errores
    })
  }

  // Se guardan ya convertidas a numero para que las rutas no repitan el parseo.
  req.dimensiones = { base, altura }
  next()
}

module.exports = validarDimensiones
