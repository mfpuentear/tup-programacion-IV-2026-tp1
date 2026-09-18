const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tareas = [];

// Obtener todas las tareas
app.get("/tareas", (req, res) => {
    res.json(tareas);
});

// Crear una tarea
app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre) {
        return res.status(400).json({
            error: "El nombre de la tarea es obligatorio"
        });
    }

    // Verificar si ya existe una tarea con ese nombre
    const existe = tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: "Ya existe una tarea con ese nombre"
        });
    }

    const nuevaTarea = {
        nombre: nombre,
        completada: completada ?? false
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

// Obtener tareas completadas
app.get("/tareas/completadas", (req, res) => {
    const completadas = tareas.filter(
        tarea => tarea.completada === true
    );

    res.json(completadas);
});

// Obtener tareas pendientes
app.get("/tareas/pendientes", (req, res) => {
    const pendientes = tareas.filter(
        tarea => tarea.completada === false
    );

    res.json(pendientes);
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});