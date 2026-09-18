const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tareas = [
  {
    nombre: "Estudiar Matematica",
    completada: false,
  },
  {
    nombre: "Hacer ejercicio",
    completada: true,
  },
  {
    nombre: "Entregar Practico",
    completada: false,
  },
];

// Funcion de validacion
function validarTarea(nombre, completada) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return "El nombre es obligatorio y debe ser un texto";
  }

  if (typeof completada !== "boolean") {
    return "El estado completada debe ser true o false";
  }

  return null;
}

// GET /tareas
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  // Todas las tareas
  if (completada === undefined) {
    return res.status(200).json(tareas);
  }

  // Validacion
  if (completada !== "true" && completada !== "false") {
    return res.status(400).json({
      error: "El parametro completada debe ser true o false",
    });
  }

  const estado = completada === "true";

  const tareasFiltradas = tareas.filter((tarea) => tarea.completada === estado);

  res.status(200).json(tareasFiltradas);
});

// GET /tareas/:nombre
app.get("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const tarea = tareas.find(
    (tarea) => tarea.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada",
    });
  }

  res.status(200).json(tarea);
});

// POST /tareas
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  const error = validarTarea(nombre, completada);

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  const nombreExiste = tareas.some(
    (tarea) => tarea.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );

  if (nombreExiste) {
    return res.status(409).json({
      error: "Ya existe una tarea con ese nombre",
    });
  }

  const nuevaTarea = {
    nombre: nombre.trim(),
    completada,
  };

  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

// PUT /tareas/:nombre
app.put("/tareas/:nombre", (req, res) => {
  const nombreBuscado = req.params.nombre;
  const { nombre, completada } = req.body;

  const indice = tareas.findIndex(
    (tarea) => tarea.nombre.toLowerCase() === nombreBuscado.toLowerCase(),
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada",
    });
  }

  const error = validarTarea(nombre, completada);

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  const nombreDuplicado = tareas.some(
    (tarea, i) =>
      i !== indice &&
      tarea.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );

  if (nombreDuplicado) {
    return res.status(409).json({
      error: "Ya existe otra tarea con ese nombre",
    });
  }

  tareas[indice] = {
    nombre: nombre.trim(),
    completada,
  };

  res.status(200).json(tareas[indice]);
});

// DELETE /tareas/:nombre
app.delete("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const indice = tareas.findIndex(
    (tarea) => tarea.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada",
    });
  }

  tareas.splice(indice, 1);

  res.status(200).json({
    mensaje: "Tarea eliminada correctamente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
