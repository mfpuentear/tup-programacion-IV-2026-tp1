const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

// Arreglo interno en memoria
let tareas = [];

// 1. GET /tareas (con soporte de filtro ?completada=true|false sobre copia)
app.get('/tareas', (req, res) => {
  const { completada } = req.query;
  let tareasFiltradas = [...tareas];

  if (completada !== undefined) {
    const valorLimpio = completada.trim().toLowerCase();

    if (valorLimpio !== 'true' && valorLimpio !== 'false') {
      return res.status(400).json({
        error: 'El parámetro "completada" solo admite "true" o "false".'
      });
    }

    const filtroBooleano = (valorLimpio === 'true');
    tareasFiltradas = tareasFiltradas.filter(t => t.completada === filtroBooleano);

    return res.status(200).json({
      filtro: filtroBooleano ? 'completadas' : 'pendientes',
      cantidad: tareasFiltradas.length,
      tareas: tareasFiltradas
    });
  }

  return res.status(200).json({
    total: tareasFiltradas.length,
    tareas: tareasFiltradas
  });
});

// 2. GET /tareas/:nombre
app.get('/tareas/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreBuscado);

  if (!tarea) {
    return res.status(404).json({ error: `No se encontró la tarea "${req.params.nombre}".` });
  }

  return res.status(200).json(tarea);
});

// 3. POST /tareas
app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio y debe ser texto.' });
  }

  const nombreLimpio = nombre.trim();

  const existe = tareas.some(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase());
  if (existe) {
    return res.status(409).json({ error: `Ya existe una tarea con el nombre "${nombreLimpio}".` });
  }

  const nuevaTarea = {
    nombre: nombreLimpio,
    completada: typeof completada === 'boolean' ? completada : false
  };

  tareas.push(nuevaTarea);
  return res.status(201).json(nuevaTarea);
});

// 4. PUT /tareas/:nombre
app.put('/tareas/:nombre', (req, res) => {
  const nombreParam = req.params.nombre.trim().toLowerCase();
  const indice = tareas.findIndex(t => t.nombre.toLowerCase() === nombreParam);

  if (indice === -1) {
    return res.status(404).json({ error: `No se encontró la tarea "${req.params.nombre}".` });
  }

  const { nombre: nuevoNombre, completada } = req.body;

  if (!nuevoNombre || typeof nuevoNombre !== 'string' || nuevoNombre.trim() === '') {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  if (typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'El campo "completada" debe ser true o false.' });
  }

  const nombreActualizado = nuevoNombre.trim();

  const colision = tareas.some((t, i) => i !== indice && t.nombre.toLowerCase() === nombreActualizado.toLowerCase());
  if (colision) {
    return res.status(409).json({ error: `Ya existe otra tarea con el nombre "${nombreActualizado}".` });
  }

  tareas[indice] = {
    nombre: nombreActualizado,
    completada: completada
  };

  return res.status(200).json(tareas[indice]);
});

// 5. DELETE /tareas/:nombre
app.delete('/tareas/:nombre', (req, res) => {
  const nombreParam = req.params.nombre.trim().toLowerCase();
  const indice = tareas.findIndex(t => t.nombre.toLowerCase() === nombreParam);

  if (indice === -1) {
    return res.status(404).json({ error: `No se encontró la tarea "${req.params.nombre}".` });
  }

  const eliminada = tareas.splice(indice, 1)[0];
  return res.status(200).json({
    mensaje: `Tarea "${eliminada.nombre}" eliminada exitosamente.`
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 3 activo en http://localhost:${PORT}`);
});