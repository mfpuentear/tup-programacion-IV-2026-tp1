import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

const alumnos = [];

function normalizarNombre(nombre) {
    return nombre.trim().toLowerCase();
}

function buscarAlumnoPorNombre(nombre) {
    const nombreNormalizado = normalizarNombre(nombre);
    return alumnos.find(
        (alumno) => normalizarNombre(alumno.nombre) === nombreNormalizado
    );
}

function validarAlumno(nombre, notas) {
    if (nombre === undefined || notas === undefined) {
        return {
            esValido: false,
            mensaje: "El nombre y las notas son obligatorios."
        };
    }

    if (typeof nombre !== "string") {
        return {
            esValido: false,
        mensaje: "El nombre debe ser un texto."
        };
    }

    const nombreLimpio = nombre.trim();

    if (nombreLimpio.length < 2 || nombreLimpio.length > 50) {
        return {
            esValido: false,
            mensaje: "El nombre debe tener entre 2 y 50 caracteres."
        };
    }

    if (!Array.isArray(notas)) {
        return {
            esValido: false,
        mensaje: "Las notas deben enviarse en un arreglo."
        };
    }

    if (notas.length !== 3) {
        return {
            esValido: false,
            mensaje: "Cada alumno debe tener exactamente tres notas."
        };
    }

    const notasNumericas = notas.map((nota) => Number(nota));

    const notasInvalidas = notasNumericas.some(
        (nota) => Number.isNaN(nota) || !Number.isFinite(nota) || nota < 1 || nota > 10
    );

    if (notasInvalidas) {
        return {
            esValido: false,
            mensaje: "Las notas deben ser numeros entre 1 y 10."
        };
    }

    return {
        esValido: true,
        alumno: {
            nombre: nombreLimpio,
            notas: notasNumericas
        }
    };
}

function obtenerDatosAcademicos(alumno) {
    const sumaNotas = alumno.notas.reduce((total, nota) => total + nota, 0);
    const promedio = Number((sumaNotas / alumno.notas.length).toFixed(2));

    let condicion = "reprobado";

    if (promedio >= 8) {
        condicion = "promocionado";
    } else if (promedio >= 6) {
        condicion = "aprobado";
    }

    return {
        nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion
    };
}

app.get("/api/alumnos", (req, res) => {
    const respuesta = alumnos.map((alumno) => obtenerDatosAcademicos(alumno));

    return res.status(200).json({
        cantidad: respuesta.length,
        alumnos: respuesta
    });
});

app.get("/api/alumnos/:nombre", (req, res) => {
    const alumno = buscarAlumnoPorNombre(req.params.nombre);

    if (!alumno) {
        return res.status(404).json({
        error: "No se encontro un alumno con ese nombre."
        });
    }

    return res.status(200).json(obtenerDatosAcademicos(alumno));
});

app.post("/api/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    const validacion = validarAlumno(nombre, notas);

    if (!validacion.esValido) {
        return res.status(400).json({
        error: validacion.mensaje
        });
    }

    const alumnoExistente = buscarAlumnoPorNombre(validacion.alumno.nombre);

    if (alumnoExistente) {
        return res.status(409).json({
        error: "Ya existe un alumno con ese nombre."
        });
    }

    alumnos.push(validacion.alumno);

    return res.status(201).json({
        mensaje: "Alumno creado correctamente.",
        alumno: obtenerDatosAcademicos(validacion.alumno)
    });
});

app.put("/api/alumnos/:nombre", (req, res) => {
    const alumnoActual = buscarAlumnoPorNombre(req.params.nombre);

    if (!alumnoActual) {
        return res.status(404).json({
        error: "No se encontro un alumno con ese nombre."
        });
    }

    const { nombre, notas } = req.body;

    const validacion = validarAlumno(nombre, notas);

    if (!validacion.esValido) {
        return res.status(400).json({
        error: validacion.mensaje
        });
    }

    const alumnoConNuevoNombre = buscarAlumnoPorNombre(validacion.alumno.nombre);

    if (
        alumnoConNuevoNombre &&
        normalizarNombre(alumnoConNuevoNombre.nombre) !== normalizarNombre(alumnoActual.nombre)
    ) {
        return res.status(409).json({
        error: "Ya existe otro alumno con ese nombre."
        });
    }

    alumnoActual.nombre = validacion.alumno.nombre;
    alumnoActual.notas = validacion.alumno.notas;

    return res.status(200).json({
        mensaje: "Alumno actualizado correctamente.",
        alumno: obtenerDatosAcademicos(alumnoActual)
    });
});

app.delete("/api/alumnos/:nombre", (req, res) => {
    const nombreNormalizado = normalizarNombre(req.params.nombre);

    const indice = alumnos.findIndex(
    (alumno) => normalizarNombre(alumno.nombre) === nombreNormalizado
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "No se encontro un alumno con ese nombre."
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1)[0];

    return res.status(200).json({
        mensaje: "Alumno eliminado correctamente.",
        alumno: alumnoEliminado
    });
});

app.listen(PORT, () => {
    console.log(`API disponible en http://localhost:${PORT}`);
});