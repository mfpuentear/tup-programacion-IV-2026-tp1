const express = require('express');
const aplicacion = express();
const puerto = 3002;

aplicacion.use(express.json());

let alumnos = [
  { id: 1, nombre: 'Ana', notas: [8, 7, 9] },
  { id: 2, nombre: 'Lucas', notas: [6, 5, 6] },
];

function calcularPromedio(notas) {
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

function obtenerCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio >= 6 && promedio <= 7) return 'aprobado';
  return 'promocionado';
}

function validarNotas(notas) {
  return (
    Array.isArray(notas) &&
    notas.length === 3 &&
    notas.every((nota) => typeof nota === 'number' && Number.isFinite(nota) && nota >= 0 && nota <= 10)
  );
}

function normalizarNombre(nombre) {
  return String(nombre).trim();
}

function resumirAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);

  return {
    ...alumno,
    promedio: Number(promedio.toFixed(2)),
    condicion: obtenerCondicion(promedio),
  };
}

aplicacion.get('/alumnos', (peticion, respuesta) => {
  respuesta.json(alumnos.map(resumirAlumno));
});

aplicacion.get('/alumnos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const alumno = alumnos.find((elemento) => elemento.id === id);

  if (!alumno) {
    return respuesta.status(404).json({ error: 'Alumno no encontrado.' });
  }

  return respuesta.json(resumirAlumno(alumno));
});

aplicacion.post('/alumnos', (peticion, respuesta) => {
  const { nombre, notas } = peticion.body;
  const nombreNormalizado = normalizarNombre(nombre);

  if (!nombreNormalizado) {
    return respuesta.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  if (alumnos.some((alumno) => alumno.nombre.toLowerCase() === nombreNormalizado.toLowerCase())) {
    return respuesta.status(409).json({ error: 'Ya existe un alumno con ese nombre.' });
  }

  if (!validarNotas(notas)) {
    return respuesta.status(400).json({
      error: 'Las notas deben ser un arreglo de tres valores numéricos entre 0 y 10.',
    });
  }

  const nuevoAlumno = {
    id: Date.now(),
    nombre: nombreNormalizado,
    notas,
  };

  alumnos.push(nuevoAlumno);
  return respuesta.status(201).json(resumirAlumno(nuevoAlumno));
});

aplicacion.put('/alumnos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const alumno = alumnos.find((elemento) => elemento.id === id);

  if (!alumno) {
    return respuesta.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { nombre, notas } = peticion.body;

  if (nombre !== undefined) {
    const nombreNormalizado = normalizarNombre(nombre);
    if (!nombreNormalizado) {
      return respuesta.status(400).json({ error: 'El nombre no puede quedar vacío.' });
    }

    const duplicado = alumnos.some(
      (elemento) => elemento.id !== id && elemento.nombre.toLowerCase() === nombreNormalizado.toLowerCase()
    );

    if (duplicado) {
      return respuesta.status(409).json({ error: 'Ya existe otro alumno con ese nombre.' });
    }

    alumno.nombre = nombreNormalizado;
  }

  if (notas !== undefined) {
    if (!validarNotas(notas)) {
      return respuesta.status(400).json({
        error: 'Las notas deben ser un arreglo de tres valores numéricos entre 0 y 10.',
      });
    }

    alumno.notas = notas;
  }

  return respuesta.json(resumirAlumno(alumno));
});

aplicacion.delete('/alumnos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const longitudInicial = alumnos.length;
  alumnos = alumnos.filter((elemento) => elemento.id !== id);

  if (alumnos.length === longitudInicial) {
    return respuesta.status(404).json({ error: 'Alumno no encontrado.' });
  }

  return respuesta.status(204).send();
});

aplicacion.listen(puerto, () => {
  console.log(`Ejercicio 2 corriendo en http://localhost:${puerto}`);
});
