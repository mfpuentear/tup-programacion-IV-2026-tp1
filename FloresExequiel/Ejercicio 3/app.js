import express from "express";

const app = express();
const PORT = 3002;

app.use(express.json());

// ---------- Constantes ----------
const LONGITUD_MAX_NOMBRE = 100;

// ---------- Almacenamiento interno ----------
let tareas = [
  { id: 1, nombre: "Estudiar Express", completada: true },
  { id: 2, nombre: "Hacer el TP", completada: false },
  { id: 3, nombre: "Preparar la presentación", completada: false },
];
let siguienteId = 4;

// ---------- Validaciones ----------
function validarId(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id) || Number(id) === 0) {
    return res
      .status(400)
      .json({ errores: ["El id debe ser un entero positivo"] });
  }
  req.tareaId = Number(id);
  next();
}

// modo: "crear" | "reemplazar" | "parcial"
function validarTarea(modo) {
  return (req, res, next) => {
    const body = req.body;

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return res
        .status(400)
        .json({ errores: ["El cuerpo debe ser un objeto JSON"] });
    }

    const { nombre, completada } = body;
    const errores = [];
    const datos = {};

    const nombreObligatorio = modo !== "parcial";
    const completadaObligatoria = modo === "reemplazar";

    if (nombre === undefined) {
      if (nombreObligatorio) errores.push("'nombre' es obligatorio");
    } else if (typeof nombre !== "string" || nombre.trim() === "") {
      errores.push("'nombre' debe ser un texto no vacío");
    } else if (nombre.trim().length > LONGITUD_MAX_NOMBRE) {
      errores.push(
        `'nombre' no puede superar los ${LONGITUD_MAX_NOMBRE} caracteres`,
      );
    } else {
      datos.nombre = nombre.trim();
    }

    if (completada === undefined) {
      if (completadaObligatoria) errores.push("'completada' es obligatorio");
    } else if (typeof completada !== "boolean") {
      errores.push("'completada' debe ser true o false");
    } else {
      datos.completada = completada;
    }

    if (
      modo === "parcial" &&
      nombre === undefined &&
      completada === undefined
    ) {
      errores.push("Debe enviarse al menos 'nombre' o 'completada'");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    if (modo === "crear" && datos.completada === undefined) {
      datos.completada = false;
    }

    req.datos = datos;
    next();
  };
}

const existeNombre = (nombre, idExcluido = null) =>
  tareas.some(
    (t) =>
      t.id !== idExcluido && t.nombre.toLowerCase() === nombre.toLowerCase(),
  );

const buscarTarea = (id) => tareas.find((t) => t.id === id);

// ---------- Rutas ----------
const router = express.Router();

// Listar tareas (filtro opcional: ?completada=true | ?completada=false)
router.get("/", (req, res) => {
  const { completada } = req.query;

  if (
    completada !== undefined &&
    completada !== "true" &&
    completada !== "false"
  ) {
    return res.status(400).json({
      errores: ["'completada' debe ser 'true' o 'false'"],
    });
  }

  if (completada === undefined) {
    return res.json(tareas);
  }

  const buscadas = completada === "true";
  res.json(tareas.filter((t) => t.completada === buscadas));
});

// Consultar una tarea
router.get("/:id", validarId, (req, res) => {
  const tarea = buscarTarea(req.tareaId);
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json(tarea);
});

// Crear tarea
router.post("/", validarTarea("crear"), (req, res) => {
  const { nombre, completada } = req.datos;

  if (existeNombre(nombre)) {
    return res
      .status(409)
      .json({ error: `Ya existe una tarea con el nombre '${nombre}'` });
  }

  const nueva = { id: siguienteId++, nombre, completada };
  tareas.push(nueva);

  res.status(201).location(`/tareas/${nueva.id}`).json(nueva);
});

// Reemplazar tarea (nombre y completada obligatorios)
router.put("/:id", validarId, validarTarea("reemplazar"), (req, res) => {
  const tarea = buscarTarea(req.tareaId);
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  if (existeNombre(req.datos.nombre, tarea.id)) {
    return res
      .status(409)
      .json({
        error: `Ya existe una tarea con el nombre '${req.datos.nombre}'`,
      });
  }

  tarea.nombre = req.datos.nombre;
  tarea.completada = req.datos.completada;

  res.json(tarea);
});

// Modificar parcialmente (por ejemplo, marcar como completada)
router.patch("/:id", validarId, validarTarea("parcial"), (req, res) => {
  const tarea = buscarTarea(req.tareaId);
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  if (
    req.datos.nombre !== undefined &&
    existeNombre(req.datos.nombre, tarea.id)
  ) {
    return res
      .status(409)
      .json({
        error: `Ya existe una tarea con el nombre '${req.datos.nombre}'`,
      });
  }

  Object.assign(tarea, req.datos);

  res.json(tarea);
});

// Eliminar tarea
router.delete("/:id", validarId, (req, res) => {
  const indice = tareas.findIndex((t) => t.id === req.tareaId);
  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  tareas.splice(indice, 1);
  res.status(204).send();
});

app.use("/tareas", router);

// ---------- 404 y errores ----------
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ errores: ["El cuerpo de la petición no es un JSON válido"] });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`Ejercicio 3 en http://localhost:${PORT}`));
