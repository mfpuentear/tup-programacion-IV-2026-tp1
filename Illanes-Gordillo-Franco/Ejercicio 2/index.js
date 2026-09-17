const express = require('express');
const app = express();
const PORT = 3001; // uso el 3001 para que no choque con el 1

app.use(express.json());

const alumnos = [];

// POST: guardar alumno (sin promedio ni condicion)
app.post('/api/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || !notas) {
        return res.status(400).json({ error: "faltan datos: se requiere nombre y notas" });
    }

    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: "las notas deben ser una lista de exactamente 3 elementos" });
    }

    const notasValidas = notas.every(n => typeof n === 'number' && n >= 0 && n <= 10);
    if (!notasValidas) {
        return res.status(400).json({ error: "las 3 notas deben ser numeros entre 0 y 10" });
    }

    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (existe) {
        return res.status(400).json({ error: "ya existe un alumno registrado con ese nombre" });
    }

    const nuevoAlumno = {
        nombre: nombre.trim(),
        notas: notas
    };

    alumnos.push(nuevoAlumno);
    return res.status(201).json({ mensaje: "alumno agregado correctamente", alumno: nuevoAlumno });
});

// GET: consultar alumnos y calcular promedio y condicion en el momento
app.get('/api/alumnos', (req, res) => {
    const respuesta = alumnos.map(a => {
        const suma = a.notas.reduce((acc, curr) => acc + curr, 0);
        const promedio = Number((suma / a.notas.length).toFixed(2));
        
        let condicion = "Libre";
        if (promedio >= 7) {
            condicion = "Promocionado";
        } else if (promedio >= 4) {
            condicion = "Regular";
        }

        return {
            nombre: a.nombre,
            notas: a.notas,
            promedio: promedio,
            condicion: condicion
        };
    });

    return res.status(200).json(respuesta);
});

app.listen(PORT, () => {
    console.log(`Servidor de alumnos corriendo en http://localhost:${PORT}`);
});