const express = require('express');
const app = express();
app.use(express.json());

let tareas = [];
let nextId = 1;

app.get('/tareas', (req, res) => {
    const { completada } = req.query;

    if (completada !== undefined) {
        const esCompletada = completada === 'true';
        const filtradas = tareas.filter(t => t.completada === esCompletada);
        return res.json(filtradas);
    }

    res.json(tareas);
});

app.post('/tareas', (req, res) => {
    const { nombre, completada = false } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la tarea es obligatorio' });
    }

    const existe = tareas.some(t => t.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (existe) {
        return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
    }

    const nuevaTarea = {
        id: nextId++,
        nombre: nombre.trim(),
        completada: Boolean(completada)
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

app.patch('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { completada } = req.body;

    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (typeof completada === 'boolean') {
        tarea.completada = completada;
    }

    res.json(tarea);
});

app.listen(3000, () => console.log('Ejercicio 3 en puerto 3000'));