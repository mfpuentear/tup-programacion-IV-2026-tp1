const CONDICIONES = ['reprobado', 'aprobado', 'promocionado']

function calcularPromedio (notas) {
  const suma = notas.reduce((total, nota) => total + nota, 0)
  return suma / notas.length
}

function obtenerCondicion (promedio) {
  if (promedio < 6) return 'reprobado'
  if (promedio < 8) return 'aprobado'
  return 'promocionado'
}

// Arma la representacion que devuelve la API: los datos guardados mas los
// derivados. La condicion se decide con el promedio sin redondear; el redondeo
// es solo para mostrar, si no un promedio de 5,996 se informaria como aprobado.
function representar (alumno) {
  const promedio = calcularPromedio(alumno.notas)

  return {
    nombre: alumno.nombre,
    notas: [...alumno.notas],
    promedio: Number(promedio.toFixed(2)),
    condicion: obtenerCondicion(promedio)
  }
}

module.exports = { CONDICIONES, calcularPromedio, obtenerCondicion, representar }
