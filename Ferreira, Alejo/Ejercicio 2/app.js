const express = require('express')
const alumnos = require('./routes/alumnos')

const app = express()

app.use(express.json())
app.use('/api/alumnos', alumnos)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejador de errores. Atrapa, entre otras cosas, el JSON mal formado que
// express.json() rechaza antes de que la peticion llegue a las rutas.
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
