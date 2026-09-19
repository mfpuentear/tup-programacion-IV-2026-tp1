const express = require('express');
const app = express();

app.use(express.json());

let alumnos = [];
let proximoId = 1;

function calcularPromedioYCondicion(notas) {
  const suma = notas.reduce((acc, n) => acc + n, 0);
  const promedio = Number((suma / notas.length).toFixed(2));

  let condicion = 'Reprobado';
  if (promedio >= 8) {
    condicion = 'Promocionado';
  } else if (promedio >= 6) {
    condicion = 'Aprobado';
  }

  return { promedio, condicion };
}

function validarAlumno(nombre, notas, idActual = null) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { ok: false, mensaje: 'El nombre es obligatorio y debe ser un texto.' };
  }

  const existeNombre = alumnos.some(
    (a) => a.nombre.toLowerCase() === nombre.trim().toLowerCase() && a.id !== idActual
  );
  if (existeNombre) {
    return { ok: false, mensaje: 'Ya existe un alumno registrado con ese nombre.' };
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return { ok: false, mensaje: 'Ingresar exactamente un arreglo con 3 notas.' };
  }

  const notasValidas = notas.every(
    (n) => typeof n === 'number' && !isNaN(n) && n >= 0 && n <= 10
  );
  if (!notasValidas) {
    return { ok: false, mensaje: 'Las notas deben ser números comprendidos entre 0 y 10.' };
  }

  return { ok: true };
}

app.get('/api/alumnos', (req, res) => {
  const respuesta = alumnos.map((alumno) => {
    const { promedio, condicion } = calcularPromedioYCondicion(alumno.notas);
    return { ...alumno, promedio, condicion };
  });
  return res.status(200).json(respuesta);
});

app.get('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { promedio, condicion } = calcularPromedioYCondicion(alumno.notas);
  return res.status(200).json({ ...alumno, promedio, condicion });
});

app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  const validacion = validarAlumno(nombre, notas);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  const nuevoAlumno = {
    id: proximoId++,
    nombre: nombre.trim(),
    notas
  };

  alumnos.push(nuevoAlumno);

  const { promedio, condicion } = calcularPromedioYCondicion(nuevoAlumno.notas);
  return res.status(201).json({ ...nuevoAlumno, promedio, condicion });
});

app.put('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumnoIndex = alumnos.findIndex((a) => a.id === id);

  if (alumnoIndex === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { nombre, notas } = req.body;
  const validacion = validarAlumno(nombre, notas, id);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  alumnos[alumnoIndex] = {
    id,
    nombre: nombre.trim(),
    notas
  };

  const { promedio, condicion } = calcularPromedioYCondicion(alumnos[alumnoIndex].notas);
  return res.status(200).json({ ...alumnos[alumnoIndex], promedio, condicion });
});

app.delete('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumnoIndex = alumnos.findIndex((a) => a.id === id);

  if (alumnoIndex === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  alumnos.splice(alumnoIndex, 1);
  return res.status(200).json({ mensaje: 'Alumno eliminado correctamente.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de alumnos corriendo en http://localhost:${PORT}`);
});