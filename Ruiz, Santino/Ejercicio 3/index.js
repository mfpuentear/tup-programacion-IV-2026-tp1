import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para conservar las tareas
let tareas = [
  { id: 1, nombre: "Aprender ExpressJS", completada: true },
  { id: 2, nombre: "Hacer las compras", completada: false }
];

let nextId = 3;

// GET para entregar listado de tareas (soporta filtrado por estado)
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  // Si el usuario envía el filtro por query param
  if (completada !== undefined) {
    // Convertimos el string recibido en la query a booleano
    const isCompletada = completada.toLowerCase() === 'true';
    const tareasFiltradas = tareas.filter((t) => t.completada === isCompletada);
    return res.send(tareasFiltradas);
  }

  // Si no hay filtro, enviamos todas
  res.send(tareas);
});

// GET para entregar detalle de una tarea
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  res.send(tarea);
});

// POST para crear una tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).send("El nombre de la tarea es obligatorio");
  }

  const nombreNormalizado = nombre.trim().toLowerCase();
  const existe = tareas.find((t) => t.nombre.toLowerCase() === nombreNormalizado);

  if (existe) {
    return res.status(400).send("Ya existe una tarea con ese nombre");
  }

  const nuevaTarea = {
    id: nextId++,
    nombre: nombre.trim(),
    // Si no envían el estado, por defecto es false (pendiente)
    completada: typeof completada === 'boolean' ? completada : false 
  };

  tareas.push(nuevaTarea);
  res.status(201).send(nuevaTarea);
});

// PUT para modificar una tarea (nombre y/o estado)
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  let tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  const { nombre, completada } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).send("El nombre de la tarea es obligatorio");
  }

  const nombreNormalizado = nombre.trim().toLowerCase();
  
  // Verificamos si existe otra tarea con el mismo nombre, excluyendo la actual
  const nombreOcupado = tareas.find(
    (t) => t.nombre.toLowerCase() === nombreNormalizado && t.id !== id
  );

  if (nombreOcupado) {
    return res.status(400).send("El nombre provisto ya le pertenece a otra tarea");
  }

  tareaEncontrada.nombre = nombre.trim();
  if (typeof completada === 'boolean') {
    tareaEncontrada.completada = completada;
  }

  res.send(tareaEncontrada);
});

// DELETE para quitar una tarea
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  tareas = tareas.filter((t) => t.id !== id);
  res.send(tareaEncontrada);
});

app.listen(port, () => {
  console.log(`API de Tareas funcionando en el puerto ${port}`);
});