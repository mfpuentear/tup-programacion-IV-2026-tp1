import express from 'express';

const app = express();
app.use(express.json());

// Almacenamiento en memoria: arreglo de alumnos.
// Cada alumno: { nombre: string, notas: number[3] }
let alumnos = [];

const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 10;
const CANTIDAD_NOTAS = 3;

function calcularPromedio(notas) {
  const suma = notas.reduce((acumulado, nota) => acumulado + nota, 0);
  return suma / notas.length;
}

function calcularCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio <= 7) return 'aprobado';
  return 'promocionado';
}

function validarNombre(nombre) {
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.';
  }
  return null;
}

function validarNotas(notas) {
  if (!Array.isArray(notas) || notas.length !== CANTIDAD_NOTAS) {
    return `El campo "notas" debe ser un arreglo de exactamente ${CANTIDAD_NOTAS} números.`;
  }

  for (const nota of notas) {
    if (typeof nota !== 'number' || Number.isNaN(nota)) {
      return 'Cada nota debe ser un valor numérico.';
    }
    if (nota < NOTA_MINIMA || nota > NOTA_MAXIMA) {
      return `Cada nota debe estar entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`;
    }
  }

  return null;
}

function buscarAlumnoPorNombre(nombre) {
  return alumnos.find(
    (alumno) => alumno.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

// Arma la representación pública de un alumno, agregando los datos derivados
// (promedio y condición) sin persistirlos en el objeto interno.
function serializarAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: Number(promedio.toFixed(2)),
    condicion: calcularCondicion(promedio),
  };
}

// GET /alumnos - listar todos los alumnos
app.get('/alumnos', (req, res) => {
  res.status(200).json(alumnos.map(serializarAlumno));
});

// GET /alumnos/:nombre - consultar un alumno puntual
app.get('/alumnos/:nombre', (req, res) => {
  const alumno = buscarAlumnoPorNombre(req.params.nombre);

  if (!alumno) {
    return res
      .status(404)
      .json({ error: `No existe un alumno con nombre "${req.params.nombre}".` });
  }

  res.status(200).json(serializarAlumno(alumno));
});

// POST /alumnos - crear un alumno nuevo
app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  const errores = [validarNombre(nombre), validarNotas(notas)].filter(Boolean);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  if (buscarAlumnoPorNombre(nombre)) {
    return res
      .status(409)
      .json({ error: `Ya existe un alumno con nombre "${nombre}".` });
  }

  const nuevoAlumno = { nombre, notas };
  alumnos.push(nuevoAlumno);

  res.status(201).json(serializarAlumno(nuevoAlumno));
});

// PUT /alumnos/:nombre - modificar un alumno existente
app.put('/alumnos/:nombre', (req, res) => {
  const alumno = buscarAlumnoPorNombre(req.params.nombre);

  if (!alumno) {
    return res
      .status(404)
      .json({ error: `No existe un alumno con nombre "${req.params.nombre}".` });
  }

  const { nombre, notas } = req.body;

  const errores = [validarNombre(nombre), validarNotas(notas)].filter(Boolean);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  // Si el nombre cambia, hay que verificar que no colisione con otro alumno.
  if (nombre.toLowerCase() !== alumno.nombre.toLowerCase()) {
    const colision = buscarAlumnoPorNombre(nombre);
    if (colision) {
      return res
        .status(409)
        .json({ error: `Ya existe un alumno con nombre "${nombre}".` });
    }
  }

  alumno.nombre = nombre;
  alumno.notas = notas;

  res.status(200).json(serializarAlumno(alumno));
});

// DELETE /alumnos/:nombre - eliminar un alumno
app.delete('/alumnos/:nombre', (req, res) => {
  const indice = alumnos.findIndex(
    (alumno) => alumno.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ error: `No existe un alumno con nombre "${req.params.nombre}".` });
  }

  alumnos.splice(indice, 1);
  res.status(204).send();
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
