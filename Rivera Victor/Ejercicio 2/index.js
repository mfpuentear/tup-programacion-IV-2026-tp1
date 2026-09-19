const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const alumnos = [];

app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El nombre y las tres notas son obligatorios"
        });
    }

    const alumnoExistente = alumnos.find(
        alumno => alumno.nombre === nombre
    );

    if (alumnoExistente) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre"
        });
    }

    alumnos.push({
        nombre,
        notas
    });

    res.status(201).json({
        mensaje: "Alumno creado correctamente",
        alumno: {
            nombre,
            notas
        }
    });
});

app.put("/alumnos/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, notas } = req.body;

    const alumno = alumnos.find(
        alumno => alumno.nombre === nombreActual
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El nombre y las tres notas son obligatorios"
        });
    }

    const alumnoConEseNombre = alumnos.find(
        alumno => alumno.nombre === nombre && alumno.nombre !== nombreActual
    );

    if (alumnoConEseNombre) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre"
        });
    }

    alumno.nombre = nombre;
    alumno.notas = notas;

    res.json({
        mensaje: "Alumno modificado correctamente",
        alumno: {
            nombre: alumno.nombre,
            notas: alumno.notas
        }
    });
});

app.delete("/alumnos/:nombre", (req, res) => {
    const { nombre } = req.params;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre === nombre
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    alumnos.splice(indice, 1);

    res.json({
        mensaje: "Alumno eliminado correctamente"
    });
});

app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});

app.get("/alumnos/:nombre", (req, res) => {
    const { nombre } = req.params;

    const alumno = alumnos.find(
        alumno => alumno.nombre === nombre
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const promedio =
        (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;

    let condicion;

    if (promedio < 6) {
        condicion = "reprobado";
    } else if (promedio < 8) {
        condicion = "aprobado";
    } else {
        condicion = "promocionado";
    }

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: promedio,
        condicion: condicion
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});