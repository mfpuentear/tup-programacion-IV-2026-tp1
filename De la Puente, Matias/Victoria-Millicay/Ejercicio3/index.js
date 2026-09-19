import express from 'express';

const app = express();
app.use(express.json());


let tareas = [];

//  Crear una nueva tarea asegurando nombres únicos
app.post('/api/tareas', (req, res) => {
    const { nombre, completada } = req.body;

    
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la tarea es obligatorio y debe ser un texto válido.' });
    }

    const nombreNormalizado = nombre.trim().toLowerCase();
    const existe = tareas.some(t => t.nombre.toLowerCase() === nombreNormalizado);

    if (existe) {
        return res.status(400).json({ error: `Ya existe una tarea registrada con el nombre "${nombre}".` });
    }

    const nuevaTarea = {
        nombre: nombre.trim(),
        completada: typeof completada === 'boolean' ? completada : false // Por defecto nace pendiente
    };

    tareas.push(nuevaTarea);
    res.status(201).json({
        mensaje: 'Tarea creada con éxito',
        tarea: nuevaTarea
    });
});

// 2.  Listar todas las tareas o filtrarlas por estado (?estado=completada o ?estado=pendiente)
app.get('/api/tareas', (req, res) => {
    const { estado } = req.query;

    let resultado = tareas;

    if (estado === 'completada') {
        resultado = tareas.filter(t => t.completada === true);
    } else if (estado === 'pendiente') {
        resultado = tareas.filter(t => t.completada === false);
    }

    res.json({
        total: resultado.length,
        tareas: resultado
    });
});

// 3.Modificar el estado o el nombre de una tarea existente
app.put('/api/tareas/:nombreOriginal', (req, res) => {
    const { nombreOriginal } = req.params;
    const { nuevoNombre, completada } = req.body;

    const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreOriginal.toLowerCase());

    if (!tarea) {
        return res.status(404).json({ error: 'No se encontró la tarea especificada.' });
    }

    
    if (nuevoNombre && nuevoNombre.trim().toLowerCase() !== tarea.nombre.toLowerCase()) {
        const existe = tareas.some(t => t.nombre.toLowerCase() === nuevoNombre.trim().toLowerCase());
        if (existe) {
            return res.status(400).json({ error: `Ya existe otra tarea con el nombre "${nuevoNombre}".` });
        }
        tarea.nombre = nuevoNombre.trim();
    }

    // Actualizar estado si se provee de forma válida
    if (typeof completada === 'boolean') {
        tarea.completada = completada;
    }

    res.json({
        mensaje: 'Tarea actualizada correctamente',
        tarea
    });
});

// Iniciar servidor en puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Tareas escuchando en el puerto ${PORT}`);
});