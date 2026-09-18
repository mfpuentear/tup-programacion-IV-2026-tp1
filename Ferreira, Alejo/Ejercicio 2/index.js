const app = require('./app')

const PUERTO = process.env.PORT || 3002

app.listen(PUERTO, () => {
  console.log(`Ejercicio 2 escuchando en http://localhost:${PUERTO}`)
})
