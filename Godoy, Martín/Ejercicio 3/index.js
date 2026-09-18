import express from 'express';

const app = express();
app.use(express.json());

// arreglo interno donde se guardan las tareas
let tareas = [];

// GET /api/tareas/completadas -> solo las tareas ya completadas
// (esta ruta va antes que /api/tareas/:nombre para que "completadas"
// no se interprete como si fuera el nombre de una tarea)
app.get('/api/tareas/completadas', (req, res) => {
  const completadas = tareas.filter((t) => t.completada);
  res.json(completadas);
});

// GET /api/tareas/pendientes -> solo las tareas que faltan completar
app.get('/api/tareas/pendientes', (req, res) => {
  const pendientes = tareas.filter((t) => !t.completada);
  res.json(pendientes);
});

// GET /api/tareas -> lista todas las tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// GET /api/tareas/:nombre -> consulta una tarea puntual
app.get('/api/tareas/:nombre', (req, res) => {
  const tarea = tareas.find((t) => t.nombre === req.params.nombre);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.json(tarea);
});

// POST /api/tareas -> crea una tarea nueva
app.post('/api/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const yaExiste = tareas.some((t) => t.nombre === nombre);
  if (yaExiste) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
  }

  // si no mandan "completada", la tarea arranca como pendiente
  const nuevaTarea = {
    nombre,
    completada: completada === true
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// PUT /api/tareas/:nombre -> modifica nombre y/o estado de una tarea existente
app.put('/api/tareas/:nombre', (req, res) => {
  const tarea = tareas.find((t) => t.nombre === req.params.nombre);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { nombre, completada } = req.body;

  // si mandan un nombre nuevo, validarlo y chequear que no choque con otra tarea
  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre no es valido' });
    }

    const otraConEseNombre = tareas.some((t) => t.nombre === nombre && t !== tarea);
    if (otraConEseNombre) {
      return res.status(409).json({ error: 'Ya existe otra tarea con ese nombre' });
    }

    tarea.nombre = nombre;
  }

  // si mandan el estado, tiene que ser explicitamente true o false
  if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
      return res.status(400).json({ error: 'El campo "completada" debe ser true o false' });
    }
    tarea.completada = completada;
  }

  res.json(tarea);
});

// DELETE /api/tareas/:nombre -> elimina una tarea
app.delete('/api/tareas/:nombre', (req, res) => {
  const indice = tareas.findIndex((t) => t.nombre === req.params.nombre);

  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tareas.splice(indice, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
