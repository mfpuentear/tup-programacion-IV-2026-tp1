import express from "express"

const app = express();

app.use(express.json())

const tareas = [
    {
        id: 0,
        nombre: 'Revisar moto',
        completada: true
    }
]

let nextId = 1


app.get("/", (req, res) => {
  res.send("Testing hola");
});

////////////

// Ver todas las tareas

app.get("/tareas", (req, res) => {
  res.json(tareas)
});

////////////

// Ver tareas pendientes

app.get("/tareas/pendientes", (req, res) => {
  
    const tareasPendientes = tareas.filter((t) => t.completada === false)

    res.json(tareasPendientes)
    
});

////////////

// Ver tareas completadas

app.get("/tareas/completadas", (req, res) => {

    const tareasCompletadas = tareas.filter((t) => t.completada === true)

    res.json(tareasCompletadas)
});

////////////

// Crear tarea

app.post("/tareas", (req, res) => {



    const nombre = "Comprar aceite"
    req.body = nombre

    if(!nombre) {
        return res.status(400).json({
            error: "Ingrese un nombre."
        });
    }

    const tareaExistente = tareas.find(
        (t) => t.nombre === nombre
    );

    if(tareaExistente) {
        return res.status(409).json({
            error: "Ya existe una tarea con ese nombre."
        });
    }

    const nuevaTarea = { // Carga de tarea hacia el arreglo
        id: Number(nextId),
        nombre: nombre,
        completada: false
    };

    tareas.push(nuevaTarea);
    nextId++

    res.status(201).json(nuevaTarea);
});

////////////

// Modificar tarea

app.put("/tareas/:id", (req, res) => {

    const id = Number(req.params.id)
    const tarea = tareas.find(
        (t) => t.id === id
    )

    if(!tarea) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        })
    }
    // Indica en un json que variable es necesaria
    if(typeof req.body(tarea.completada) !== "boolean") {
        return res.status(400).json({
            error: "El estado completada debe ser true o false en booleano."
        })
    }

    tarea.completada = req.body

    res.json(tarea);
})

////////////

// Borrar tarea

app.delete("/tareas/:id", (req, res) => {

    const id = Number(req.params.id)

    const indiceTarea = tareas.findIndex(
        (t) => t.id === id
    );

    if (indiceTarea === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        })
    }

    tareas.splice(indiceTarea, 1); // borrar tarea en array

    res.status(204).send();
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
})