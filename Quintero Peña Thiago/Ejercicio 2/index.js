import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let alumnos = [
  { id: 1, nombre: 'Juan Pérez', notas: [8, 9, 8] },
  { id: 2, nombre: 'María Gómez', notas: [5, 6, 4] }
];
let proximoId = 3;

function obtenerEstadoAlumno(alumno) {
  const suma = alumno.notas.reduce((acc, n) => acc + n, 0);
  const promedio = Number((suma / alumno.notas.length).toFixed(2));

  let condicion = 'Reprobado';
  if (promedio >= 8) {
    condicion = 'Promocionado';
  } else if (promedio >= 6) {
    condicion = 'Aprobado';
  }

  return { ...alumno, promedio, condicion };
}

app.get('/api/v1/alumnos', (req, res) => {
  const lista = alumnos.map(obtenerEstadoAlumno);
  res.json(lista);
});

app.get('/api/v1/alumnos/:id', (req, res) => {
  const alumno = alumnos.find(a => a.id === parseInt(req.params.id));
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }
  res.json(obtenerEstadoAlumno(alumno));
});

app.post('/api/v1/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: 'Se requiere nombre y un arreglo de 3 notas.' });
  }

  const notasValidas = notas.every(n => typeof n === 'number' && n >= 0 && n <= 10);
  if (!notasValidas) {
    return res.status(400).json({ error: 'Las notas deben ser números entre 0 y 10.' });
  }

  const yaExiste = alumnos.some(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());
  if (yaExiste) {
    return res.status(409).json({ error: 'Ya existe un alumno registrado con ese nombre.' });
  }

  const nuevoAlumno = { id: proximoId++, nombre: nombre.trim(), notas };
  alumnos.push(nuevoAlumno);

  res.status(201).json(obtenerEstadoAlumno(nuevoAlumno));
});

app.listen(PORT, () => console.log(`Ejercicio 2 activo en puerto ${PORT}`));