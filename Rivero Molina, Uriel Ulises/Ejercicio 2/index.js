const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Se almacenan solamente los datos originales del alumno.
// El promedio y la condicion se calculan cuando se realiza una consulta.
const alumnos = [];

let proximoId = 1;

// Limpia espacios innecesarios del nombre.
function obtenerNombre(nombre) {
    if (typeof nombre !== "string") {
        return "";
    }

    return nombre.trim();
}

// Comprueba que la nota sea un numero valido entre 0 y 10.
function notaCorrecta(nota) {
    return (
        typeof nota === "number" &&
        Number.isFinite(nota) &&
        nota >= 0 &&
        nota <= 10
    );
}

// Calcula el promedio de las tres notas.
function obtenerPromedio(notas) {
    const suma = notas[0] + notas[1] + notas[2];
    return Number((suma / 3).toFixed(2));
}

// Determina la condicion segun el promedio.
function obtenerCondicion(promedio) {
    if (promedio < 6) {
        return "reprobado";
    }

    if (promedio < 8) {
        return "aprobado";
    }

    return "promocionado";
}

// Prepara los datos que se envian como respuesta.
function prepararAlumno(alumno) {
    const promedio = obtenerPromedio(alumno.notas);

    return {
        id: alumno.id,
        nombre: alumno.nombre,
        notas: [...alumno.notas],
        promedio: promedio,
        condicion: obtenerCondicion(promedio)
    };
}

// Valida los datos enviados por el cliente.
function validarAlumno(datos, idExcluido = null) {
    const nombre = obtenerNombre(datos?.nombre);
    const notas = datos?.notas;

    if (nombre === "") {
        return {
            codigo: 400,
            mensaje: "El nombre es obligatorio"
        };
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return {
            codigo: 400,
            mensaje: "El alumno debe tener exactamente 3 notas"
        };
    }

    if (!notas.every(notaCorrecta)) {
        return {
            codigo: 400,
            mensaje: "Las notas deben ser numeros entre 0 y 10"
        };
    }

    // La comparacion no distingue mayusculas de minusculas.
    const nombreRepetido = alumnos.some((alumno) => {
        return (
            alumno.id !== idExcluido &&
            alumno.nombre.toLowerCase() === nombre.toLowerCase()
        );
    });

    if (nombreRepetido) {
        return {
            codigo: 409,
            mensaje: "Ya existe un alumno con ese nombre"
        };
    }

    return null;
}

// Convierte el parametro id a un numero entero positivo.
function convertirId(valor) {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}


// GET /alumnos
// Devuelve todos los alumnos.
app.get("/alumnos", (req, res) => {
    res.json(alumnos.map(prepararAlumno));
});


// GET /alumnos/:id
// Devuelve un alumno determinado.
app.get("/alumnos/:id", (req, res) => {
    const id = convertirId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "El id debe ser un numero entero positivo"
        });
    }

    const alumno = alumnos.find((item) => item.id === id);

    if (!alumno) {
        return res.status(404).json({
            error: "No se encontro el alumno"
        });
    }

    res.json(prepararAlumno(alumno));
});


// POST /alumnos
// Crea un nuevo alumno.
app.post("/alumnos", (req, res) => {
    const error = validarAlumno(req.body);

    if (error) {
        return res.status(error.codigo).json({
            error: error.mensaje
        });
    }

    const nuevoAlumno = {
        id: proximoId++,
        nombre: obtenerNombre(req.body.nombre),
        notas: [...req.body.notas]
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(prepararAlumno(nuevoAlumno));
});


// PUT /alumnos/:id
// Reemplaza completamente los datos de un alumno.
app.put("/alumnos/:id", (req, res) => {
    const id = convertirId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "El id debe ser un numero entero positivo"
        });
    }

    const posicion = alumnos.findIndex((item) => item.id === id);

    if (posicion === -1) {
        return res.status(404).json({
            error: "No se encontro el alumno"
        });
    }

    const error = validarAlumno(req.body, id);

    if (error) {
        return res.status(error.codigo).json({
            error: error.mensaje
        });
    }

    alumnos[posicion] = {
        id: id,
        nombre: obtenerNombre(req.body.nombre),
        notas: [...req.body.notas]
    };

    res.json(prepararAlumno(alumnos[posicion]));
});


// DELETE /alumnos/:id
// Elimina un alumno.
app.delete("/alumnos/:id", (req, res) => {
    const id = convertirId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "El id debe ser un numero entero positivo"
        });
    }

    const posicion = alumnos.findIndex((item) => item.id === id);

    if (posicion === -1) {
        return res.status(404).json({
            error: "No se encontro el alumno"
        });
    }

    const eliminado = alumnos.splice(posicion, 1)[0];

    res.json(prepararAlumno(eliminado));
});


app.listen(PORT, () => {
    console.log(`API de alumnos ejecutandose en http://localhost:${PORT}`);
});