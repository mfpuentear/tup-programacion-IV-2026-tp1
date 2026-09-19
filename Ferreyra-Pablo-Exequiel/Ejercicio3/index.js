import express from "express";

const app = express();
const port = 3000

app.use(express.json())

let tareas = [];

// POST se utiliza para CREAR una nueva tarea
app.post("/tareas", (req, res) => {
    const {nombre, lista} = req.body

    if(!nombre || (lista !== true && lista !== false)) {
        return res
        .status(400)
        .json({success: false, message: "Se requiere un nombre y el estado (listo)"})
    }

    const yaExiste = tareas.find((t) => t.nombre.trim().toLocaleLowerCase() === nombre.toLocaleLowerCase());
    if (yaExiste){
        return res
        .status(409)
        .json({success: false, message: "Ya hay una tarea con ese mismo nombre"});
    }

    const nuevo = {nombre: nombre, lista};
    tareas.push(nuevo);
    res.status(201).json(nuevo);
});

// GET se utiliza para obtener información.
// En este caso devuelve las tareas. También permite filtrarlas mediante estado
app.get("/tareas", (req,res) => {
    const {estado} = req.query;

    let validar = tareas

    // si el estado es "listas"
    // filter() deja solamente las tareas cuyo valor "lista" sea true.
    if(estado === "listas") {
        validar = tareas.filter((t) => t.lista);

    // Si el estado es "porCompletar"
    // filter() deja solamente las tareas cuyo valor "lista" sea false.
    } else if (estado === "porCompletar") {
        validar = tareas.filter((t) => !t.lista);
    }
    // si encontramos la tarea, la devolvemos en formato JSON
    return res.json({validar});
});


//En este caso busca una tarea específica por su nombre.

app.get("/tareas/:nombre", (req, res) => {
    
    // req.params.nombre obtiene el nombreque viene en la URL.
    // trim() elimina espacios innecesarios. 
    // toLocaleLowerCase() convierte a minúsculas para facilitar la comparación
    const nombre = req.params.nombre.trim().toLocaleLowerCase();
    // find() busca una tarea cuyo nombre
    // coincida con el nombre recibido
    const tarea = tareas.find((t) => t.nombre.trim().toLocaleLowerCase() === nombre);

    // si no encontramos la tarea, devolvemos un error 404
    if(!tarea){
        return res
        .status(404)
        .json({success: false, message:"No se encontro esa tarea"});
    }

    // si encontramos la tarea, la devolvemos en formato JSON
    res.json(tarea);
})

// iniciamos el servidor
app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});