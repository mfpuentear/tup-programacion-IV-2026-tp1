import express from "express";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello, World!");
});


const alumnos = [];
let nextId = 1; // Variable para generar IDs únicos


//Envia todos los alumnos registrados en la API
app.get("/alumnos", (req, res) => {
  res.json(alumnos);
});


//Encontrar un alumno por id
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find(alumno => alumno.id === id);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  //calculo para el promedio
  const suma = alumno.notas[0] + alumno.notas[1] + alumno.notas[2];
  const promedio = suma / 3;

  // Determinamos la condición del alumno según su promedio
  // Variable let ya que no necesita tener un valor inicial y se asignará un valor según la condición del alumno
  let condicion;
  
  if(promedio < 6) {
    condicion = "Desaprobado";
  }
  if(promedio >= 6 && promedio < 8) {
    condicion = "Aprobado";
  }
  if(promedio >= 8) {
    condicion = "Promocionado";
  }

  //enviamos la respuesta en formato JSON con el nombre, notas, promedio y condicion del alumno
  res.json({
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: promedio,
    condicion: condicion    
  });
});


//Crear un alumno nuevo
app.post("/alumnos", (req, res) => {
    const nombre = req.body.nombre;
    const notas = req.body.notas;

    //Valida que el alumno tenga un nombre y exactamente tres notas
    if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).send("El alumno debe tener un nombre y exactamente tres notas");
    }

    //Asegura que no exista un alumno con un mismo nombre antes de crear uno nuevo
    const alumnoExistente = alumnos.find(alumno => alumno.nombre === nombre);
    if (alumnoExistente) {
        return res.status(400).send("Ya existe un alumno con ese nombre");
    }

    // Valida que las notas estén entre 0 y 10
    if (notas.some(nota => nota < 0 || nota > 10)) {
        return res.status(400).send(
            "Las notas deben estar entre 0 y 10"
        );
    }

    const nuevoAlumno = {
        id: nextId++, // Asignamos un ID único al nuevo alumno
        nombre: nombre,
        notas: notas
    };

    //Agrega el nuevo alumno al arreglo de alumnos
    alumnos.push(nuevoAlumno);

    //Envia la respuesta con el nuevo alumno creado y un status 201
    res.status(201).json(nuevoAlumno);
});


app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find(alumno => alumno.id === id);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  const nombre = req.body.nombre;
  const notas = req.body.notas;

  // Validamos que el alumno tenga un nombre y exactamente tres notas
  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).send("El alumno debe tener un nombre y exactamente tres notas");
  }

  // Valida que las notas estén entre 0 y 10
    if (notas.some(nota => nota < 0 || nota > 10)) {
        return res.status(400).send(
            "Las notas deben estar entre 0 y 10"
        );
    }

    // Aseguramos que no exista un alumno con el mismo nombre antes de modificarlo
    const alumnoExistente = alumnos.find(
    otroAlumno => otroAlumno.nombre === nombre && otroAlumno.id !== id
);
  if (alumnoExistente) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
  }

  // Actualizamos los datos del alumno
  alumno.nombre = nombre;
  alumno.notas = notas;

  // Enviamos la respuesta con el alumno actualizado
  res.json(alumno);
});


//Eliminar un alumno por id
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  // Buscamos el índice del alumno en el arreglo, es necesario para poder eliminarlo con splice
  const index = alumnos.findIndex(alumno => alumno.id === id);

  // Si el alumno no se encuentra, enviamos un error 404
  if (index === -1) {
    return res.status(404).send("Alumno no encontrado");
  }

  alumnos.splice(index, 1);
  res.send("Alumno eliminado");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});