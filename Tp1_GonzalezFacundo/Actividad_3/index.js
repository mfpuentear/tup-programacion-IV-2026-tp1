//Actividad 3
const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

let tareas = [];

// Busca una tarea por nombre
function buscarTarea(nombre) {
    return tareas.find(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );
}

// Muestra todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Muestra solamente las tareas completadas
app.get('/tareas/completadas', (req, res) => {
    const completadas = tareas.filter(tarea => tarea.completada === true);

    res.json(completadas);
});

// Muestra solamente las tareas pendientes
app.get('/tareas/pendientes', (req, res) => {
    const pendientes = tareas.filter(tarea => tarea.completada === false);

    res.json(pendientes);
});

// Mostrar una tarea por nombre
app.get('/tareas/:nombre', (req, res) => {
    const nombre = decodeURIComponent(req.params.nombre);
    const tarea = buscarTarea(nombre);

    if (!tarea) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    res.json(tarea);
});

// Crear una tarea
app.post('/tareas', (req, res) => {
    const { nombre, completada } = req.body;

    // Validar nombre
    if (!nombre) {
        return res.status(400).json({
            error: 'El nombre de la tarea es obligatorio'
        });
    }

    // Validar estado
    if (typeof completada !== 'boolean') {
        return res.status(400).json({
            error: 'El estado completada debe ser true o false'
        });
    }

    // Verificar que no exista otra tarea con el mismo nombre
    if (buscarTarea(nombre)) {
        return res.status(409).json({
            error: 'Ya existe una tarea con ese nombre'
        });
    }

    const nuevaTarea = {
        nombre: nombre,
        completada: completada
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

// Modificar una tarea
app.put('/tareas/:nombre', (req, res) => {
    const nombreActual = decodeURIComponent(req.params.nombre);
    const tarea = buscarTarea(nombreActual);

    if (!tarea) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    const { nombre, completada } = req.body;

    // Validar un nombre
    if (!nombre) {
        return res.status(400).json({
            error: 'El nombre de la tarea es obligatorio'
        });
    }

    // Validar el estado
    if (typeof completada !== 'boolean') {
        return res.status(400).json({
            error: 'El estado completada debe ser true o false'
        });
    }

    // Verificar que el nuevo nombre no pertenezca a otra tarea
    const otraTarea = tareas.find(
        otra =>
            otra !== tarea &&
            otra.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (otraTarea) {
        return res.status(409).json({
            error: 'Ya existe otra tarea con ese nombre'
        });
    }

    tarea.nombre = nombre;
    tarea.completada = completada;

    res.json(tarea);
});

// Eliminar una tarea
app.delete('/tareas/:nombre', (req, res) => {
    const nombre = decodeURIComponent(req.params.nombre);

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    const eliminada = tareas.splice(indice, 1)[0];

    res.json({
        mensaje: 'Tarea eliminada correctamente',
        tarea: eliminada
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});