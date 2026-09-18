const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Arreglo interno en memoria (solo almacena nombre y notas)
let alumnos = [];

/**
 * Función auxiliar para calcular datos derivados.
 * Requisito del enunciado: El promedio y la condición académica NO se guardan en el arreglo interno.
 */
function calcularDatosDerivados(alumno) {
  const suma = alumno.notas.reduce((acumulado, nota) => acumulado + nota, 0);
  const promedio = Number((suma / alumno.notas.length).toFixed(2));

  let condicion = 'reprobado';
  if (promedio >= 8) {
    condicion = 'promocionado';
  } else if (promedio >= 6) {
    condicion = 'aprobado';
  }

  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: promedio,
    condicion: condicion
  };
}

/**
 * Validador manual de campos del alumno sin librerías externas.
 */
function validarDatosAlumno(body) {
  const { nombre, notas } = body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { error: 'El nombre es obligatorio y debe ser una cadena de texto válida.' };
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return { error: 'El campo "notas" debe ser un arreglo con exactamente 3 notas.' };
  }

  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    if (typeof nota !== 'number' || isNaN(nota) || nota < 1 || nota > 10) {
      return { error: 'Cada nota debe ser un número comprendido entre 1 y 10.' };
    }
  }

  return {
    nombreLimpio: nombre.trim(),
    notasValidas: notas
  };
}

// 1. GET /alumnos -> Consultar todas las notas y condiciones
app.get('/alumnos', (req, res) => {
  const listadoConDerivados = alumnos.map(calcularDatosDerivados);
  return res.status(200).json(listadoConDerivados);
});

// 2. GET /alumnos/:nombre -> Consultar un alumno específico por parámetro de ruta
app.get('/alumnos/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreBuscado);

  if (!alumno) {
    return res.status(404).json({ error: `No se encontró el alumno "${req.params.nombre}".` });
  }

  return res.status(200).json(calcularDatosDerivados(alumno));
});

// 3. POST /alumnos -> Registrar nuevo alumno
app.post('/alumnos', (req, res) => {
  const validacion = validarDatosAlumno(req.body);
  if (validacion.error) {
    return res.status(400).json({ error: validacion.error });
  }

  const { nombreLimpio, notasValidas } = validacion;

  const existe = alumnos.some(a => a.nombre.toLowerCase() === nombreLimpio.toLowerCase());
  if (existe) {
    return res.status(409).json({ error: `Ya existe un alumno con el nombre "${nombreLimpio}".` });
  }

  const nuevoAlumno = {
    nombre: nombreLimpio,
    notas: notasValidas
  };

  alumnos.push(nuevoAlumno);
  return res.status(201).json(calcularDatosDerivados(nuevoAlumno));
});

// 4. PUT /alumnos/:nombre -> Modificar calificaciones o nombre
app.put('/alumnos/:nombre', (req, res) => {
  const nombreParam = req.params.nombre.trim().toLowerCase();
  const indice = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreParam);

  if (indice === -1) {
    return res.status(404).json({ error: `No se encontró el alumno "${req.params.nombre}".` });
  }

  const validacion = validarDatosAlumno(req.body);
  if (validacion.error) {
    return res.status(400).json({ error: validacion.error });
  }

  const { nombreLimpio, notasValidas } = validacion;

  const colision = alumnos.some((a, i) => i !== indice && a.nombre.toLowerCase() === nombreLimpio.toLowerCase());
  if (colision) {
    return res.status(409).json({ error: `Ya existe otro alumno con el nombre "${nombreLimpio}".` });
  }

  alumnos[indice] = {
    nombre: nombreLimpio,
    notas: notasValidas
  };

  return res.status(200).json(calcularDatosDerivados(alumnos[indice]));
});

// 5. DELETE /alumnos/:nombre -> Eliminar alumno
app.delete('/alumnos/:nombre', (req, res) => {
  const nombreParam = req.params.nombre.trim().toLowerCase();
  const indice = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreParam);

  if (indice === -1) {
    return res.status(404).json({ error: `No se encontró el alumno "${req.params.nombre}".` });
  }

  const eliminado = alumnos.splice(indice, 1)[0];
  return res.status(200).json({
    mensaje: `Alumno "${eliminado.nombre}" eliminado exitosamente.`
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 2 activo en http://localhost:${PORT}`);
});