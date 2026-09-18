const express = require('express')
const tareas = require('./routes/tareas')

const app = express()

app.use(express.json())
app.use('/api/tareas', tareas)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: 'El cuerpo de la peticion no es un JSON valido'
    })
  }

  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

module.exports = app
