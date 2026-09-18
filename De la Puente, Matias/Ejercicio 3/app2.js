const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Arreglo en memoria para simular la base de datos
let tareas = [];
let nextId = 1;

// Middleware para validar los datos recibidos en el Body
const validarEstructura = (req, res, next) => {
    const { nombre, completada } = req.body;
    
    // El nombre es obligatorio y no puede estar vacío
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: "El nombre es obligatorio y debe contener texto." });
    }
    
    // Si envían 'completada', debe ser estrictamente true o false
    if (completada !== undefined && typeof completada !== 'boolean') {
        return res.status(400).json({ error: "El estado 'completada' debe ser un valor booleano (true o false)." });
    }
    
    next();
};

// POST: Crear una nueva tarea
app.post('/tareas', validarEstructura, (req, res) => {
    const { nombre, completada } = req.body;
    const nombreLimpio = nombre.trim();
    
    // Validar que no exista otra tarea con el mismo nombre (sin importar mayúsculas)
    const nombreExiste = tareas.find(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (nombreExiste) {
        return res.status(400).json({ error: "Ya existe una tarea registrada con ese nombre." });
    }
    
    const nuevaTarea = {
        id: nextId++,
        nombre: nombreLimpio,
        // Si el cliente no especifica el estado, asume false por defecto
        completada: completada !== undefined ? completada : false
    };
    
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// GET: Consultar tareas con filtrado por Query Parameters
app.get('/tareas', (req, res) => {
    const { estado } = req.query; // Captura "?estado=" de la URL
    
    if (estado === 'completadas') {
        const filtradas = tareas.filter(t => t.completada === true);
        return res.json(filtradas);
    } 
    
    if (estado === 'pendientes') {
        const filtradas = tareas.filter(t => t.completada === false);
        return res.json(filtradas);
    }
    
    // Si no enviaron query o enviaron un valor distinto, devuelve todas
    res.json(tareas);
});

// GET: Consultar una tarea específica por ID
app.get('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);
    
    if (!tarea) {
        return res.status(404).json({ error: "Tarea no encontrada." });
    }
    
    res.json(tarea);
});

// PUT: Modificar una tarea existente
app.put('/tareas/:id', validarEstructura, (req, res) => {
    const id = parseInt(req.params.id);
    const index = tareas.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Tarea no encontrada." });
    }
    
    const { nombre, completada } = req.body;
    const nombreLimpio = nombre.trim();
    
    // Verificar que el nuevo nombre no choque con el de OTRA tarea distinta
    const nombreEnUso = tareas.find(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase() && t.id !== id);
    if (nombreEnUso) {
        return res.status(400).json({ error: "El nombre provisto ya está en uso por otra tarea." });
    }
    
    tareas[index] = {
        ...tareas[index],
        nombre: nombreLimpio,
        // Si no mandan el estado en la modificación, mantiene el que ya tenía
        completada: completada !== undefined ? completada : tareas[index].completada
    };
    
    res.json(tareas[index]);
});

// DELETE: Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tareas.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Tarea no encontrada." });
    }
    
    tareas.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});