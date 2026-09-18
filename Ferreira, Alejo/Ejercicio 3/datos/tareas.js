// Arreglo interno con las tareas. Cada tarea tiene el nombre que la identifica
// y el estado que indica si ya fue completada.
const tareas = [
  { nombre: 'Preparar el entorno', completada: true },
  { nombre: 'Leer el enunciado', completada: true },
  { nombre: 'Escribir los endpoints', completada: false },
  { nombre: 'Probar con REST Client', completada: false }
]

function normalizar (nombre) {
  return nombre.trim().replace(/\s+/g, ' ').toLowerCase()
}

function buscarIndice (nombre) {
  const buscado = normalizar(nombre)
  return tareas.findIndex((tarea) => normalizar(tarea.nombre) === buscado)
}

module.exports = { tareas, normalizar, buscarIndice }
