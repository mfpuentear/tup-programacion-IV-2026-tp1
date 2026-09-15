const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;

let alumnos = [];

function calcularPromedio(notas) {
  const suma = notas.reduce((acc, n) => acc + n, 0);
  return suma / notas.length;
}

function calcularCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio <= 7) return 'aprobado';
  return 'promocionado';
}

function alumnoConDatosDerivados(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion: calcularCondicion(promedio)
  };
}

function notasValidas(notas) {
  return (
    Array.isArray(notas) &&
    notas.length === 3 &&
    notas.every((n) => typeof n === 'number' && n >= 0 && n <= 10)
  );
}

// Listar todos los alumnos
app.get('/alumnos', (req, res) => {
  res.json(alumnos.map(alumnoConDatosDerivados));
});

// Consultar un alumno puntual
app.get('/alumnos/:nombre', (req, res) => {
  const alumno = alumnos.find((a) => a.nombre === req.params.nombre);
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }
  res.json(alumnoConDatosDerivados(alumno));
});

// Crear un alumno
app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'Debe indicar un nombre válido' });
  }

  if (!notasValidas(notas)) {
    return res.status(400).json({
      error: 'Debe indicar un arreglo de exactamente 3 notas numéricas entre 0 y 10'
    });
  }

  const existe = alumnos.some((a) => a.nombre === nombre);
  if (existe) {
    return res.status(409).json({ error: 'Ya existe un alumno con ese nombre' });
  }

  const nuevoAlumno = { nombre, notas };
  alumnos.push(nuevoAlumno);
  res.status(201).json(alumnoConDatosDerivados(nuevoAlumno));
});

// Modificar las notas de un alumno
app.put('/alumnos/:nombre', (req, res) => {
  const alumno = alumnos.find((a) => a.nombre === req.params.nombre);
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  const { notas } = req.body;
  if (!notasValidas(notas)) {
    return res.status(400).json({
      error: 'Debe indicar un arreglo de exactamente 3 notas numéricas entre 0 y 10'
    });
  }

  alumno.notas = notas;
  res.json(alumnoConDatosDerivados(alumno));
});

// Borrar un alumno
app.delete('/alumnos/:nombre', (req, res) => {
  const index = alumnos.findIndex((a) => a.nombre === req.params.nombre);
  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  alumnos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});