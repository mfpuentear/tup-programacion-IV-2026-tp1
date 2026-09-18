const express = require("express");

const app = express();
const PUERTO = 3003;

app.use(express.json());

// Arreglo interno en memoria: [{ nombre, completada }, ...]
let tareas = [];

// --- Helpers ---------------------------------------------------------

function buscarIndicePorNombre(nombre) {
  return tareas.findIndex(
    (t) => t.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

// --- Endpoints ---------------------------------------------------------

// POST /tareas  { nombre }
app.post("/tareas", (req, res) => {
  const { nombre } = req.body;

  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "El 'nombre' es obligatorio" });
  }
  if (buscarIndicePorNombre(nombre) !== -1) {
    return res.status(409).json({ error: "Ya existe una tarea con ese nombre" });
  }

  const tarea = { nombre: nombre.trim(), completada: false };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

// GET /tareas  |  GET /tareas?completada=true|false
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  if (completada === undefined) {
    return res.status(200).json(tareas);
  }

  if (completada !== "true" && completada !== "false") {
    return res.status(400).json({
      error: "El parámetro 'completada' debe ser 'true' o 'false'",
    });
  }

  const filtro = completada === "true";
  res.status(200).json(tareas.filter((t) => t.completada === filtro));
});

// GET /tareas/:nombre
app.get("/tareas/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.status(200).json(tareas[indice]);
});

// PUT /tareas/:nombre  { nombre?, completada? }
app.put("/tareas/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const { nombre, completada } = req.body;
  const tareaActual = tareas[indice];

  const nuevoNombre = nombre !== undefined ? nombre : tareaActual.nombre;
  const nuevaCompletada =
    completada !== undefined ? completada : tareaActual.completada;

  if (typeof nuevoNombre !== "string" || nuevoNombre.trim() === "") {
    return res.status(400).json({ error: "El 'nombre' no puede estar vacío" });
  }
  if (typeof nuevaCompletada !== "boolean") {
    return res.status(400).json({ error: "'completada' debe ser true o false" });
  }

  const indiceConEseNombre = buscarIndicePorNombre(nuevoNombre);
  if (indiceConEseNombre !== -1 && indiceConEseNombre !== indice) {
    return res.status(409).json({ error: "Ya existe una tarea con ese nombre" });
  }

  tareas[indice] = { nombre: nuevoNombre.trim(), completada: nuevaCompletada };
  res.status(200).json(tareas[indice]);
});

// DELETE /tareas/:nombre
app.delete("/tareas/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  const [eliminada] = tareas.splice(indice, 1);
  res.status(200).json(eliminada);
});

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

app.listen(PUERTO, () => {
  console.log(`Ejercicio 3 escuchando en http://localhost:${PUERTO}`);
});
