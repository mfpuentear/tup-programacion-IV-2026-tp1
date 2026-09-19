import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let tareas= [
    {id: 1, nombre: "Lavar los platos", completada: true},
    {id: 2, nombre: "Estudiar para el parcial", completada: false },
    {id: 3, nombre: "Hacer las compras", completada: false},

];

let nextId = 4;

app.get("/", (req, res) => {
    res.send("Hello world");
});

//GET listado de tareas, con filtro opcional por estado
app.get("/tareas", (req, res) => {
    let tareasFiltradas = [...tareas];

    const { completada } = req.query

    if(completada !== undefined){
        if (completada !== "true" && completada !== "false") {
            return res.status(400).send("El filtro completada debe ser true o false");
        }
        const esCompleta = completada === "true";
        tareasFiltradas = tareasFiltradas.filter((t) => t.completada === esCompleta);
    }

    res.send(tareasFiltradas);
});

//GET para detalles de una tarea
app.get("/tareas/:id", (req, res) => {
    const id = Number(req.params.id);


    if (isNaN(id) || id <= 0) {
        return res.status(400).send("El id debe ser un lumero valido");

    }

    const tarea = tareas.find((t) => t.id === id);

if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
}

res.send(tarea);
});

//Post para crear tarea
app.post("/tareas", (req, res) => {
    const { nombre } = req.body;

    //Valudamos que se haya ingresado un nombre
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).send("Debe ingresar un nombre valido");

    }

    // Validamos que no exista otra tarea con el mismo nombre
    const nombreExistente= tareas.some(
        (t) => t.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if(nombreExistente) {
        return res.status(400).send("Ya existe una tarea con ese nombre ");

    }

    const nuevaTarea = {
        id: nextId++,
        nombre: nombre.trim(),
        completada: false,
    };

    tareas.push(nuevaTarea);

    res.status(201).send(nuevaTarea);
});

//PUT para modificar tarea nombre y/o estado
app.put("/tareas/:id", (req, res) => {
    const id = Number(req.params.id);

    if( isNaN(id) || id <= 0) {
        return res.status(400).send("El id debe ser un numero valido");
    }

    const tarea = tareas.find((t) => t.id === id);

    if (!tarea) {
        return res.status(404).send("Tarea no encontrada");
    }

    const { nombre, completada } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).send("Debe ingresar un nombre valido");
    }

    if (typeof completada !== "boolean") {
        return res.status(400).send("El campo completada debe ser true o flase");
    }

    //Validamos que el nombre no pertenezca a otra tarea
    
    const nombreDuplicado = tareas.some(
        (t) => t.id !== id && t.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
        return res.status(400).send("Ya existe otra tarea con ese nombre");

    }

    tarea.nombre = nombre.trim();
    tarea.completada = completada;

    res.send(tarea);
});

//DELETE para quitar tarea
app.delete("/tareas/:id", (req, res) => {
    const id= Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).send("El id debe ser un numero valido");
    }

    const tarea = tareas.find((t) => t.id === id);

    if(!tarea) {
        return res.status(404).send("Tarea no encontrada");
    }

    tareas = tareas.filter((t) => t.id !== id);

    res.send(tarea);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});