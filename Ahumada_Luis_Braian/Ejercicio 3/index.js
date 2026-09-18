import express from "express";

const app = express();
app.use(express.json());

const tareas = [];
let nextId = 1; // Variable para generar IDs únicos

app.get("/", (req, res) => {
    res.send("hola mundo");
});



// Obtener todas las tareas
app.get("/tareas", (req, res) => {
  res.json(tareas);
});



// Muestra las tareas completadas
app.get("/tareas/completadas", (req, res) => {
  const tareasCompletadas = tareas.filter(tarea => tarea.completada);
  res.json(tareasCompletadas);
});


// Muestra las tareas pendientes
app.get("/tareas/pendientes", (req, res) => {
  const tareasPendientes = tareas.filter(tarea => !tarea.completada);
  res.json(tareasPendientes);
});



// Buscar una tarea por ID
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  
  // Validación para el ID: debe ser un número positivo y no NaN
  if (id < 1 || isNaN(id)) {
    return res.status(400).send("ID inválido");
  }

  const tarea = tareas.find(tarea => tarea.id === id);

  // Validación para verificar si la tarea existe
  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  // Enviar la tarea encontrada en formato JSON
  res.json(tarea);
});




//Crear una nueva tarea
app.post("/tareas", (req, res) => {
  const nombre = req.body.nombre;
  const completada = req.body.completada;

    // Validación para el nombre: debe ser una cadena de texto no vacía
    if (!nombre) {
        return res.status(400).send("La tarea debe tener un nombre");
    }

    // Validación de que la tarea no existe
    const tareaExistente = tareas.find(tarea => tarea.nombre === nombre);
    if (tareaExistente) {
        return res.status(400).send("La tarea ya existe");
    }

    // Validación para completada: debe ser un valor booleano
    if (typeof completada !== "boolean") {
        return res.status(400).send("El estado de completada debe ser un valor booleano");
    }

    const nuevaTarea = {
        id: nextId++,
        nombre: nombre,
        completada: completada
    };

    // Enviar la nueva tarea creada en formato JSON con el código de estado 201 (Created)
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});


// Actualizar una tarea existente
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  // Validación para el ID: debe ser un número positivo y no NaN
  if (id < 1 || isNaN(id)) {
    return res.status(400).send("ID inválido");
  }

  const tarea = tareas.find(tarea => tarea.id === id);

  //Valida que la tarea exista
  if(!tarea)
  {
    return res.status(404).send("Tarea no encontrada");
  }

  const nombre = req.body.nombre;
  const completada = req.body.completada;

  //Validacion  de los datos
  // Validación para el nombre: debe ser una cadena de texto no vacía
    if (!nombre) {
        return res.status(400).send("La tarea debe tener un nombre");
    }

    if (typeof completada !== "boolean") {
        return res.status(400).send("El estado de completada debe ser un valor booleano");
    }


    // Verificar que no exista otra tarea con ese nombre
    const tareaExistente = tareas.find(
        otraTarea => otraTarea.nombre === nombre && otraTarea.id !== id
    );
    if(tareaExistente)
    {
        return res.status(400).send("Ya existe otra tarea con este nombre");
    }

    //Enviar la actualizacion de la tarea
    tarea.nombre = nombre;
    tarea.completada = completada;

    res.json(tarea);
});


//Eliminar una tarea
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  // Validación para el ID: debe ser un número positivo y no NaN
  if (id < 1 || isNaN(id)) {
    return res.status(400).send("ID inválido");
  }

  // Buscamos el índice de la tarea en el arreglo, es necesario para poder eliminarlo con splice
  const index = tareas.findIndex(tarea => tarea.id === id);


  // Si la tarea no se encuentra, enviamos un error 404
  if (index === -1) {
    return res.status(404).send("La tarea no fué encontrada");
  }

  tareas.splice(index, 1);
  res.send("Tarea eliminada");
});


app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});

