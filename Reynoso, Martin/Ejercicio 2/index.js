import express from 'express';
const app = express();
const PORT = 3000;

app.use(express.json());

// Estado interno en memoria
let alumnos = [
  { id: 1, nombre: 'Juan Perez', notas: [8, 9, 8] },
  { id: 2, nombre: 'Maria Gomez', notas: [6, 7, 6] },
  { id: 3, nombre: 'Carlos Lopez', notas: [4, 5, 3] }
];

let proximoId = 4;

// Función auxiliar para calcular promedio y condición (Datos derivados)
const calcularEstado = (notas) => {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  const promedio = Number((suma / notas.length).toFixed(2));

  let condicion = 'reprobado';
  if (promedio >= 8) {
    condicion = 'promocionado';
  } else if (promedio >= 6) {
    condicion = 'aprobado';
  }

  return { promedio, condicion };
};

// Validación helper para el arreglo de notas
const validarNotas = (notas) => {
  return (
    Array.isArray(notas) &&
    notas.length === 3 &&
    notas.every((n) => typeof n === 'number' && n >= 0 && n <= 10)
  );
};

// GET /alumnos - Listar todos los alumnos con sus datos derivados
app.get('/alumnos', (req, res) => {
  const respuesta = alumnos.map((alumno) => {
    const { promedio, condicion } = calcularEstado(alumno.notas);
    return {
      id: alumno.id,
      nombre: alumno.nombre,
      notas: alumno.notas,
      promedio,
      condicion
    };
  });
  res.json(respuesta);
});

// GET /alumnos/:id - Consultar un alumno por ID con sus datos derivados
app.get('/alumnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { promedio, condicion } = calcularEstado(alumno.notas);
  res.json({
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion
  });
});

// POST /alumnos - Crear un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto.' });
  }

  if (!validarNotas(notas)) {
    return res.status(400).json({ error: 'Debe proporcionar exactamente 3 notas numéricas entre 0 y 10.' });
  }

  const nombreExiste = alumnos.some(
    (a) => a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (nombreExiste) {
    return res.status(409).json({ error: 'Ya existe un alumno con ese nombre.' });
  }

  const nuevoAlumno = {
    id: proximoId++,
    nombre: nombre.trim(),
    notas
  };

  alumnos.push(nuevoAlumno);

  const { promedio, condicion } = calcularEstado(nuevoAlumno.notas);
  res.status(201).json({
    id: nuevoAlumno.id,
    nombre: nuevoAlumno.nombre,
    notas: nuevoAlumno.notas,
    promedio,
    condicion
  });
});

// PUT /alumnos/:id - Modificar un alumno existente
app.put('/alumnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { nombre, notas } = req.body;

  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre debe ser un texto válido.' });
    }

    const nombreExiste = alumnos.some(
      (a) => a.id !== id && a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreExiste) {
      return res.status(409).json({ error: 'Ya existe otro alumno registrado con ese nombre.' });
    }

    alumno.nombre = nombre.trim();
  }

  if (notas !== undefined) {
    if (!validarNotas(notas)) {
      return res.status(400).json({ error: 'Debe proporcionar exactamente 3 notas numéricas entre 0 y 10.' });
    }
    alumno.notas = notas;
  }

  const { promedio, condicion } = calcularEstado(alumno.notas);
  res.json({
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion
  });
});

// DELETE /alumnos/:id - Eliminar un alumno
app.delete('/alumnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = alumnos.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const eliminado = alumnos.splice(index, 1)[0];
  res.json({ mensaje: `Alumno '${eliminado.nombre}' eliminado correctamente.` });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});