const app = require('./app')

const PUERTO = process.env.PORT || 3003

app.listen(PUERTO, () => {
  console.log(`Ejercicio 3 escuchando en http://localhost:${PUERTO}`)
})
