import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno donde se guardan los alumnos
let alumnos = [];

// Buscar un alumno por nombre
function buscarAlumno(nombre) {
    return alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );
}

// Determinar la condición académica
function obtenerCondicion(promedio) {
    if (promedio < 6) {
        return "reprobado";
    } else if (promedio < 8) {
        return "aprobado";
    } else {
        return "promocionado";
    }
}

// GET - Obtener todos los alumnos
app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});

// GET - Consultar las notas de un alumno
app.get("/alumnos/:nombre", (req, res) => {
    const alumno = buscarAlumno(req.params.nombre);

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const promedio =
        (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;

    const condicion = obtenerCondicion(promedio);

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: Number(promedio.toFixed(2)),
        condicion: condicion
    });
});

// POST - Crear un alumno
app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "Debe ingresar un nombre y exactamente tres notas."
        });
    }

    if (buscarAlumno(nombre)) {
        return res.status(409).json({
            error: "Ya existe un alumno con ese nombre."
        });
    }

    const notasValidas = notas.every(
        nota => typeof nota === "number" && nota >= 0 && nota <= 10
    );

    if (!notasValidas) {
        return res.status(400).json({
            error: "Las notas deben ser números entre 0 y 10."
        });
    }

    const nuevoAlumno = {
        nombre: nombre,
        notas: notas
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});

// PUT - Modificar un alumno
app.put("/alumnos/:nombre", (req, res) => {
    const alumno = buscarAlumno(req.params.nombre);

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const { nombre, notas } = req.body;

    if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "Debe ingresar un nombre y exactamente tres notas."
        });
    }

    // Verificar que el nuevo nombre no pertenezca a otro alumno
    const otroAlumno = alumnos.find(
        a =>
            a !== alumno &&
            a.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (otroAlumno) {
        return res.status(409).json({
            error: "No puede existir otro alumno con ese nombre."
        });
    }

    const notasValidas = notas.every(
        nota => typeof nota === "number" && nota >= 0 && nota <= 10
    );

    if (!notasValidas) {
        return res.status(400).json({
            error: "Las notas deben ser números entre 0 y 10."
        });
    }

    alumno.nombre = nombre;
    alumno.notas = notas;

    res.json(alumno);
});

// DELETE - Eliminar un alumno
app.delete("/alumnos/:nombre", (req, res) => {
    const indice = alumnos.findIndex(
        alumno =>
            alumno.nombre.toLowerCase() === req.params.nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1)[0];

    res.json({
        mensaje: "Alumno eliminado correctamente",
        alumno: alumnoEliminado
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});