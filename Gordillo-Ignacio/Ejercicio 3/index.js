import express from "express";

const app = express();
app.use(express.json());

let tareas = [];
let ultimoId = 0;

const esIdValido = (id) => Number.isInteger(id) && id > 0;
const esNombreValido = (nombre) => typeof nombre === "string" && nombre.trim() !== "";

// idExcluido permite que una tarea se modifique conservando su propio nombre
const nombreRepetido = (nombre, idExcluido) =>
  tareas.some(
    (t) => t.id !== idExcluido && t.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );

// GET /tareas?completada=true|false
app.get("/tareas", (req, res) => {
  const { completada } = req.query;
  if (completada === undefined) return res.json(tareas);

  if (completada !== "true" && completada !== "false") {
    return res.status(400).json({ error: "completada debe ser true o false" });
  }
  res.json(tareas.filter((t) => t.completada === (completada === "true")));
});

app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  res.json(tarea);
});

app.post("/tareas", (req, res) => {
  const { nombre, completada = false } = req.body ?? {};
  if (!esNombreValido(nombre)) return res.status(400).json({ error: "nombre es obligatorio" });
  if (typeof completada !== "boolean") return res.status(400).json({ error: "completada debe ser true o false" });
  if (nombreRepetido(nombre)) return res.status(409).json({ error: "Ya existe una tarea con ese nombre" });

  const tarea = { id: ++ultimoId, nombre: nombre.trim(), completada };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

// PUT: reemplaza nombre y estado
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const { nombre, completada } = req.body ?? {};
  if (!esNombreValido(nombre)) return res.status(400).json({ error: "nombre es obligatorio" });
  if (typeof completada !== "boolean") return res.status(400).json({ error: "completada debe ser true o false" });

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
  if (nombreRepetido(nombre, id)) return res.status(409).json({ error: "Ya existe una tarea con ese nombre" });

  tarea.nombre = nombre.trim();
  tarea.completada = completada;
  res.json(tarea);
});

// PATCH: cambia solo el estado
app.patch("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const { completada } = req.body ?? {};
  if (typeof completada !== "boolean") return res.status(400).json({ error: "completada debe ser true o false" });

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  tarea.completada = completada;
  res.json(tarea);
});

app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  if (!tareas.some((t) => t.id === id)) return res.status(404).json({ error: "Tarea no encontrada" });

  tareas = tareas.filter((t) => t.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Ejercicio 3 escuchando en http://localhost:3000"));