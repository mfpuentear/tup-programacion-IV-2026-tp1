const express = require('express');

const app = express();

app.use(express.json());

// Arreglo interno de alumnos
const alumnos = [];

// Ver todos los alumnos
app.get('/alumnos', (req, res) => {
    res.json(alumnos);
});

// Consultar un alumno
app.get('/alumnos/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    const alumno = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!alumno) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    const promedio =
        (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;

    let condicion;

    if (promedio < 6) {
        condicion = 'reprobado';
    } else if (promedio < 8) {
        condicion = 'aprobado';
    } else {
        condicion = 'promocionado';
    }

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio,
        condicion
    });
});

// Crear un alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || !Array.isArray(notas)) {
        return res.status(400).json({
            error: 'El nombre y las notas son obligatorios'
        });
    }

    if (notas.length !== 3) {
        return res.status(400).json({
            error: 'El alumno debe tener exactamente 3 notas'
        });
    }

    if (!notas.every(nota => typeof nota === 'number')) {
        return res.status(400).json({
            error: 'Las notas deben ser números'
        });
    }

    if (notas.some(nota => nota < 0 || nota > 10)) {
        return res.status(400).json({
            error: 'Las notas deben estar entre 0 y 10'
        });
    }

    const existe = alumnos.some(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: 'Ya existe un alumno con ese nombre'
        });
    }

    const nuevoAlumno = {
        nombre,
        notas
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});

// Modificar un alumno
app.put('/alumnos/:nombre', (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, notas } = req.body;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    if (!nombre || !Array.isArray(notas)) {
        return res.status(400).json({
            error: 'El nombre y las notas son obligatorios'
        });
    }

    if (notas.length !== 3) {
        return res.status(400).json({
            error: 'El alumno debe tener exactamente 3 notas'
        });
    }

    if (!notas.every(nota => typeof nota === 'number')) {
        return res.status(400).json({
            error: 'Las notas deben ser números'
        });
    }

    if (notas.some(nota => nota < 0 || nota > 10)) {
        return res.status(400).json({
            error: 'Las notas deben estar entre 0 y 10'
        });
    }

    const nombreRepetido = alumnos.some(
        (alumno, i) =>
            i !== indice &&
            alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreRepetido) {
        return res.status(409).json({
            error: 'Ya existe otro alumno con ese nombre'
        });
    }

    alumnos[indice] = {
        nombre,
        notas
    };

    res.json(alumnos[indice]);
});

// Eliminar un alumno
app.delete('/alumnos/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1);

    res.json({
        mensaje: 'Alumno eliminado correctamente',
        alumno: alumnoEliminado[0]
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});