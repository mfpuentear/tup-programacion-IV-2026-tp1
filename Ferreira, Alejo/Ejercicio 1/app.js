const express = require('express')
const rectangulos = require('./routes/rectangulos')

const app = express()

// La API solo resuelve consultas de calculo, no recibe cuerpo en ninguna ruta,
// por eso no se monta express.json().
app.use('/api/rectangulos', rectangulos)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

module.exports = app
