import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

//arreglo para guardar tareas
let tareas = [];

//post para crear tarea
app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    //validaciones para nombre y completada
    if (!nombre && completada === undefined) {
        return res.status(400).send("la tarea debe tener nombre y completada");
    }

    if (!nombre) {
        return res.status(400).send("la tarea debe tener nombre");
    }

    if (completada === undefined) {
        return res.status(400).send("la tarea debe tener estado");
    }

    //verificar que no haya otra tarea con el mismo nombre
    if (tareas.find((t) => t.nombre.toLowerCase() === nombre.toLowerCase())) {
        return res.status(400).send("ya existe una tarea con ese nombre");
    }

    //agrega la tarea en el arreglo
    tareas.push({ nombre, completada });
    res.status(201).send("tarea creada correctamente");
});

//put para modificar tarea
app.put("/tareas/:nombre", (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const { completada } = req.body;

    //busca tarea por nombre y valida la existencia
    const tarea = tareas.find((t) => t.nombre.toLowerCase() === nombreParam);
    if (!tarea) {
        return res.status(404).send("tarea no encontrada");
    }

    //valida el estado
    if (completada === undefined) {
        return res.status(400).send("la tarea debe tener estado");
    }
    
    //modifica la tarea
    tarea.completada = completada;
    res.send("tarea modificada correctamente");

});

//get para obtener todas las tareas
app.get("/tareas", (req, res) => {

    const filtro = req.query.completada;
    if (filtro === "true") {
        res.send(tareas.filter((t) => t.completada === true));
    } else if (filtro === "false") {
        res.send(tareas.filter((t) => t.completada === false));
    } else {
        res.send(tareas);
    }

});

//delete para eliminar tarea
app.delete("/tareas/:nombre", (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const tarea = tareas.find((t) => t.nombre.toLowerCase() === nombreParam);
    if (!tarea) {
        return res.status(404).send("tarea no encontrada");
    }
    tareas = tareas.filter((t) => t.nombre.toLowerCase() !== nombreParam);
    res.send("tarea eliminada correctamente");

});

app.listen(port, () => {
    console.log(`API de alumnos funcionando en puerto ${port}`);
});








