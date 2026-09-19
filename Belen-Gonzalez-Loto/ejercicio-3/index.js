import express from "express";

const app = express();
const PORT = 3002;

app.use(express.json());

const tareas = [];

function normalizarNombre(nombre) {
    return nombre.trim().toLowerCase();
}

function buscarTareaPorNombre(nombre) {
    const nombreNormalizado = normalizarNombre(nombre);

    return tareas.find(
        (tarea) => normalizarNombre(tarea.nombre) === nombreNormalizado
    );
}

function validarTarea(nombre, completada) {
    if (nombre === undefined || completada === undefined) {
        return {
            esValida: false,
            mensaje: "El nombre y el estado de completada son obligatorios."
        };
    }

    if (typeof nombre !== "string") {
        return {
            esValida: false,
            mensaje: "El nombre debe ser un texto."
        };
    }

    const nombreLimpio = nombre.trim();

    if (nombreLimpio.length < 3 || nombreLimpio.length > 60) {
        return {
            esValida: false,
            mensaje: "El nombre debe tener entre 3 y 60 caracteres."
        };
    }

    if (typeof completada !== "boolean") {
        return {
            esValida: false,
            mensaje: "El estado completada debe ser true o false."
        };
    }

    return {
        esValida: true,
        tarea: {
            nombre: nombreLimpio,
            completada
        }
    };
}

function filtrarTareasPorEstado(estado) {
    if (estado === undefined) {
        return tareas;
    }

    if (estado !== "completadas" && estado !== "pendientes") {
        return null;
    }

    return tareas.filter((tarea) =>
        estado === "completadas" ? tarea.completada : !tarea.completada
    );
}

app.get("/api/tareas", (req, res) => {
    const { estado } = req.query;

    const tareasFiltradas = filtrarTareasPorEstado(estado);

    if (tareasFiltradas === null) {
        return res.status(400).json({
            error: "El estado debe ser completadas o pendientes."
        });
    }

    return res.status(200).json({
        cantidad: tareasFiltradas.length,
        tareas: tareasFiltradas
    });
});

app.get("/api/tareas/:nombre", (req, res) => {
    const tarea = buscarTareaPorNombre(req.params.nombre);

    if (!tarea) {
        return res.status(404).json({
        error: "No se encontro una tarea con ese nombre."
        });
    }

    return res.status(200).json(tarea);
});

app.post("/api/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    const validacion = validarTarea(nombre, completada);

    if (!validacion.esValida) {
        return res.status(400).json({
            error: validacion.mensaje
        });
    }

    const tareaExistente = buscarTareaPorNombre(validacion.tarea.nombre);

    if (tareaExistente) {
        return res.status(409).json({
            error: "Ya existe una tarea con ese nombre."
        });
    }

    tareas.push(validacion.tarea);

    return res.status(201).json({
        mensaje: "Tarea creada correctamente.",
        tarea: validacion.tarea
    });
});

app.put("/api/tareas/:nombre", (req, res) => {
    const tareaActual = buscarTareaPorNombre(req.params.nombre);

    if (!tareaActual) {
        return res.status(404).json({
        error: "No se encontro una tarea con ese nombre."
        });
    }

    const { nombre, completada } = req.body;

    const validacion = validarTarea(nombre, completada);

    if (!validacion.esValida) {
        return res.status(400).json({
        error: validacion.mensaje
        });
    }

    const tareaConNuevoNombre = buscarTareaPorNombre(validacion.tarea.nombre);

    if (
        tareaConNuevoNombre &&
        normalizarNombre(tareaConNuevoNombre.nombre) !== normalizarNombre(tareaActual.nombre)
    ) {
        return res.status(409).json({
            error: "Ya existe otra tarea con ese nombre."
        });
    }

    tareaActual.nombre = validacion.tarea.nombre;
    tareaActual.completada = validacion.tarea.completada;

    return res.status(200).json({
        mensaje: "Tarea actualizada correctamente.",
        tarea: tareaActual
    });
});

app.patch("/api/tareas/:nombre/estado", (req, res) => {
    const tarea = buscarTareaPorNombre(req.params.nombre);

    if (!tarea) {
        return res.status(404).json({
            error: "No se encontro una tarea con ese nombre."
        });
    }

    const { completada } = req.body;

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false."
        });
    }

    tarea.completada = completada;

    return res.status(200).json({
        mensaje: "Estado de la tarea actualizado correctamente.",
        tarea
    });
});

app.delete("/api/tareas/:nombre", (req, res) => {
    const nombreNormalizado = normalizarNombre(req.params.nombre);

    const indice = tareas.findIndex(
        (tarea) => normalizarNombre(tarea.nombre) === nombreNormalizado
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "No se encontro una tarea con ese nombre."
        });
    }

    const tareaEliminada = tareas.splice(indice, 1)[0];

    return res.status(200).json({
        mensaje: "Tarea eliminada correctamente.",
        tarea: tareaEliminada
    });
});

app.listen(PORT, () => {
    console.log(`API disponible en http://localhost:${PORT}`);
});