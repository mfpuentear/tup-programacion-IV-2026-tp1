const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo donde se guardan las tareas.
const tareas = [];

// Quita espacios del nombre y verifica que sea texto.
function limpiarNombre(nombre) {
    if (typeof nombre !== "string") {
        return "";
    }

    return nombre.trim();
}

// Busca si ya existe una tarea con el mismo nombre.
function tareaDuplicada(nombre) {
    return tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );
}

// Valida los datos recibidos para una tarea.
function validarTarea(datos) {
    const nombre = limpiarNombre(datos?.nombre);

    if (nombre === "") {
        return {
            estado: 400,
            mensaje: "El nombre de la tarea es obligatorio"
        };
    }

    // Si se envia completada, debe ser true o false.
    if (
        datos.completada !== undefined &&
        typeof datos.completada !== "boolean"
    ) {
        return {
            estado: 400,
            mensaje: "El campo completada debe ser true o false"
        };
    }

    if (tareaDuplicada(nombre)) {
        return {
            estado: 409,
            mensaje: "Ya existe una tarea con ese nombre"
        };
    }

    return null;
}


// Obtener todas las tareas
app.get("/tareas", (req, res) => {
    res.json(tareas);
});


// Crear una tarea
app.post("/tareas", (req, res) => {
    const error = validarTarea(req.body);

    if (error) {
        return res.status(error.estado).json({
            error: error.mensaje
        });
    }

    const nuevaTarea = {
        nombre: limpiarNombre(req.body.nombre),
        completada: req.body.completada ?? false
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});


// Obtener solamente las tareas completadas
app.get("/tareas/completadas", (req, res) => {
    const resultado = tareas.filter(
        tarea => tarea.completada === true
    );

    res.json(resultado);
});


// Obtener solamente las tareas pendientes
app.get("/tareas/pendientes", (req, res) => {
    const resultado = tareas.filter(
        tarea => tarea.completada === false
    );

    res.json(resultado);
});


app.listen(PORT, () => {
    console.log(`API de tareas funcionando en http://localhost:${PORT}`);
});