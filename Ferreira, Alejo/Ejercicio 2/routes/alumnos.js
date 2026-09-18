const { Router } = require('express')
const { alumnos, buscarIndice } = require('../datos/alumnos')
const { CONDICIONES, representar } = require('../logica/calificaciones')
const { validarCuerpoAlumno, validarCuerpoNotas } = require('../middlewares/validarAlumno')

const router = Router()

// GET /api/alumnos  (opcional: ?condicion=aprobado)
router.get('/', (req, res) => {
  const { condicion } = req.query

  if (condicion !== undefined && !CONDICIONES.includes(condicion)) {
    return res.status(400).json({
      error: 'Parametro de consulta invalido',
      detalles: [`condicion debe ser una de: ${CONDICIONES.join(', ')}`]
    })
  }

  const listado = alumnos.map(representar)

  if (condicion === undefined) {
    return res.json(listado)
  }

  res.json(listado.filter((alumno) => alumno.condicion === condicion))
})

// GET /api/alumnos/:nombre
router.get('/:nombre', (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe un alumno con ese nombre' })
  }

  res.json(representar(alumnos[indice]))
})

// GET /api/alumnos/:nombre/notas
router.get('/:nombre/notas', (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe un alumno con ese nombre' })
  }

  res.json(representar(alumnos[indice]))
})

// POST /api/alumnos
router.post('/', validarCuerpoAlumno, (req, res) => {
  const { nombre, notas } = req.alumno

  if (buscarIndice(nombre) !== -1) {
    return res.status(409).json({ error: 'Ya existe un alumno con ese nombre' })
  }

  const alumno = { nombre, notas }
  alumnos.push(alumno)

  res
    .status(201)
    .set('Location', `/api/alumnos/${encodeURIComponent(nombre)}`)
    .json(representar(alumno))
})

// PUT /api/alumnos/:nombre  (reemplaza el registro completo)
router.put('/:nombre', validarCuerpoAlumno, (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe un alumno con ese nombre' })
  }

  const { nombre, notas } = req.alumno
  const repetido = buscarIndice(nombre)

  // Renombrar esta permitido, pero no hacia un nombre que ya ocupa otro alumno.
  if (repetido !== -1 && repetido !== indice) {
    return res.status(409).json({ error: 'Ya existe otro alumno con ese nombre' })
  }

  alumnos[indice] = { nombre, notas }
  res.json(representar(alumnos[indice]))
})

// PUT /api/alumnos/:nombre/notas  (reemplaza solo las calificaciones)
router.put('/:nombre/notas', validarCuerpoNotas, (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe un alumno con ese nombre' })
  }

  alumnos[indice].notas = req.notas
  res.json(representar(alumnos[indice]))
})

// DELETE /api/alumnos/:nombre
router.delete('/:nombre', (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe un alumno con ese nombre' })
  }

  alumnos.splice(indice, 1)
  res.status(204).end()
})

module.exports = router
