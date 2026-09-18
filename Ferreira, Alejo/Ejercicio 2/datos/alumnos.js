// Arreglo interno: unica fuente de datos de la API. Guarda solo lo propio del
// alumno (nombre y notas). El promedio y la condicion no se almacenan aca
// porque se derivan de las notas y quedarian desactualizados al modificarlas.
const alumnos = [
  { nombre: 'Ana Gomez', notas: [8, 9, 10] },
  { nombre: 'Bruno Diaz', notas: [6, 7, 6] },
  { nombre: 'Carla Ruiz', notas: [4, 5, 3] }
]

// Se compara sin distinguir mayusculas ni espacios de sobra para que
// "ana gomez" y "Ana  Gomez" no entren como dos alumnos distintos.
function normalizar (nombre) {
  return nombre.trim().replace(/\s+/g, ' ').toLowerCase()
}

function buscarIndice (nombre) {
  const buscado = normalizar(nombre)
  return alumnos.findIndex((alumno) => normalizar(alumno.nombre) === buscado)
}

module.exports = { alumnos, normalizar, buscarIndice }
