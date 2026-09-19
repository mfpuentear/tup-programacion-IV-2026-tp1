// Trabajo práctico - Joaquín Villarruel
const express = require('express');

const app = express();

app.use(express.json());

// Arreglo interno de tareas
const tareas = [];

// Ver todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Ver tareas completadas
app.get('/tareas/completadas', (req, res) => {
    const completadas = tareas.filter(tarea => tarea.completada === true);

    res.json(completadas);
});

// Ver tareas pendientes
app.get('/tareas/pendientes', (req, res) => {
    const pendientes = tareas.filter(tarea => tarea.completada === false);

    res.json(pendientes);
});

// Consultar una tarea por nombre
app.get('/tareas/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    const tarea = tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!tarea) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    res.json(tarea);
});

// Crear una tarea
app.post('/tareas', (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre || typeof completada !== 'boolean') {
        return res.status(400).json({
            error: 'El nombre y el estado de completada son obligatorios'
        });
    }

    const existe = tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: 'Ya existe una tarea con ese nombre'
        });
    }

    const nuevaTarea = {
        nombre,
        completada
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

// Modificar una tarea
app.put('/tareas/:nombre', (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, completada } = req.body;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    if (!nombre || typeof completada !== 'boolean') {
        return res.status(400).json({
            error: 'El nombre y el estado de completada son obligatorios'
        });
    }

    const nombreRepetido = tareas.some(
        (tarea, i) =>
            i !== indice &&
            tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreRepetido) {
        return res.status(409).json({
            error: 'Ya existe otra tarea con ese nombre'
        });
    }

    tareas[indice] = {
        nombre,
        completada
    };

    res.json(tareas[indice]);
});

// Eliminar una tarea
app.delete('/tareas/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    const tareaEliminada = tareas.splice(indice, 1);

    res.json({
        mensaje: 'Tarea eliminada correctamente',
        tarea: tareaEliminada[0]
    });
});

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});