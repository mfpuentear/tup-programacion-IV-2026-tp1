import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let tareas = [
  { id: 1, nombre: "Configurar repositorio Git", completada: true },
  { id: 2, nombre: "Implementar Express", completada: false },
  { id: 3, nombre: "Crear archivo de pruebas HTTP", completada: false },
];
let nextId = 4;

// Consultar tareas (permite ?completada=true o ?completada=false)
app.get("/tareas", (req, res) => {
  let resultado = [...tareas];
  const { completada } = req.query;

  if (completada !== undefined) {
    if (completada === "true") {
      resultado = resultado.filter((t) => t.completada === true);
    } else if (completada === "false") {
      resultado = resultado.filter((t) => t.completada === false);
    } else {
      return res.status(400).send("Parámetro 'completada' debe ser 'true' o 'false'");
    }
  }

  res.send(resultado);
});

// Detalle por ID
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  res.send(tarea);
});

// Crear tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre de la tarea es requerido");
  }

  const nombreLimpio = nombre.trim();
  const existe = tareas.some(
    (t) => t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );
  if (existe) {
    return res.status(400).send("Ya existe una tarea con ese nombre");
  }

  const nuevaTarea = {
    id: nextId++,
    nombre: nombreLimpio,
    completada: typeof completada === "boolean" ? completada : false,
  };

  tareas.push(nuevaTarea);
  res.status(201).send(nuevaTarea);
});

// Modificar tarea
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre es requerido");
  }

  const nombreLimpio = nombre.trim();
  const existe = tareas.some(
    (t) => t.id !== id && t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );
  if (existe) {
    return res.status(400).send("Ya existe otra tarea con ese nombre");
  }

  if (typeof completada !== "boolean") {
    return res.status(400).send("El estado 'completada' debe ser booleano (true o false)");
  }

  tarea.nombre = nombreLimpio;
  tarea.completada = completada;

  res.send(tarea);
});

// Quitar tarea
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const index = tareas.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).send("Tarea no encontrada");
  }

  const [eliminada] = tareas.splice(index, 1);
  res.send(eliminada);
});

app.listen(port, () => console.log(`Servidor en puerto ${port}`));