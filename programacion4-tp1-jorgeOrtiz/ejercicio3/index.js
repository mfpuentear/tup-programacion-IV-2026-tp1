import express from "express";

const app = express();
const port = 3000;


app.use(express.json())


// Array en memoria en donde guardamos los recursos tareas: simula persistencia y permite aplicar operaciones CRUD sobre recursos 
let tareas = []; 


// POST /tareas: creación de recurso.
// Fundamenta validación estricta de integridad (nombre obligatorio, estado booleano).
// Se evita duplicación mediante búsqueda previa.
// Se devuelve recurso creado en JSON, coherente con convención REST.

app.post("/tareas", (req, res) => {
  const { nombre, lista } = req.body;

  // Validación 
  if (!nombre || (lista !== true && lista !== false)) {
    return res
      .status(400)
      .json({ success: false, message: "Error, se necesita nombre y estado" });
  }

  // Validación de duplicados
  const existente = tareas.find(
    (t) => t.nombre.trim().toLocaleLowerCase() === nombre.toLocaleLowerCase()
  );
  if (existente) {
    return res
      .status(400)
      .json({ success: false, message: "ERROR, tarea existente" });
  }

  
  const nuevo = { nombre: nombre.trim(), lista };
  tareas.push(nuevo);


  res.status(201).json(nuevo);
});



// GET /tareas: consulta de colección.
// Fundamenta filtrado dinámico por estado (realizadas / no realizadas).
// Se devuelve colección parcial o completa en JSON, coherente con diseño REST.

app.get("/tareas", (req, res) => {
  const{estado} = req.query;

  let validar = tareas;

  if(estado == "realizadas") {
    validar = tareas.filter((t) => t.lista);
  } else if ( estado == "noRealizada"){
    validar= tareas.filter((t) => !t.lista)
  }

  res.json(validar)


})

// GET /tareas/:nombre: consulta puntual.
// Fundamenta búsqueda exacta por atributo clave (nombre).
// Se valida existencia y se devuelve recurso en JSON, o error 404 si no existe.

app.get("/tareas/:nombre", (req, res ) => {

  const nombre = req.params.nombre.toLocaleLowerCase();
  const tarea= tarea.find((t) => t.nombre.tolocalelowerCase() === nombre);

  if (!tarea){
    return res
    .status(404)
    .json({success: false , message: "ERROR, no se encontro tarea"})
  }

  res.json(tarea);
})



app.listen(port, () => {
    console.log(`Servidor http://localhost:${port}`);
});