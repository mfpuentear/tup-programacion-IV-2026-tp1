const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;

let tareas = [];

// Listar tareas (con filtro opcional por estado)
app.get('/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada === undefined) {
    return res.json(tareas);
  }

  if (completada !== 'true' && completada !== 'false') {
    return res.status(400).json({
      error: 'El parámetro "completada" debe ser "true" o "false"'
    });
  }

  const filtro = completada === 'true';
  res.json(tareas.filter((t) => t.completada === filtro));
});

// Consultar una tarea puntual
app.get('/tareas/:nombre', (req, res) => {
  const tarea = tareas.find((t) => t.nombre === req.params.nombre);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

// Crear una tarea
app.post('/tareas', (req, res) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'Debe indicar un nombre válido' });
  }

  const existe = tareas.some((t) => t.nombre === nombre);
  if (existe) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
  }

  const nuevaTarea = { nombre, completada: false };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// Marcar como completada/pendiente
app.patch('/tareas/:nombre', (req, res) => {
  const tarea = tareas.find((t) => t.nombre === req.params.nombre);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { completada } = req.body;
  if (typeof completada !== 'boolean') {
    return res.status(400).json({
      error: 'Debe indicar "completada" como true o false'
    });
  }

  tarea.completada = completada;
  res.json(tarea);
});

// Borrar una tarea
app.delete('/tareas/:nombre', (req, res) => {
  const index = tareas.findIndex((t) => t.nombre === req.params.nombre);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tareas.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});