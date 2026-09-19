const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tareas = [];

app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre || typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El nombre y el estado de completada son obligatorios"
        });
    }

    const tareaExistente = tareas.find(
        tarea => tarea.nombre === nombre
    );

    if (tareaExistente) {
        return res.status(400).json({
            error: "Ya existe una tarea con ese nombre"
        });
    }

    tareas.push({
        nombre,
        completada
    });

    res.status(201).json({
        mensaje: "Tarea creada correctamente",
        tarea: {
            nombre,
            completada
        }
    });
});

app.get("/tareas", (req, res) => {
    res.json(tareas);
});

app.get("/tareas/completadas", (req, res) => {
    const tareasCompletadas = tareas.filter(
        tarea => tarea.completada === true
    );

    res.json(tareasCompletadas);
});

app.get("/tareas/pendientes", (req, res) => {
    const tareasPendientes = tareas.filter(
        tarea => tarea.completada === false
    );

    res.json(tareasPendientes);
});

app.put("/tareas/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, completada } = req.body;

    const tarea = tareas.find(
        tarea => tarea.nombre === nombreActual
    );

    if (!tarea) {
        return res.status(404).json({
            error: "Tarea no encontrada"
        });
    }

    if (!nombre || typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El nombre y el estado de completada son obligatorios"
        });
    }

    const tareaConEseNombre = tareas.find(
        tarea => tarea.nombre === nombre && tarea.nombre !== nombreActual
    );

    if (tareaConEseNombre) {
        return res.status(400).json({
            error: "Ya existe una tarea con ese nombre"
        });
    }

    tarea.nombre = nombre;
    tarea.completada = completada;

    res.json({
        mensaje: "Tarea modificada correctamente",
        tarea: {
            nombre: tarea.nombre,
            completada: tarea.completada
        }
    });
});

app.delete("/tareas/:nombre", (req, res) => {
    const { nombre } = req.params;

    const indice = tareas.findIndex(
        tarea => tarea.nombre === nombre
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada"
        });
    }

    tareas.splice(indice, 1);

    res.json({
        mensaje: "Tarea eliminada correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});