const express = require('express');
const app = express();

app.use(express.json());

// Aca se guardan los alumnos (sin promedios ni condicion)
const alumnos = [];
let proximoId = 1;

// Funcion para chequear nombres duplicados (case insensitive)
const existeAlumno = (nombre) => {
    return alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase());
};

// Crear alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // validaciones
    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ error: 'Falta el nombre o no es un texto válido' });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'El alumno debe tener exactamente 3 notas' });
    }

    for (let nota of notas) {
        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            return res.status(400).json({ error: 'Las notas deben ser numeros del 0 al 10' });
        }
    }

    if (existeAlumno(nombre)) {
        return res.status(400).json({ error: 'Ya existe un alumno con el mismo nombre' });
    }

    const nuevoAlumno = {
        id: proximoId++,
        nombre,
        notas
    };

    alumnos.push(nuevoAlumno);
    res.status(201).json(nuevoAlumno);
});

// Modificar alumno
app.put('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, notas } = req.body;

    const index = alumnos.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // validaciones
    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ error: 'Falta el nombre o no es un texto válido' });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'El alumno debe tener exactamente 3 notas' });
    }

    for (let nota of notas) {
        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            return res.status(400).json({ error: 'Las notas deben ser numeros del 0 al 10' });
        }
    }

    // chequear que el nuevo nombre no pise el de otro que ya exista
    const alumnoMismoNombre = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (alumnoMismoNombre && alumnoMismoNombre.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Ya existe OTRO alumno con ese nombre' });
    }

    alumnos[index] = {
        id: parseInt(id),
        nombre,
        notas
    };

    res.json(alumnos[index]);
});


// Consultar notas (aca si calculamos promedios)
app.get('/alumnos', (req, res) => {
    const respuesta = alumnos.map(alumno => {
        const suma = alumno.notas.reduce((acc, nota) => acc + nota, 0);
        const promedio = suma / 3;

        let condicion = '';
        if (promedio < 6) {
            condicion = 'reprobado';
        } else if (promedio < 8) { // entre 6 y casi 8
            condicion = 'aprobado';
        } else {
            condicion = 'promocionado';
        }

        // Devolvemos la info incluyendo los campos derivados
        return {
            id: alumno.id,
            nombre: alumno.nombre,
            notas: alumno.notas,
            promedio: parseFloat(promedio.toFixed(2)),
            condicion: condicion
        };
    });

    res.json(respuesta);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`API de alumnos escuchando en puerto ${PORT}`);
});
