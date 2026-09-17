const express = require('express');
const aplicacion = express();
const puerto = 3003;

aplicacion.use(express.json());

let tareas = [
  { id: 1, nombre: 'Preparar presentación', completada: false },
  { id: 2, nombre: 'Revisar entregable', completada: true },
];

function normalizarNombreTarea(nombre) {
  return String(nombre).trim();
}

aplicacion.get('/tareas', (peticion, respuesta) => {
  const { completada } = peticion.query;

  let filtro = tareas;
  if (completada !== undefined) {
    const esCompletada = completada === 'true';
    filtro = tareas.filter((tarea) => tarea.completada === esCompletada);
  }

  respuesta.json(filtro);
});

aplicacion.get('/tareas/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const tarea = tareas.find((elemento) => elemento.id === id);

  if (!tarea) {
    return respuesta.status(404).json({ error: 'Tarea no encontrada.' });
  }

  return respuesta.json(tarea);
});

aplicacion.post('/tareas', (peticion, respuesta) => {
  const { nombre, completada } = peticion.body;
  const nombreNormalizado = normalizarNombreTarea(nombre);

  if (!nombreNormalizado) {
    return respuesta.status(400).json({ error: 'El nombre de la tarea es obligatorio.' });
  }

  if (tareas.some((tarea) => tarea.nombre.toLowerCase() === nombreNormalizado.toLowerCase())) {
    return respuesta.status(409).json({ error: 'Ya existe una tarea con ese nombre.' });
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    return respuesta.status(400).json({ error: 'El campo completada debe ser booleano.' });
  }

  const nuevaTarea = {
    id: Date.now(),
    nombre: nombreNormalizado,
    completada: Boolean(completada),
  };

  tareas.push(nuevaTarea);
  return respuesta.status(201).json(nuevaTarea);
});

aplicacion.put('/tareas/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const tarea = tareas.find((elemento) => elemento.id === id);

  if (!tarea) {
    return respuesta.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { nombre, completada } = peticion.body;

  if (nombre !== undefined) {
    const nombreNormalizado = normalizarNombreTarea(nombre);
    if (!nombreNormalizado) {
      return respuesta.status(400).json({ error: 'El nombre no puede quedar vacío.' });
    }

    const duplicado = tareas.some(
      (elemento) => elemento.id !== id && elemento.nombre.toLowerCase() === nombreNormalizado.toLowerCase()
    );

    if (duplicado) {
      return respuesta.status(409).json({ error: 'Ya existe otra tarea con ese nombre.' });
    }

    tarea.nombre = nombreNormalizado;
  }

  if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
      return respuesta.status(400).json({ error: 'El campo completada debe ser booleano.' });
    }

    tarea.completada = completada;
  }

  return respuesta.json(tarea);
});

aplicacion.delete('/tareas/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const longitudInicial = tareas.length;
  tareas = tareas.filter((elemento) => elemento.id !== id);

  if (tareas.length === longitudInicial) {
    return respuesta.status(404).json({ error: 'Tarea no encontrada.' });
  }

  return respuesta.status(204).send();
});

aplicacion.listen(puerto, () => {
  console.log(`Ejercicio 3 corriendo en http://localhost:${puerto}`);
});
