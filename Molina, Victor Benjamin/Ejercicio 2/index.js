const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const alumnos = [];

app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre del alumno es obligatorio."
        });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente tres notas."
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

    const alumnoExistente = alumnos.some(
        alumno => alumno.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (alumnoExistente) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre."
        });
    }

    const nuevoAlumno = {
        nombre: nombre.trim(),
        notas
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});

app.get("/alumnos", (req, res) => {
    const resultado = alumnos.map(alumno => {
        const promedio = alumno.notas.reduce((suma, nota) => suma + nota, 0) / alumno.notas.length;

        let condicion;

        if (promedio < 6) {
            condicion = "reprobado";
        } else if (promedio < 8) {
            condicion = "aprobado";
        } else {
            condicion = "promocionado";
        }

        return {
            nombre: alumno.nombre,
            notas: alumno.notas,
            promedio,
            condicion
        };
    });

    res.status(200).json(resultado);
});


app.get("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const alumno = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    const promedio = alumno.notas.reduce((suma, nota) => suma + nota, 0) / alumno.notas.length;

    let condicion;

    if (promedio < 6) {
        condicion = "reprobado";
    } else if (promedio < 8) {
        condicion = "aprobado";
    } else {
        condicion = "promocionado";
    }

    res.status(200).json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio,
        condicion
    });
});

app.put("/alumnos/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, notas } = req.body;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre del alumno es obligatorio."
        });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente tres notas."
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

    const nombreRepetido = alumnos.some(
        (alumno, i) =>
            i !== indice &&
            alumno.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreRepetido) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre."
        });
    }

    alumnos[indice] = {
        nombre: nombre.trim(),
        notas
    };

    res.status(200).json(alumnos[indice]);
});

app.delete("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1)[0];

    res.status(200).json({
        mensaje: "Alumno eliminado correctamente.",
        alumno: alumnoEliminado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});