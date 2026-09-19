const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

const alumnos = [];

app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'nombre es requerido y debe ser texto' });
  }

  if (!Array.isArray(notas) || notas.length !== 3 || notas.some(n => typeof n !== 'number' || Number.isNaN(n) || n < 0 || n > 10)) {
    return res.status(400).json({ error: 'notas debe ser un arreglo de 3 números entre 0 y 10' });
  }

  const existe = alumnos.some(a => a.nombre === nombre);
  if (existe) {
    return res.status(400).json({ error: 'ya existe un alumno con ese nombre' });
  }

  alumnos.push({ nombre, notas });
  res.status(201).json({ nombre, notas });
});

app.get('/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;

  const alumno = alumnos.find(a => a.nombre === nombre);
  if (!alumno) {
    return res.status(404).json({ error: 'alumno no encontrado' });
  }

  const promedio = alumno.notas.reduce((suma, n) => suma + n, 0) / alumno.notas.length;

  let condicion;
  if (promedio < 6) {
    condicion = 'reprobado';
  } else if (promedio <= 7) {
    condicion = 'aprobado';
  } else {
    condicion = 'promocionado';
  }

  res.json({ nombre: alumno.nombre, notas: alumno.notas, promedio, condicion });
});

app.put('/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;
  const { nombre: nuevoNombre, notas } = req.body;

  const alumno = alumnos.find(a => a.nombre === nombre);
  if (!alumno) {
    return res.status(404).json({ error: 'alumno no encontrado' });
  }

    if (nuevoNombre !== undefined && typeof nuevoNombre !== 'string') {
    return res.status(400).json({ error: 'nombre debe ser texto' });
  }

  if (nuevoNombre && nuevoNombre !== nombre) {
    const existe = alumnos.some(a => a.nombre === nuevoNombre);
    if (existe) {
      return res.status(400).json({ error: 'ya existe un alumno con ese nombre' });
    }
    alumno.nombre = nuevoNombre;
  }

  if (notas) {
    if (!Array.isArray(notas) || notas.length !== 3 || notas.some(n => typeof n !== 'number' || Number.isNaN(n) || n < 0 || n > 10)) {
      return res.status(400).json({ error: 'notas debe ser un arreglo de 3 números entre 0 y 10' });
    }
    alumno.notas = notas;
  }

  res.json(alumno);
});

app.delete('/alumnos/:nombre', (req, res) => {
  const { nombre } = req.params;

  const index = alumnos.findIndex(a => a.nombre === nombre);
  if (index === -1) {
    return res.status(404).json({ error: 'alumno no encontrado' });
  }

  alumnos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});