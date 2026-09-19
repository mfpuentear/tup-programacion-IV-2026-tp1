import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let tareas = [
  { id: 1, nombre: 'Instalar Node.js', completada: true },
  { id: 2, nombre: 'Aprobar el examen de API', completada: false }
];
let proximoId = 3;

app.get('/api/v1/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada !== undefined) {
    const estado = completada === 'true';
    const filtradas = tareas.filter(t => t.completada === estado);
    return res.json(filtradas);
  }

  res.json(tareas);
});

app.post('/api/v1/tareas', (req, res) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre de la tarea es obligatorio.' });
  }

  const duplicada = tareas.some(t => t.nombre.toLowerCase() === nombre.trim().toLowerCase());
  if (duplicada) {
    return res.status(409).json({ error: 'La tarea ya existe.' });
  }

  const nuevaTarea = { id: proximoId++, nombre: nombre.trim(), completada: false };
  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

app.patch('/api/v1/tareas/:id/estado', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { completada } = req.body;
  if (typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'El campo completada debe ser un booleano (true/false).' });
  }

  tarea.completada = completada;
  res.json(tarea);
});

app.listen(PORT, () => console.log(`Ejercicio 3 activo en puerto ${PORT}`));