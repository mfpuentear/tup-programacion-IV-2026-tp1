const app = require('./app')

const PUERTO = process.env.PORT || 3001

app.listen(PUERTO, () => {
  console.log(`Ejercicio 1 escuchando en http://localhost:${PUERTO}`)
})
