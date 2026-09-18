// Actividad 2
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno para almacenar los alumnos (nombre y notas)
let alumnos = [];

/**
 * Función auxiliar para calcular los datos derivados
 * No se guardan en el arreglo interno, se calculan en el momento.
 */
function calcularDatosDerivados(notas) {
    const suma = notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = Number((suma / notas.length).toFixed(2));

    let condicion = '';
    if (promedio < 6) {
        condicion = 'reprobado';
    } else if (promedio < 8) { // Promedios de 6 o 7
        condicion = 'aprobado';
    } else { // Promedios de 8 o más
        condicion = 'promocionado';
    }

    return { promedio, condicion };
}

// 1. Obtener todos los alumnos y notas
app.get('/alumnos', (req, res) => {
    const respuesta = alumnos.map(alumno => {
        const { promedio, condicion } = calcularDatosDerivados(alumno.notas);
        return {
            nombre: alumno.nombre,
            notas: alumno.notas,
            promedio: promedio,
            condicion: condicion
        };
    });

    res.json(respuesta);
});

// 2. Obtener un alumno específico
app.get('/alumnos/:nombre', (req, res) => {
    const nombreBuscado = req.params.nombre.toLowerCase();
    const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreBuscado);

    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const { promedio, condicion } = calcularDatosDerivados(alumno.notas);

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: promedio,
        condicion: condicion
    });
});

// 3. Crear un nuevo alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // Validar que el nombre exista y sea un texto válido
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto válido' });
    }

    // Validar que notas sea un arreglo de 3 números entre 0 y 10
    if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number' && n >= 0 && n <= 10)) {
        return res.status(400).json({ error: 'Debe ingresar un arreglo con exactamente 3 notas numéricas entre 0 y 10' });
    }

    // Validar que no exista un alumno con el mismo nombre
    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (existe) {
        return res.status(400).json({ error: 'Ya existe un alumno registrado con ese nombre' });
    }

    // Se guardan solo nombre y notas
    const nuevoAlumno = {
        nombre: nombre.trim(),
        notas: notas
    };

    alumnos.push(nuevoAlumno);

    // Se calculan los datos
    const { promedio, condicion } = calcularDatosDerivados(nuevoAlumno.notas);

    res.status(201).json({
        mensaje: 'Alumno registrado con éxito',
        alumno: {
            nombre: nuevoAlumno.nombre,
            notas: nuevoAlumno.notas,
            promedio: promedio,
            condicion: condicion
        }
    });
});

// 4. Modificar un alumno que ya existe
app.put('/alumnos/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreParam);

    if (index === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const { nuevoNombre, notas } = req.body;

    // Si se envía un nuevo nombre, verificar que no esté repetido en otro alumno
    if (nuevoNombre && typeof nuevoNombre === 'string' && nuevoNombre.trim() !== '') {
        const nombreDuplicado = alumnos.some(
            (a, idx) => idx !== index && a.nombre.toLowerCase() === nuevoNombre.trim().toLowerCase()
        );

        if (nombreDuplicado) {
            return res.status(400).json({ error: 'Ya existe otro alumno registrado con el nuevo nombre ingresado' });
        }
        alumnos[index].nombre = nuevoNombre.trim();
    }

    // Validar y actualizar las notas
    if (notas !== undefined) {
        if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number' && n >= 0 && n <= 10)) {
            return res.status(400).json({ error: 'Debe ingresar un arreglo con exactamente 3 notas numéricas entre 0 y 10' });
        }
        alumnos[index].notas = notas;
    }

    const alumnoActualizado = alumnos[index];
    const { promedio, condicion } = calcularDatosDerivados(alumnoActualizado.notas);

    res.json({
        mensaje: 'Alumno actualizado con éxito',
        alumno: {
            nombre: alumnoActualizado.nombre,
            notas: alumnoActualizado.notas,
            promedio: promedio,
            condicion: condicion
        }
    });
});

// 5. Eliminar a un alumno
app.delete('/alumnos/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreParam);

    if (index === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    alumnos.splice(index, 1);
    res.json({ mensaje: 'Alumno eliminado correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor de Alumnos ejecutándose en http://localhost:${PORT}`);
});