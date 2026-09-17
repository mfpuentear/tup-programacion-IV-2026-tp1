const express = require('express');
const app = express();

app.use(express.json());

let alumnos = []
let nextId = 1;

const calcularCondicion = promedio => {
    if (promedio <6) return "reprobado";
    if (promedio <8) return "aprobado";
    return "promocionado";
};

const formatearAlumno = alumno => {
    const suma = alumno.notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = Number((suma / alumno.notas.length).toFixed(2));
    return {
        id: alumno.id,
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio,
        condicion: calcularCondicion(promedio)
    };
};

app.get ('/alumnos', (req, res) => {
    res.json(alumnos.map(formatearAlumno));
});

app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Las notas deben ser un arreglo de 3 notas.' });
    }

    if (notas.some(nota => typeof nota !== 'number' || nota < 1 || nota > 10)) {
        return res.status(400).json({ error: 'Cada nota debe ser un número entre 1 y 10.' });
    }
    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (existe) {
        return res.status(409).json({ error: 'Ya existe un alumno registrado con ese nombre.' });
    }
    
    const nuevoAlumno = {
        id: nextId++,
        nombre: nombre.trim(),
        notas
    };

    alumnos.push(nuevoAlumno);
    res.status(201).json(formatearAlumno(nuevoAlumno));
});

app.listen(3000, () => console.log('ejercicio 2 funcionando en el puerto 3000'));