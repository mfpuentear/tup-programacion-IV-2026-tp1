const express = require("express");

const app = express();
const PORT = 3003;

app.use(express.json());

/**
 * Arreglo interno solicitado por la consigna.
 *
 * Cada tarea contiene:
 * - nombre
 * - completada
 */
const tareas = [];

/**
 * Normaliza nombres para controlar duplicados.
 */
function normalizarNombre(nombre) {
  return nombre.trim().toLowerCase();
}

/**
 * Valida un nombre.
 */
function validarNombre(nombre) {
  if (nombre === undefined) {
    return "El nombre es obligatorio.";
  }

  if (typeof nombre !== "string") {
    return "El nombre debe ser una cadena de texto.";
  }

  if (nombre.trim() === "") {
    return "El nombre no puede estar vacío.";
  }

  return null;
}

/**
 * Busca una tarea por nombre.
 */
function buscarIndiceTarea(nombre) {
  const nombreNormalizado = normalizarNombre(nombre);

  return tareas.findIndex(
    (tarea) =>
      normalizarNombre(tarea.nombre) ===
      nombreNormalizado
  );
}

/**
 * Valida una tarea.
 *
 * En POST se permite omitir "completada" porque una tarea
 * nueva se considera pendiente por defecto.
 *
 * En PUT se exige el valor porque PUT reemplaza completamente
 * la representación del recurso.
 */
function validarTarea(body, permitirEstadoOmitido = false) {
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      error: "El cuerpo de la petición debe ser un objeto JSON.",
    };
  }

  const errorNombre = validarNombre(body.nombre);

  if (errorNombre) {
    return {
      error: errorNombre,
    };
  }

  let completada = body.completada;

  if (
    completada === undefined &&
    permitirEstadoOmitido
  ) {
    completada = false;
  } else if (typeof completada !== "boolean") {
    return {
      error:
        "El campo 'completada' debe ser un valor booleano.",
    };
  }

  return {
    tarea: {
      nombre: body.nombre.trim(),
      completada,
    },
  };
}

/**
 * Convierte el query param completada.
 *
 * Los query params llegan como strings.
 */
function obtenerFiltroCompletada(valor) {
  if (valor === undefined) {
    return {
      existe: false,
    };
  }

  if (typeof valor !== "string") {
    return {
      error:
        "El filtro 'completada' debe ser 'true' o 'false'.",
    };
  }

  if (valor === "true") {
    return {
      existe: true,
      valor: true,
    };
  }

  if (valor === "false") {
    return {
      existe: true,
      valor: false,
    };
  }

  return {
    error:
      "El filtro 'completada' debe ser 'true' o 'false'.",
  };
}

/**
 * GET /tareas
 *
 * También permite:
 *
 * GET /tareas?completada=true
 * GET /tareas?completada=false
 */
app.get("/tareas", (req, res) => {
  const filtro = obtenerFiltroCompletada(
    req.query.completada
  );

  if (filtro.error) {
    return res.status(400).json({
      error: filtro.error,
    });
  }

  if (!filtro.existe) {
    return res.status(200).json(tareas);
  }

  const resultado = tareas.filter(
    (tarea) => tarea.completada === filtro.valor
  );

  return res.status(200).json(resultado);
});

/**
 * GET /tareas/:nombre
 */
app.get("/tareas/:nombre", (req, res) => {
  const errorNombre = validarNombre(req.params.nombre);

  if (errorNombre) {
    return res.status(400).json({
      error: errorNombre,
    });
  }

  const indice = buscarIndiceTarea(req.params.nombre);

  if (indice === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada.",
    });
  }

  return res.status(200).json(tareas[indice]);
});

/**
 * POST /tareas
 */
app.post("/tareas", (req, res) => {
  const resultadoValidacion = validarTarea(
    req.body,
    true
  );

  if (resultadoValidacion.error) {
    return res.status(400).json({
      error: resultadoValidacion.error,
    });
  }

  const nuevaTarea = resultadoValidacion.tarea;

  if (buscarIndiceTarea(nuevaTarea.nombre) !== -1) {
    return res.status(409).json({
      error: "Ya existe una tarea con ese nombre.",
    });
  }

  tareas.push(nuevaTarea);

  return res.status(201).json(nuevaTarea);
});

/**
 * PUT /tareas/:nombre
 */
app.put("/tareas/:nombre", (req, res) => {
  const errorNombreParametro = validarNombre(
    req.params.nombre
  );

  if (errorNombreParametro) {
    return res.status(400).json({
      error: errorNombreParametro,
    });
  }

  const indiceActual = buscarIndiceTarea(
    req.params.nombre
  );

  if (indiceActual === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada.",
    });
  }

  const resultadoValidacion = validarTarea(
    req.body,
    false
  );

  if (resultadoValidacion.error) {
    return res.status(400).json({
      error: resultadoValidacion.error,
    });
  }

  const tareaModificada =
    resultadoValidacion.tarea;

  const indiceNombreNuevo = buscarIndiceTarea(
    tareaModificada.nombre
  );

  if (
    indiceNombreNuevo !== -1 &&
    indiceNombreNuevo !== indiceActual
  ) {
    return res.status(409).json({
      error: "Ya existe otra tarea con ese nombre.",
    });
  }

  tareas[indiceActual] = tareaModificada;

  return res.status(200).json(
    tareas[indiceActual]
  );
});

/**
 * DELETE /tareas/:nombre
 */
app.delete("/tareas/:nombre", (req, res) => {
  const errorNombre = validarNombre(req.params.nombre);

  if (errorNombre) {
    return res.status(400).json({
      error: errorNombre,
    });
  }

  const indice = buscarIndiceTarea(
    req.params.nombre
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada.",
    });
  }

  tareas.splice(indice, 1);

  return res.status(204).send();
});

/**
 * Ruta inexistente.
 */
app.use((req, res) => {
  return res.status(404).json({
    error: "Recurso no encontrado.",
  });
});

/**
 * Manejo de JSON inválido.
 */
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      error: "El cuerpo JSON no es válido.",
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Error interno del servidor.",
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 3 ejecutándose en http://localhost:${PORT}`);
});