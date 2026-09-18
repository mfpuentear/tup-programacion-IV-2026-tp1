import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

let tareas = [
    {
        nombre: "Estudiar JavaScript",
        completada: false
    },
    {
        nombre: "Hacer el TP",
        completada: true
    }
];

app.get("/tareas", (req, res) => {
    const { completada } = req.query;

    if (completada === undefined) {
        return res.json(tareas);
    }

    if (completada !== "true" && completada !== "false") {
        return res.status(400).json({
            error: "El valor de completada debe ser true o false"
        });
    }

    const estado = completada === "true";

    const tareasFiltradas = tareas.filter(
        tarea => tarea.completada === estado
    );

    res.json(tareasFiltradas);
});

app.get("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const tarea = tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!tarea) {
        return res.status(404).json({
            error: "Tarea no encontrada"
        });
    }

    res.json(tarea);
});

app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre de la tarea es obligatorio"
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false"
        });
    }

    const tareaExistente = tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (tareaExistente) {
        return res.status(409).json({
            error: "Ya existe una tarea con ese nombre"
        });
    }

    const nuevaTarea = {
        nombre: nombre.trim(),
        completada
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

app.put("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const { completada } = req.body;

    const tarea = tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!tarea) {
        return res.status(404).json({
            error: "Tarea no encontrada"
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false"
        });
    }

    tarea.completada = completada;

    res.json(tarea);
});

app.delete("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada"
        });
    }

    const tareaEliminada = tareas.splice(indice, 1)[0];

    res.json({
        mensaje: "Tarea eliminada correctamente",
        tarea: tareaEliminada
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});