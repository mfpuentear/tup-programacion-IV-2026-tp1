import express from 'express'

const app = express()

app.use(express.json())

// Nuestro arreglo interno 
let tareas = [{ nombre: "Comprar leche", completada: false }];

// Ruta para obtener las tareas 
app.get('/tareas', (req, res) => {
    const estado = req.query.estado;

    // Si el usuario quiere ver solo las completadas
    if (estado === 'completadas') {
        let filtradas = []; 
        
        // Recorremos todas las tareas
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].completada === true) {
                filtradas.push(tareas[i]);
            }
        }
        return res.json(filtradas);
    } 
    
    // Si el usuario quiere ver solo las tareas pendientes
    if (estado === 'pendientes') {
        let filtradas = [];
        
    // Si el usuario quiere ver solo las tareas completadas
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].completada === false) {
                filtradas.push(tareas[i]);
            }
        }
        return res.json(filtradas);
    }

    res.json(tareas);
});

// Ruta para crear una nueva tarea
app.post('/tareas', (req, res) => {
    // Obtenemos el nombre del body directamente
    const nombre = req.body.nombre;

    // Validamos que el nombre exista, sea texto y no esté vacío
    if (nombre === undefined || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).send('Debe ingresar un nombre válido para la tarea.');
    }

    // Le quitamos los espacios en blanco sobrantes al principio y al final
    const nombreLimpio = nombre.trim();

    // Buscamos si la tarea ya existe
    let existe = false;
    for (let i = 0; i < tareas.length; i++) {
        // Convertimos ambos a minúsculas para comparar correctamente
        if (tareas[i].nombre.toLowerCase() === nombreLimpio.toLowerCase()) {
            existe = true;
            break;
        }
    }

    // Si devuelve true, avisamos que ya existe
    if (existe === true) {
        return res.status(409).send('Ya existe una tarea con ese nombre.');
    }

    // Creamos el nuevo objeto de tarea. Por defecto, completada es false
    let nuevaTarea = { 
        nombre: nombreLimpio, 
        completada: false 
    };
    
    // La agregamos a nuestro arreglo
    tareas.push(nuevaTarea);

    res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
});

// Ruta para cambiar el estado de una tarea (marcar como completada o pendiente)
app.put('/tareas/:nombreTarea', (req, res) => {
    // Leemos los parámetros directamente
    const nombreTarea = req.params.nombreTarea;
    const completada = req.body.completada;

    // Validamos que nos envíen obligatoriamente un true o false
    if (typeof completada !== 'boolean') {
        return res.status(400).send('Debe enviar un campo "completada" de tipo booleano (true/false).');
    }

    // Buscamos el índice de la tarea
    let index = -1;
    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].nombre.toLowerCase() === nombreTarea.toLowerCase()) {
            index = i;
            break;
        }
    }
    
    // Si el índice sigue siendo -1, la tarea no existe
    if (index === -1) {
        return res.status(404).send('Tarea no encontrada.');
    }

    // Modificamos el estado de la tarea en esa posición exacta
    tareas[index].completada = completada;

    res.json({ mensaje: 'Estado de la tarea actualizado', tarea: tareas[index] });
});

// Encendemos el servidor
app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000")
})
