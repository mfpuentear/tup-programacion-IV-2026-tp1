import express from 'express';
const app = express();
const PORT = 3000;

app.use(express.json());

let tareas = [
  { id: 1, nombre: 'Instalar ExpressJS', completada: true },
  { id: 2, nombre: 'Diseñar endpoints de la API', completada: true },
  { id: 3, nombre: 'Escribir pruebas en archivo HTTP', completada: false }
];

let proximoId = 4;

app.get('/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada !== undefined) {
    if (completada !== 'true' && completada !== 'false') {
      return res.status(400).json({ error: "El parámetro 'completada' debe ser 'true' o 'false'." });
    }
    const estadoFiltro = completada === 'true';
    const filtradas = tareas.filter((t) => t.completada === estadoFiltro);
    return res.json(filtradas);
  }

  res.json(tareas);
});

app.get('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  res.json(tarea);
});

app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la tarea es obligatorio y debe ser texto.' });
  }

  const nombreExiste = tareas.some(
    (t) => t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (nombreExiste) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre.' });
  }

  const nuevaTarea = {
    id: proximoId++,
    nombre: nombre.trim(),
    completada: typeof completada === 'boolean' ? completada : false
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { nombre, completada } = req.body;

  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre debe ser un texto válido.' });
    }

    const nombreExiste = tareas.some(
      (t) => t.id !== id && t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreExiste) {
      return res.status(409).json({ error: 'Ya existe otra tarea registrada con ese nombre.' });
    }

    tarea.nombre = nombre.trim();
  }

  if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
      return res.status(400).json({ error: "El campo 'completada' debe ser booleano (true/false)." });
    }
    tarea.completada = completada;
  }

  res.json(tarea);
});

app.patch('/tareas/:id/completar', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { completada } = req.body;

  if (completada !== undefined && typeof completada !== 'boolean') {
    return res.status(400).json({ error: "El campo 'completada' debe ser booleano." });
  }

  tarea.completada = completada !== undefined ? completada : !tarea.completada;
  res.json(tarea);
});

app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const eliminada = tareas.splice(index, 1)[0];
  res.json({ mensaje: `Tarea '${eliminada.nombre}' eliminada correctamente.` });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});