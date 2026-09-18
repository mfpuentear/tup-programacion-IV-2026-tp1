import express from 'express';
const app = express();
const PORT = 3000;

app.use(express.json());

/** Arreglo interno: solo nombre y si está completada. */
const tareas = [];
let siguienteId = 1;

function normalizarNombre(nombre) {
  return typeof nombre === "string" ? nombre.trim() : "";
}

function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function existeNombre(nombre, { idActual = null } = {}) {
  return tareas.some(
    (t) =>
      t.id !== idActual &&
      t.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

function validarDatos(body, { idActual = null, parcial = false } = {}) {
  if (!parcial || body?.nombre !== undefined) {
    const nombre = normalizarNombre(body?.nombre);
    if (!nombre) {
      return "nombre es obligatorio y no puede estar vacío";
    }
    if (existeNombre(nombre, { idActual })) {
      return "ya existe una tarea con ese nombre";
    }
  }

  if (!parcial || body?.completada !== undefined) {
    if (typeof body?.completada !== "boolean") {
      return "completada debe ser un booleano (true o false)";
    }
  }

  return null;
}

function parseFiltroCompletada(queryValue) {
  if (queryValue === undefined) return { ok: true, valor: null };

  if (queryValue === "true") return { ok: true, valor: true };
  if (queryValue === "false") return { ok: true, valor: false };

  return {
    ok: false,
    error: "query completada debe ser true o false",
  };
}

// Listar (opcional: ?completada=true | ?completada=false)
app.get("/tareas", (req, res) => {
  const filtro = parseFiltroCompletada(req.query.completada);
  if (!filtro.ok) {
    return res.status(400).json({ error: filtro.error });
  }

  let resultado = tareas;
  if (filtro.valor !== null) {
    resultado = tareas.filter((t) => t.completada === filtro.valor);
  }

  res.json(resultado);
});

// Obtener una por id
app.get("/tareas/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: "tarea no encontrada" });
  }

  res.json(tarea);
});

// Crear
app.post("/tareas", (req, res) => {
  const body = {
    nombre: req.body?.nombre,
    completada:
      req.body?.completada === undefined ? false : req.body.completada,
  };

  const error = validarDatos(body);
  if (error) {
    const status = error.includes("ya existe") ? 409 : 400;
    return res.status(status).json({ error });
  }

  const nueva = {
    id: siguienteId++,
    nombre: normalizarNombre(body.nombre),
    completada: body.completada,
  };

  tareas.push(nueva);
  res.status(201).json(nueva);
});

// Reemplazar
app.put("/tareas/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const indice = tareas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "tarea no encontrada" });
  }

  const error = validarDatos(req.body, { idActual: id });
  if (error) {
    const status = error.includes("ya existe") ? 409 : 400;
    return res.status(status).json({ error });
  }

  tareas[indice] = {
    id,
    nombre: normalizarNombre(req.body.nombre),
    completada: req.body.completada,
  };

  res.json(tareas[indice]);
});

// Actualizar parcialmente (útil para marcar completada)
app.patch("/tareas/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const indice = tareas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "tarea no encontrada" });
  }

  if (req.body?.nombre === undefined && req.body?.completada === undefined) {
    return res
      .status(400)
      .json({ error: "debe enviar nombre y/o completada para actualizar" });
  }

  const error = validarDatos(req.body, { idActual: id, parcial: true });
  if (error) {
    const status = error.includes("ya existe") ? 409 : 400;
    return res.status(status).json({ error });
  }

  if (req.body.nombre !== undefined) {
    tareas[indice].nombre = normalizarNombre(req.body.nombre);
  }
  if (req.body.completada !== undefined) {
    tareas[indice].completada = req.body.completada;
  }

  res.json(tareas[indice]);
});

// Eliminar
app.delete("/tareas/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const indice = tareas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "tarea no encontrada" });
  }

  const eliminada = tareas.splice(indice, 1)[0];
  res.json(eliminada);
});

app.listen(PORT, () => {
    console.log(`API corriendo en: http://localhost:${PORT}`);
});