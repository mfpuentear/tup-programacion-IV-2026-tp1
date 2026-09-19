import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para conservar tareas
let tareas = [
  { id: 1, nombre: "Diseñar la base de datos", completada: true },
  { id: 2, nombre: "Implementar endpoints en Express", completada: false },
  { id: 3, nombre: "Redactar documentación en README", completada: false },
];

let nextId = 4;

// Helper para validar datos de entrada al crear/editar
const validarTarea = (nombre, completada) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return { valido: false, mensaje: "El nombre es obligatorio y debe ser un texto válido" };
  }

  if (completada !== undefined && typeof completada !== "boolean") {
    return { valido: false, mensaje: "El campo completada debe ser un valor booleano (true o false)" };
  }

  return { valido: true };
};

app.get("/", (req, res) => {
  res.send("API de Gestión de Tareas");
});

// GET para listar tareas (soporta filtro por query param ?completada=true|false)
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  if (completada !== undefined) {
    if (completada !== "true" && completada !== "false") {
      return res.status(400).send("El parámetro 'completada' debe ser 'true' o 'false'");
    }

    const estadoBooleano = completada === "true";
    const tareasFiltradas = tareas.filter((t) => t.completada === estadoBooleano);
    return res.send(tareasFiltradas);
  }

  res.send(tareas);
});

// GET para obtener una tarea específica por ID
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

// POST para crear una nueva tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada = false } = req.body;

  const validacion = validarTarea(nombre, completada);
  if (!validacion.valido) {
    return res.status(400).send(validacion.mensaje);
  }

  const nombreLimpio = nombre.trim();

  // Validación de unicidad de nombre (case insensitive)
  const existe = tareas.some(
    (t) => t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );

  if (existe) {
    return res.status(400).send("Ya existe una tarea registrada con ese nombre");
  }

  const nuevaTarea = {
    id: nextId++,
    nombre: nombreLimpio,
    completada,
  };

  tareas.push(nuevaTarea);
  res.status(201).send(nuevaTarea);
});

// PUT para modificar nombre y/o estado de una tarea por ID
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  const { nombre, completada } = req.body;

  const validacion = validarTarea(nombre, completada);
  if (!validacion.valido) {
    return res.status(400).send(validacion.mensaje);
  }

  const nombreLimpio = nombre.trim();

  // Validar nombre duplicado (excluyendo la tarea actual)
  const existeDuplicado = tareas.some(
    (t) => t.id !== id && t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );

  if (existeDuplicado) {
    return res.status(400).send("Ya existe otra tarea registrada con ese nombre");
  }

  tareaEncontrada.nombre = nombreLimpio;
  if (completada !== undefined) {
    tareaEncontrada.completada = completada;
  }

  res.send(tareaEncontrada);
});

// PATCH para conmutar o actualizar rápidamente solo el estado de una tarea
app.patch("/tareas/:id/completada", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  const { completada } = req.body;

  if (typeof completada !== "boolean") {
    return res.status(400).send("El campo completada debe ser un booleano");
  }

  tareaEncontrada.completada = completada;
  res.send(tareaEncontrada);
});

// DELETE para eliminar una tarea por ID
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const tareaEncontrada = tareas.find((t) => t.id === id);

  if (!tareaEncontrada) {
    return res.status(404).send("Tarea no encontrada");
  }

  tareas = tareas.filter((t) => t.id !== id);
  res.send(tareaEncontrada);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});