import express from "express";

const app = express();
const port = 3003;

app.use(express.json());

let tareas = [
  { id: 1, nombre: "Hacer TP", completada: false },
  { id: 2, nombre: "Estudiar JavaScript", completada: true },
  { id: 3, nombre: "Leer apuntes", completada: false },
];

let nextId = 4;

app.get("/", (req, res) => {
  res.send("API de tareas funcionando");
});

app.get("/tareas", (req, res) => {
  let tareasFiltradas = [...tareas];

  const completada = req.query.completada;

  if (completada) {
    if (completada !== "true" && completada !== "false") {
      return res.status(400).send("El valor de completada debe ser true o false");
    }

    const estado = completada === "true";

    tareasFiltradas = tareasFiltradas.filter(
      (t) => t.completada === estado,
    );
  }

  res.send(tareasFiltradas);
});

app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).send("Tarea no encontrada");
  }

  res.send(tarea);
});

app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (nombre === undefined || completada === undefined) {
    return res.status(400).send("El nombre y el estado son obligatorios");
  }

  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre debe ser válido");
  }

  if (typeof completada !== "boolean") {
    return res.status(400).send("Completada debe ser true o false");
  }

  const tareaExistente = tareas.find(
    (t) => t.nombre.toLocaleLowerCase() === nombre.toLocaleLowerCase(),
  );

  if (tareaExistente) {
    return res.status(400).send("Ya existe una tarea con ese nombre");
  }

  const nuevaTarea = {
    id: nextId++,
    nombre,
    completada,
  };

  tareas.push(nuevaTarea);

  res.status(201).send(nuevaTarea);
});

app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  const { nombre, completada } = req.body;

  if (nombre === undefined || completada === undefined) {
    return res.status(400).send("El nombre y el estado son obligatorios");
  }

  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre debe ser válido");
  }

  if (typeof completada !== "boolean") {
    return res.status(400).send("Completada debe ser true o false");
  }

  const tareaExistente = tareas.find(
    (t) =>
      t.nombre.toLocaleLowerCase() === nombre.toLocaleLowerCase() &&
      t.id !== id,
  );

  if (tareaExistente) {
    return res.status(400).send("Ya existe una tarea con ese nombre");
  }

  tareaEncontrada.nombre = nombre;
  tareaEncontrada.completada = completada;

  res.send(tareaEncontrada);
});

app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  tareas = tareas.filter((t) => t.id !== id);

  res.send(tareaEncontrada);
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`);
});