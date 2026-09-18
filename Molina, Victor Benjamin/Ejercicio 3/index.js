const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tareas = [];

app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre de la tarea es obligatorio."
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false."
        });
    }

    const tareaExistente = tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (tareaExistente) {
        return res.status(400).json({
            error: "Ya existe una tarea con ese nombre."
        });
    }

    const nuevaTarea = {
        nombre: nombre.trim(),
        completada
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

app.get("/tareas", (req, res) => {
    const { completada } = req.query;

    if (completada === undefined) {
        return res.status(200).json(tareas);
    }

    if (completada !== "true" && completada !== "false") {
        return res.status(400).json({
            error: "El parámetro completada debe ser true o false."
        });
    }

    const estado = completada === "true";

    const resultado = tareas.filter(
        tarea => tarea.completada === estado
    );

    res.status(200).json(resultado);
});

app.get("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const tarea = tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!tarea) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    res.status(200).json(tarea);
});

app.put("/tareas/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, completada } = req.body;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre de la tarea es obligatorio."
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false."
        });
    }

    const nombreRepetido = tareas.some(
        (tarea, i) =>
            i !== indice &&
            tarea.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreRepetido) {
        return res.status(400).json({
            error: "Ya existe una tarea con ese nombre."
        });
    }

    tareas[indice] = {
        nombre: nombre.trim(),
        completada
    };

    res.status(200).json(tareas[indice]);
});


app.delete("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    const tareaEliminada = tareas.splice(indice, 1)[0];

    res.status(200).json({
        mensaje: "Tarea eliminada correctamente.",
        tarea: tareaEliminada
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});