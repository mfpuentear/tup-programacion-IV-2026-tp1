import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let tareas = [];

app.post('/tareas', (req, res) => {
    const { titulo, estado } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ error: "El título es obligatorio y debe ser texto." });
    }

    const estadoFinal = estado ? estado.toLowerCase() : 'pendiente';
    if (estadoFinal !== 'pendiente' && estadoFinal !== 'completada') {
        return res.status(400).json({ error: "El estado solo puede ser 'pendiente' o 'completada'." });
    }

    const existe = tareas.some(t => t.titulo.toLowerCase() === titulo.toLowerCase());
    if (existe) {
        return res.status(400).json({ error: "Ya existe una tarea con ese título." });
    }

    const nuevaTarea = { titulo, estado: estadoFinal };
    tareas.push(nuevaTarea);
    
    res.status(201).json({ mensaje: "Tarea creada exitosamente", tarea: nuevaTarea });
});

app.get('/tareas', (req, res) => {
    const { estado } = req.query;

    if (estado) {
        const estadoFiltro = estado.toLowerCase();
        if (estadoFiltro !== 'pendiente' && estadoFiltro !== 'completada') {
            return res.status(400).json({ error: "Filtro inválido. Use 'pendiente' o 'completada'." });
        }
        
        const filtradas = tareas.filter(t => t.estado === estadoFiltro);
        return res.json(filtradas);
    }

    res.json(tareas);
});

app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 3 corriendo en http://localhost:${PORT}`);
});