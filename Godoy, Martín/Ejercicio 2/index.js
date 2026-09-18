import express from 'express';

const app = express();
app.use(express.json());

// arreglo interno donde se guardan los alumnos
let alumnos = [];

// calcula el promedio de las 3 notas de un alumno
function calcularPromedio(notas) {
  const suma = notas[0] + notas[1] + notas[2];
  return suma / 3;
}

// calcula la condicion academica segun el promedio
function calcularCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio < 8) return 'aprobado';
  return 'promocionado';
}

// arma la info completa de un alumno para devolver en las respuestas, incluyendo promedio y condicion
function armarRespuestaAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion: calcularCondicion(promedio)
  };
}

// valida que las notas sean un arreglo de 3 numeros entre 0 y 10
function notasValidas(notas) {
  if (!Array.isArray(notas) || notas.length !== 3) return false;
  return notas.every((nota) => typeof nota === 'number' && !isNaN(nota) && nota >= 0 && nota <= 10);
}

// GET /api/alumnos  lista todos los alumnos con su promedio y condicion
app.get('/api/alumnos', (req, res) => {
  const respuesta = alumnos.map(armarRespuestaAlumno);
  res.json(respuesta);
});

// GET /api/alumnos/:nombre  consulta un alumno puntual
app.get('/api/alumnos/:nombre', (req, res) => {
  const alumno = alumnos.find((a) => a.nombre === req.params.nombre);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  res.json(armarRespuestaAlumno(alumno));
});

// POST /api/alumnos  crea un alumno nuevo
app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  if (!notasValidas(notas)) {
    return res.status(400).json({ error: 'Las notas deben ser un arreglo de 3 numeros entre 0 y 10' });
  }

  const yaExiste = alumnos.some((a) => a.nombre === nombre);
  if (yaExiste) {
    return res.status(409).json({ error: 'Ya existe un alumno con ese nombre' });
  }

  const nuevoAlumno = { nombre, notas };
  alumnos.push(nuevoAlumno);

  res.status(201).json(armarRespuestaAlumno(nuevoAlumno));
});

// PUT /api/alumnos/:nombre  modifica nombre y/o notas de un alumno existente
app.put('/api/alumnos/:nombre', (req, res) => {
  const alumno = alumnos.find((a) => a.nombre === req.params.nombre);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  const { nombre, notas } = req.body;

  // si mandan un nombre nuevo, validarlo y chequear que no choque con otro alumno
  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre no es valido' });
    }

    const otroConEseNombre = alumnos.some((a) => a.nombre === nombre && a !== alumno);
    if (otroConEseNombre) {
      return res.status(409).json({ error: 'Ya existe otro alumno con ese nombre' });
    }

    alumno.nombre = nombre;
  }

  // si mandan notas nuevas, validarlas antes de reemplazarlas
  if (notas !== undefined) {
    if (!notasValidas(notas)) {
      return res.status(400).json({ error: 'Las notas deben ser un arreglo de 3 numeros entre 0 y 10' });
    }
    alumno.notas = notas;
  }

  res.json(armarRespuestaAlumno(alumno));
});

// DELETE /api/alumnos/:nombre  elimina un alumno
app.delete('/api/alumnos/:nombre', (req, res) => {
  const indice = alumnos.findIndex((a) => a.nombre === req.params.nombre);

  if (indice === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  alumnos.splice(indice, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});