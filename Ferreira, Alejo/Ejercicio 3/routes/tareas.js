const { Router } = require('express')
const { tareas, buscarIndice } = require('../datos/tareas')
const {
  validarTareaNueva,
  validarTareaCompleta,
  validarCambioParcial
} = require('../middlewares/validarTarea')

const router = Router()

// GET /api/tareas  (opcional: ?completada=true | ?completada=false)
router.get('/', (req, res) => {
  const { completada } = req.query

  if (completada === undefined) {
    return res.json(tareas)
  }

  if (completada !== 'true' && completada !== 'false') {
    return res.status(400).json({
      error: 'Parametro de consulta invalido',
      detalles: ['completada debe ser true o false']
    })
  }

  // La query siempre llega como texto, por eso la comparacion es contra 'true'.
  const buscado = completada === 'true'
  res.json(tareas.filter((tarea) => tarea.completada === buscado))
})

// GET /api/tareas/:nombre
router.get('/:nombre', (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe una tarea con ese nombre' })
  }

  res.json(tareas[indice])
})

// POST /api/tareas
router.post('/', validarTareaNueva, (req, res) => {
  const { nombre, completada } = req.tarea

  if (buscarIndice(nombre) !== -1) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' })
  }

  const tarea = { nombre, completada }
  tareas.push(tarea)

  res
    .status(201)
    .set('Location', `/api/tareas/${encodeURIComponent(nombre)}`)
    .json(tarea)
})

// PUT /api/tareas/:nombre  (reemplazo completo)
router.put('/:nombre', validarTareaCompleta, (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe una tarea con ese nombre' })
  }

  const { nombre, completada } = req.tarea
  const repetido = buscarIndice(nombre)

  if (repetido !== -1 && repetido !== indice) {
    return res.status(409).json({ error: 'Ya existe otra tarea con ese nombre' })
  }

  tareas[indice] = { nombre, completada }
  res.json(tareas[indice])
})

// PATCH /api/tareas/:nombre  (actualizacion parcial: marcar, desmarcar o renombrar)
router.patch('/:nombre', validarCambioParcial, (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe una tarea con ese nombre' })
  }

  if (req.cambios.nombre !== undefined) {
    const repetido = buscarIndice(req.cambios.nombre)

    if (repetido !== -1 && repetido !== indice) {
      return res.status(409).json({ error: 'Ya existe otra tarea con ese nombre' })
    }
  }

  tareas[indice] = { ...tareas[indice], ...req.cambios }
  res.json(tareas[indice])
})

// DELETE /api/tareas/:nombre
router.delete('/:nombre', (req, res) => {
  const indice = buscarIndice(req.params.nombre)

  if (indice === -1) {
    return res.status(404).json({ error: 'No existe una tarea con ese nombre' })
  }

  tareas.splice(indice, 1)
  res.status(204).end()
})

module.exports = router
