import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const tareas = [];
let siguienteId = 1;

const validarNombre = (nombre) => {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    const error = new Error("El nombre es obligatorio.");
    error.statusCode = 400;
    throw error;
  }

  return nombre.trim();
};

const validarEstado = (valor) => {
  if (valor !== true && valor !== false) {
    const error = new Error("El estado debe ser un valor booleano.");
    error.statusCode = 400;
    throw error;
  }

  return valor;
};

const serializarTarea = (tarea) => ({
  ...tarea,
  estado: tarea.completada ? "completada" : "pendiente",
});

app.get("/tareas", (req, res) => {
  res.json(tareas.map(serializarTarea));
});

app.get("/tareas/completadas", (req, res) => {
  res.json(tareas.filter((tarea) => tarea.completada).map(serializarTarea));
});

app.get("/tareas/pendientes", (req, res) => {
  res.json(tareas.filter((tarea) => !tarea.completada).map(serializarTarea));
});

app.get("/tareas/:id", (req, res) => {
  const tarea = tareas.find((item) => item.id === Number(req.params.id));

  if (!tarea) {
    return res.status(404).json({ message: "Tarea no encontrada." });
  }

  return res.json(serializarTarea(tarea));
});

app.post("/tareas", (req, res) => {
  try {
    const nombre = validarNombre(req.body.nombre);
    const completada = validarEstado(req.body.completada);

    const existente = tareas.some((item) => item.nombre.toLowerCase() === nombre.toLowerCase());
    if (existente) {
      return res.status(409).json({ message: "Ya existe una tarea con ese nombre." });
    }

    const tarea = {
      id: siguienteId++,
      nombre,
      completada,
    };

    tareas.push(tarea);

    return res.status(201).json(serializarTarea(tarea));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.put("/tareas/:id", (req, res) => {
  const tarea = tareas.find((item) => item.id === Number(req.params.id));

  if (!tarea) {
    return res.status(404).json({ message: "Tarea no encontrada." });
  }

  try {
    if (req.body.nombre !== undefined) {
      const nombre = validarNombre(req.body.nombre);
      const existeOtra = tareas.some(
        (item) => item.id !== tarea.id && item.nombre.toLowerCase() === nombre.toLowerCase()
      );

      if (existeOtra) {
        return res.status(409).json({ message: "Ya existe una tarea con ese nombre." });
      }

      tarea.nombre = nombre;
    }

    if (req.body.completada !== undefined) {
      tarea.completada = validarEstado(req.body.completada);
    }

    return res.json(serializarTarea(tarea));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.delete("/tareas/:id", (req, res) => {
  const posicion = tareas.findIndex((item) => item.id === Number(req.params.id));

  if (posicion === -1) {
    return res.status(404).json({ message: "Tarea no encontrada." });
  }

  const [eliminada] = tareas.splice(posicion, 1);

  return res.json({
    message: "Tarea eliminada correctamente.",
    tarea: serializarTarea(eliminada),
  });
});

app.listen(port, () => {
  console.log(`API de tareas escuchando en http://localhost:${port}`);
});
