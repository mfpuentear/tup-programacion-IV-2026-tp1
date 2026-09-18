const express = require("express");
const app = express();
const PORT = 3003;

app.use(express.json());


let tareas = [];

// GET Listar todas las tareas
app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  if (estado !== undefined) {
    if (estado !== "completada" && estado !== "pendiente") {
      return res
        .status(400)
        .json({ error: "El estado de la tarea debe ser 'completada' o 'pendiente'." });
    }
    const filtradas = tareas.filter((t) =>
      estado === "completada" ? t.completada === true : t.completada === false
    );
    return res.status(200).json(filtradas);
  }

  return res.status(200).json(tareas);
});

// GET Obtener una tarea por nombre
app.get("/tareas/:nombre", (req, res) => {
  const tarea = tareas.find(
    (t) => t.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (!tarea) {
    return res.status(404).json({ error: `Tarea '${req.params.nombre}' no encontrada.` });
  }
  return res.status(200).json(tarea);
});

// POST Crear una nueva tarea
app.post("/tareas", (req, res) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre es requerido y debe ser texto." });
  }

  const existe = tareas.find(
    (t) => t.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  if (existe) {
    return res.status(409).json({ error: `Ya existe una tarea con el nombre '${nombre}'` });
  }

  const nuevaTarea = { nombre: nombre.trim(), completada: false };
  tareas.push(nuevaTarea);
  return res.status(201).json({ mensaje: "Tarea creada exitosamente.", tarea: nuevaTarea });
});

// PATCH Marcar como completada o pendiente
app.patch("/tareas/:nombre", (req, res) => {
  const { completada } = req.body;

  if (typeof completada !== "boolean") {
    return res
      .status(400)
      .json({ error: "El campo 'completada' debe ser booleano (true o false)." });
  }

  const tarea = tareas.find(
    (t) => t.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (!tarea) {
    return res.status(404).json({ error: `Tarea '${req.params.nombre}' no encontrada.` });
  }

  tarea.completada = completada;
  return res.status(200).json({ mensaje: "Tarea actualizada", tarea });
});

// DELETE Eliminar una tarea
app.delete("/tareas/:nombre", (req, res) => {
  const indice = tareas.findIndex(
    (t) => t.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (indice === -1) {
    return res.status(404).json({ error: `Tarea '${req.params.nombre}' no encontrada.` });
  }
  const eliminada = tareas.splice(indice, 1)[0];
  return res.status(200).json({ mensaje: `Tarea '${eliminada.nombre}' eliminada exitosamente.` });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
