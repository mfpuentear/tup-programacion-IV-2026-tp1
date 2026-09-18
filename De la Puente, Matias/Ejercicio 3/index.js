const express = require("express");

const app = express();
const PORT = 3003;

app.use(express.json());

const tareas = [];


// Crear tarea
app.post("/tareas", (req, res) => {
    let { nombre, completada } = req.body;

    if (typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre es obligatorio"
        });
    }

    nombre = nombre.trim();

    const existe = tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        return res.status(400).json({
            error: "Ya existe una tarea con ese nombre"
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "Completada debe ser true o false"
        });
    }

    const tarea = {
        nombre,
        completada
    };

    tareas.push(tarea);

    return res.status(201).json(tarea);
});


// Listar y filtrar tareas
app.get("/tareas", (req, res) => {
    const { estado } = req.query;

    if (estado === undefined) {
        return res.status(200).json(tareas);
    }

    if (estado === "completadas") {
        return res.status(200).json(
            tareas.filter(tarea => tarea.completada)
        );
    }

    if (estado === "pendientes") {
        return res.status(200).json(
            tareas.filter(tarea => !tarea.completada)
        );
    }

    return res.status(400).json({
        error: "El estado debe ser completadas o pendientes"
    });
});


app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});