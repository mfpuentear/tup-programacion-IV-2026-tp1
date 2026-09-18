const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

let tareas = [];
let proximoId = 1;

// GET: listar todas las tareas
app.get('/api/tareas', (req, res) => {
    return res.status(200).json(tareas);
});

// GET: buscar una sola tarea por id
app.get('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "el id debe ser un numero" });
    }

    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        return res.status(404).json({ error: "tarea no encontrada" });
    }

    return res.status(200).json(tarea);
});

// POST: crear una tarea
app.post('/api/tareas', (req, res) => {
    const { titulo } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ error: "el titulo es obligatorio y debe ser texto" });
    }

    const nuevaTarea = {
        id: proximoId++,
        titulo: titulo.trim(),
        completada: false
    };

    tareas.push(nuevaTarea);
    return res.status(201).json({ mensaje: "tarea creada", tarea: nuevaTarea });
});

// PUT: actualizar tarea (titulo o si esta completa)
app.put('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "el id debe ser un numero" });
    }

    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        return res.status(404).json({ error: "tarea no encontrada" });
    }

    const { titulo, completada } = req.body;

    if (titulo !== undefined) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({ error: "el titulo debe ser texto valido" });
        }
        tarea.titulo = titulo.trim();
    }

    if (completada !== undefined) {
        if (typeof completada !== 'boolean') {
            return res.status(400).json({ error: "el campo completada debe ser true o false" });
        }
        tarea.completada = completada;
    }

    return res.status(200).json({ mensaje: "tarea actualizada", tarea });
});

// DELETE: borrar una tarea por id
app.delete('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "el id debe ser un numero" });
    }

    const index = tareas.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "tarea no encontrada" });
    }

    tareas.splice(index, 1);
    return res.status(200).json({ mensaje: "tarea eliminada correctamente" });
});

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});