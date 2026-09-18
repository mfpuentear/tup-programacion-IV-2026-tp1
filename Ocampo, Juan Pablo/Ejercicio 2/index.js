import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

// arreglo para guardar alumnos
let alumnos = [];

// funcion para calcular promedio
function calcularPromedio(notas) {
    const suma = notas.reduce((acc, nota) => acc + nota, 0);
    return suma / notas.length;
}

// funcion para determinar la condicion
function obtenerCondicion(promedio) {
    if (promedio >= 8) {
        return "Promocionado";
    } else if (promedio >= 6) {
        return "Regular";
    } else {
        return "Reprobado";
    }
}

// POST para crear alumno
app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

// Validaciones para notas y nombre
   if (!nombre && (!notas || notas.length === 0)) {
        return res.status(400).send("el alumno debe tener nombre y tres notas");
    }

    if (!nombre) {
        return res.status(400).send("el alumno debe tener nombre");
    }

    if (!notas || notas.length !== 3) {
        return res.status(400).send("el alumno debe tener tres notas");
    }
    //validación de rango de notas
    if (notas.some((n) => isNaN(n) || n < 1 || n > 10)) {
        return res.status(400).send("las notas deben estar entre 1 y 10");
    }

    // verificar que no exista otro alumno con el mismo nombre
    if (alumnos.find((a) => a.nombre.toLowerCase() === nombre.toLowerCase())) {
        return res.status(400).send("ya existe un alumno con ese nombre");
    }


    //agrega al alumno en el arreglo
    alumnos.push({ nombre, notas });
    res.status(201).send("alumno creado correctamente");
});

// PUT para modificar las notas del alumno
app.put("/alumnos/:nombre", (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const { notas } = req.body;

    //busca alumno por nombre y valida la existencia
    const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombreParam);
    if (!alumno) {
        return res.status(404).send("alumno no encontrado");
    }
    
    //validacion para las notas
    if (!notas || notas.length !== 3) {
        return res.status(400).send("el alumno debe tener tres notas");
    }


    if (notas.some((n) => isNaN(n) || n < 1 || n > 10)) {
        return res.status(400).send("las notas deben estar entre 1 y 10");
    }

    //actualiza las notas
    alumno.notas = notas;
    res.send("notas actualizadas correctamente");
});

// GET que consulta alumno por nombre
app.get("/alumnos/:nombre", (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombreParam);

    if (!alumno) {
        return res.status(404).send("alumno no encontrado");
    }
    //calcula promedio y condicion
    const promedio = calcularPromedio(alumno.notas);
    const condicion = obtenerCondicion(promedio);

    //devolver datos del alumno
    res.send({ nombre: alumno.nombre,notas: alumno.notas, promedio,condicion,});
});

// GET para obtener todos los alumnos
app.get("/alumnos", (req, res) => {
    //genera el listado 
    const listado = alumnos.map((a) => {
        const promedio = calcularPromedio(a.notas);
        const condicion = obtenerCondicion(promedio);
        return { nombre: a.nombre, promedio, condicion };
    });
    res.send(listado);
});

// DELETE para eliminar alumno
app.delete("/alumnos/:nombre", (req, res) => {
    const nombreParam = req.params.nombre.toLowerCase();
    const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombreParam);

    if (!alumno) {
        return res.status(404).send("alumno no encontrado");
    }

    //elimina el alumno del arreglo
    alumnos = alumnos.filter((a) => a.nombre.toLowerCase() !== nombreParam);
    res.send("Alumno eliminado correctamente");
});

app.listen(port, () => {
    console.log(`API de alumnos funcionando en puerto ${port}`);
});
