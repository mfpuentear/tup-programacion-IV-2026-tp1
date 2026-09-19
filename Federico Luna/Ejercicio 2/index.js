import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

let alumnos = [
    {
        nombre: "Juan",
        notas: [8, 7, 9]
    },
    {
        nombre: "Maria",
        notas: [6, 7, 5]
    }
];

app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});

app.get("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const alumno = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    const promedio = (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;

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
app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre) {
        return res.status(400).json({
            error: "El nombre es obligatorio"
        });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente 3 notas"
        });
    }

    if (notas.some(nota => !Number.isFinite(Number(nota)))) {
        return res.status(400).json({
            error: "Las notas deben ser números"
        });
    }

    const alumnoExistente = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (alumnoExistente) {
        return res.status(409).json({
            error: "Ya existe un alumno con ese nombre"
        });
    }

    const nuevoAlumno = {
        nombre,
        notas: notas.map(Number)
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});
app.put("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const { notas } = req.body;

    const alumno = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado"
        });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente 3 notas"
        });
    }

    if (notas.some(nota => !Number.isFinite(Number(nota)))) {
        return res.status(400).json({
            error: "Las notas deben ser números"
        });
    }

    alumno.notas = notas.map(Number);

    res.json(alumno);
});
app.delete("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
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
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});