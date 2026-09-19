import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let alumnos = [];

app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: "El nombre es obligatorio y debe ser un texto." });
    }

    if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number' && n >= 1 && n <= 10)) {
        return res.status(400).json({ error: "Debe enviar exactamente 3 notas numéricas entre 1 y 10." });
    }

    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        return res.status(400).json({ error: "Ya existe un alumno con ese nombre." });
    }

    alumnos.push({ nombre, notas });
    res.status(201).json({ mensaje: "Alumno creado exitosamente" });
});

app.get('/alumnos/:nombre', (req, res) => {
    const { nombre } = req.params;
    const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }

    const suma = alumno.notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = suma / alumno.notas.length;
    
    let condicion = "reprobado";
    if (promedio >= 8) {
        condicion = "promocionado";
    } else if (promedio >= 6) {
        condicion = "aprobado";
    }

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: parseFloat(promedio.toFixed(2)),
        condicion: condicion
    });
});

app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 2 corriendo en http://localhost:${PORT}`);
});