const express = require('express');
const app = express();

app.use(express.json());

// Arreglo para guardar las tareas
const tareas = [];
let proximoId = 1;

// Funcion util para ver si ya existe el nombre
const existeTarea = (nombre) => {
    return tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase());
};

// Crear una nueva tarea
app.post('/tareas', (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ error: 'El nombre de la tarea es obligatorio' });
    }

    if (existeTarea(nombre)) {
        return res.status(400).json({ error: 'Ya existe una tarea con el mismo nombre' });
    }

    const nuevaTarea = {
        id: proximoId++,
        nombre,
        completada: false // por defecto arranca pendiente
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Modificar una tarea (ej. para marcar como completada)
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, completada } = req.body;

    const index = tareas.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // si le mandan el nombre nuevo, lo validamos
    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nuevo nombre no es válido' });
        }
        
        // chequear duplicados ignorando la tarea actual
        const nombreDuplicado = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase() && t.id !== parseInt(id));
        if (nombreDuplicado) {
            return res.status(400).json({ error: 'Ya existe OTRA tarea con ese nombre' });
        }
    }

    if (completada !== undefined && typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'El estado completada tiene que ser un booleano (true/false)' });
    }

    // Actualizamos los datos
    const tareaActualizada = {
        ...tareas[index],
        nombre: nombre !== undefined ? nombre : tareas[index].nombre,
        completada: completada !== undefined ? completada : tareas[index].completada
    };

    tareas[index] = tareaActualizada;

    res.json(tareaActualizada);
});

// Obtener todas las tareas o filtrar por estado (?completada=true o ?completada=false)
app.get('/tareas', (req, res) => {
    const { completada } = req.query;

    if (completada !== undefined) {
        // el query param viene como string
        const esCompletada = completada === 'true';
        const tareasFiltradas = tareas.filter(t => t.completada === esCompletada);
        return res.json(tareasFiltradas);
    }

    // si no hay filtro devolvemos todas
    res.json(tareas);
});

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const index = tareas.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const tareaBorrada = tareas.splice(index, 1);
    res.json(tareaBorrada[0]);
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`API de tareas corriendo en puerto ${PORT}`);
});
