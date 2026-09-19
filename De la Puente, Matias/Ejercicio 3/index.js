import express from 'express'

const app = express()

app.use(express.json())

let tareas = [{ nombre: "Comprar leche", completada: false }];

app.get('/tareas', (req, res) => {
    const { estado } = req.query;

    if (estado === 'completadas') {
        const filtradas = tareas.filter(t => t.completada === true);
        return res.json(filtradas);
    } 
    
    if (estado === 'pendientes') {
        const filtradas = tareas.filter(t => t.completada === false);
        return res.json(filtradas);
    }

    res.json(tareas);
});


app.post('/tareas', (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).send('Debe ingresar un nombre válido para la tarea.' );
    }

    const nombreLimpio = nombre.trim();

    const existe = tareas.find(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (existe) {
        return res.status(409).send( 'Ya existe una tarea con ese nombre.');
    }

    const nuevaTarea = { 
        nombre: nombreLimpio, 
        completada: false 
    };
    
    tareas.push(nuevaTarea);

    res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
});

app.put('/tareas/:nombreTarea', (req, res) => {
    const { nombreTarea } = req.params;
    const { completada } = req.body;

    if (typeof completada !== 'boolean') {
        return res.status(400).send('Debe enviar un campo "completada" de tipo booleano (true/false).');
    }

    const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreTarea.toLowerCase());
    
    if (!tarea) {
        return res.status(404).send('Tarea no encontrada.');
    }

    tarea.completada = completada;

    res.json({ mensaje: 'Estado de la tarea actualizado', tarea });
});

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000")
})