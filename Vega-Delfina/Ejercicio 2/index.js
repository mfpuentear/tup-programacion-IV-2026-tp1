import express from 'express';

const app = express();

app.use(express.json());

// Arreglo interno donde se almacenan los alumnos
let alumnos = [
    {id: 1, nombre: "Juan lopez", notas: [8, 7, 9] },
    {id: 2, nombre: "Marta Gomez", notas: [5, 4, 6]},
];


let nextId = 3;

function calcularPromedio(notas)  {
    const suma = notas.reduce((acc, n) => acc + n, 0);
    return suma / notas.length;
}

function calcularCondicion(promedio) {
    if (promedio < 6) return "reprobado";
    if (promedio <= 7) return "aprobado";
    return "promocionado";
}


app.get('/', (req, res) => {
  res.send('Hello World');
});

//GET para listado de alumnos
app.get("/alumnos", (req, res) => {
    res.send(alumnos);
});

//GET detalle de un alumno por su ID el promedio y condicion se calculan al realizar la consulta
app.get("/alumnos/:id", (req, res) => {
    const id= Number(req.params.id);

    if(isNaN(id) || id <= 0)  {
        return res.status(400).send("El id debe ser un numero valido");
    }

    const alumno= alumnos.find((a) => a.id === id);

    if (!alumno){
        return res.status(404).send("Alumno no encontrado");
    }

    const promedio = calcularPromedio(alumno.notas);
    const condicion = calcularCondicion(promedio);


    res.send({...alumno, promedio, condicion});
});

//Post para crear alumno
app.post("/alumnos", (req, res) => {
    const { nombre, notas} = req.body;

    //Validacion de ingreso de  nombre
    if(!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).send("Debe ingresar un nombre valido");
    
    }

    //Validacion para que las notas sean un arreglo de 3 numeros entre 0 y 10
    if ( !Array.isArray(notas) || notas.length !== 3 || 
    notas.some((n) => isNaN(n) || n < 0 || n> 10)
){
    return res.status(400)
    .send("Debe ingresar exactamente 3 notas numericas entre 0 y 10");
}

//Validamos que no exista otro alumno con el mismo nombre
const nombreExistente = alumnos.some(
    (a) => a.nombre.toLowerCase() === nombre.trim().toLowerCase()
);

if (nombreExistente) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
}

//Creamos el nuevo alumno con su id unico
const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    notas,

};

// Agregamos el alumno al arreglo interno
alumnos.push(nuevoAlumno);

res.status(201).send(nuevoAlumno);
});

//PUT para modificar un alumno
app.put("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);
    
    //Validamos que el numero de ID sea positivo
    if (isNaN(id) || id <= 0 ){
        return res.status(400).send("El id debe ser un numero valido");
    }

    //Buscamos al alumno que se desea modificar 
    const alumno = alumnos.find((a) => a.id === id);

    if(!alumno) {
        return res.status(404).send("Alumno no encontrado");
    }

    const { nombre, notas } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).send("Debe ingredar un nombre valido");
    }

    if (
        !Array.isArray(notas) || notas.length !== 3 || notas.some((n) => isNaN(n) ||
    n < 0 || n> 10)
    ) {
        return res.status(400)
        .send("Debe ingresar exactamente 3 notas numericas entre 0 y 10");
    }

    //Validamos que el nombre no pertenezca a otro alumno (excluyendo a si mismo)
    const nombreDuplicado = alumnos.some(
        (a) => a.id !== id && a.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
        return res.status(400).send("Ya existe un alumno con ese nombre");

    }

    alumno.nombre = nombre.trim();
    alumno.notas = notas;

    res.send(alumno);
});

//DELETE quitar alumnos
app.delete("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);

    //Validacion y busqueda de usuario
    if (isNaN(id) || id <= 0){
        return res.status(400).send("El id debe ser un numero valido");
    }

    const alumno = alumnos.find((a) => a.id === id);

    if (!alumno) {
        return res.status(404).send("Alumno no encontrado");
    }

    alumnos = alumnos.filter((a) => a.id !== id);

    res.send(alumno);
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});