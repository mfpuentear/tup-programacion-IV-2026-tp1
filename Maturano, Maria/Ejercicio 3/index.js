const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

const tareas = [];

app.post('/tareas', (req, res) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'nombre es requerido y debe ser texto' });
  }

  const existe = tareas.some(t => t.nombre === nombre);
  if (existe) {
    return res.status(400).json({ error: 'ya existe una tarea con ese nombre' });
  }

  const nuevaTarea = { nombre, completada: false };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

app.get('/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada === undefined) {
    return res.json(tareas);
  }

  if (completada !== 'true' && completada !== 'false') {
    return res.status(400).json({ error: 'completada debe ser true o false' });
  }

  const valorBuscado = completada === 'true';
  const resultado = tareas.filter(t => t.completada === valorBuscado);
  res.json(resultado);
});

app.patch('/tareas/:nombre', (req, res) => {
  const { nombre } = req.params;
  const { completada } = req.body;

  const tarea = tareas.find(t => t.nombre === nombre);
  if (!tarea) {
    return res.status(404).json({ error: 'tarea no encontrada' });
  }

  if (typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'completada debe ser true o false' });
  }

  tarea.completada = completada;
  res.json(tarea);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});