const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

let alumnos = [];
let siguienteId = 1;

function nombreValido(nombre) {
    return typeof nombre === "string" && nombre.trim().length > 0;
}

function notasValidas(notas) {
    return (
        Array.isArray(notas) &&
        notas.length === 3 &&
        notas.every(
            nota =>
                typeof nota === "number" &&
                Number.isFinite(nota) &&
                nota >= 0 &&
                nota <= 10
        )
    );
}

function nombreRepetido(nombre, idExcluir = null) {
    return alumnos.some(alumno =>
        alumno.nombre.toLowerCase() === nombre.trim().toLowerCase() &&
        alumno.id !== idExcluir
    );
}

function calcularPromedio(notas) {
    return (notas[0] + notas[1] + notas[2]) / 3;
}

function calcularCondicion(promedio) {
    if (promedio < 6) {
        return "Reprobado";
    }

    if (promedio < 8) {
        return "Aprobado";
    }

    return "Promocionado";
}


// Crear alumno
app.post("/alumnos", (req, res) => {
    let { nombre, notas } = req.body;

    if (!nombreValido(nombre)) {
        return res.status(400).json({
            error: "El nombre es obligatorio"
        });
    }

    if (!notasValidas(notas)) {
    return res.status(400).json({
        error: "Se deben indicar exactamente tres notas numéricas entre 0 y 10"
    });
}

    nombre = nombre.trim();

    if (nombreRepetido(nombre)) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre"
        });
    }

    const alumno = {
        id: siguienteId++,
        nombre,
        notas
    };

    alumnos.push(alumno);

    return res.status(201).json(alumno);
});


// Listar alumnos
app.get("/alumnos", (req, res) => {
    return res.status(200).json(alumnos);
});


// Consultar un alumno
app.get("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El id debe ser un número entero mayor que cero"
        });
    }

    const alumno = alumnos.find(alumno => alumno.id === id);

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const promedio = calcularPromedio(alumno.notas);
    const condicion = calcularCondicion(promedio);

    return res.status(200).json({
        ...alumno,
        promedio: Number(promedio.toFixed(2)),
        condicion
    });
});


// Modificar alumno
app.put("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);
    let { nombre, notas } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El id debe ser un número entero mayor que cero"
        });
    }

    const alumno = alumnos.find(alumno => alumno.id === id);

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    if (!nombreValido(nombre)) {
        return res.status(400).json({
            error: "El nombre es obligatorio"
        });
    }

    if (!notasValidas(notas)) {
        return res.status(400).json({
            error: "Se deben indicar exactamente tres notas numéricas entre 0 y 10"
        });
    }

    nombre = nombre.trim();

    if (nombreRepetido(nombre, id)) {
        return res.status(400).json({
            error: "Ya existe un alumno con ese nombre"
        });
    }

    alumno.nombre = nombre;
    alumno.notas = notas;

    return res.status(200).json(alumno);
});


app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});