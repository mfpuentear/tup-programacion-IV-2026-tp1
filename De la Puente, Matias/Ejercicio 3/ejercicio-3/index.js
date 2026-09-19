const express = require('express');
const app = express();

app.use(express.json());

let tareas = [];
let proximoId = 1;

function validarTarea(nombre, completada, idActual = null) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { ok: false, mensaje: 'El nombre de la tarea es obligatorio.' };
  }

  const nombreLimpio = nombre.trim();
  const existe = tareas.some(
    t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase() && t.id !== idActual
  );

  if (existe) {
    return { ok: false, mensaje: `Ya existe una tarea llamada '${nombreLimpio}'.` };
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    return { ok: false, mensaje: "El campo 'completada' debe ser booleano (true o false)." };
  }

  return { ok: true, nombre: nombreLimpio };
}


app.get('/api/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada !== undefined) {
    if (completada !== 'true' && completada !== 'false') {
      return res.status(400).json({ error: "El filtro 'completada' debe ser 'true' o 'false'." });
    }
    const estadoFiltro = completada === 'true';
    const filtradas = tareas.filter(t => t.completada === estadoFiltro);
    return res.status(200).json(filtradas);
  }

  return res.status(200).json(tareas);
});


app.get('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  return res.status(200).json(tarea);
});


app.post('/api/tareas', (req, res) => {
  const { nombre, completada = false } = req.body;

  const validacion = validarTarea(nombre, completada);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  const nuevaTarea = {
    id: proximoId++,
    nombre: validacion.nombre,
    completada
  };

  tareas.push(nuevaTarea);
  return res.status(201).json(nuevaTarea);
});


app.put('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { nombre, completada = tareas[index].completada } = req.body;
  const validacion = validarTarea(nombre, completada, id);

  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  tareas[index] = {
    id,
    nombre: validacion.nombre,
    completada
  };

  return res.status(200).json(tareas[index]);
});


app.patch('/api/tareas/:id/completar', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { completada } = req.body;
  if (typeof completada !== 'boolean') {
    return res.status(400).json({ error: "Debe enviar el campo 'completada' con valor boolean." });
  }

  tarea.completada = completada;
  return res.status(200).json(tarea);
});


app.delete('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  tareas.splice(index, 1);
  return res.status(200).json({ mensaje: 'Tarea eliminada con éxito.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Tareas iniciado en http://localhost:${PORT}`);
});