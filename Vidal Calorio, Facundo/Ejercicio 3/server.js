const express = require("express");

const app = express();
const PORT = 3003;

// Permite recibir información en formato JSON.
app.use(express.json());

/*
 * Arreglo interno donde se almacenan las tareas.
 *
 * Cada tarea posee:
 * - nombre
 * - completada
 *
 * El estado se representa mediante un booleano:
 * true  -> tarea completada
 * false -> tarea pendiente
 */
const tareas = [];

/*
 * Busca una tarea por su nombre.
 */
function buscarTarea(nombre) {
  return tareas.find((tarea) => tarea.nombre === nombre);
}

/*
 * Valida los datos necesarios para crear una tarea.
 *
 * Devuelve:
 * - null si los datos son válidos.
 * - un mensaje de error si existe algún problema.
 */
function validarTarea(nombre, completada) {
  // Validar nombre.
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return "El nombre es obligatorio y debe ser un texto no vacío";
  }

  // Validar que el estado sea booleano.
  if (typeof completada !== "boolean") {
    return "El campo completada debe ser true o false";
  }

  return null;
}

/*
 * GET /tareas
 *
 * Obtiene todas las tareas.
 *
 * También permite filtrar mediante:
 *
 * GET /tareas?completada=true
 *
 * o:
 *
 * GET /tareas?completada=false
 */
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  /*
   * Si se recibe el parámetro "completada",
   * solamente aceptamos los valores "true" y "false".
   */
  if (
    completada !== undefined &&
    completada !== "true" &&
    completada !== "false"
  ) {
    return res.status(400).json({
      error: "El parámetro completada debe ser true o false"
    });
  }

  let resultado = tareas;

  /*
   * Si se especificó un filtro, convertimos el texto
   * recibido en un valor booleano.
   */
  if (completada !== undefined) {
    const estado = completada === "true";

    resultado = tareas.filter(
      (tarea) => tarea.completada === estado
    );
  }

  return res.status(200).json(resultado);
});

/*
 * GET /tareas/:nombre
 *
 * Obtiene una tarea específica por su nombre.
 */
app.get("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const tarea = buscarTarea(nombre);

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada"
    });
  }

  return res.status(200).json(tarea);
});

/*
 * POST /tareas
 *
 * Crea una nueva tarea.
 *
 * Body esperado:
 *
 * {
 *   "nombre": "Estudiar Express",
 *   "completada": false
 * }
 */
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  // Validar datos.
  const error = validarTarea(nombre, completada);

  if (error) {
    return res.status(400).json({
      error
    });
  }

  /*
   * No pueden existir tareas con el mismo nombre.
   */
  if (buscarTarea(nombre.trim())) {
    return res.status(409).json({
      error: "Ya existe una tarea con ese nombre"
    });
  }

  // Crear nueva tarea.
  const nuevaTarea = {
    nombre: nombre.trim(),
    completada
  };

  tareas.push(nuevaTarea);

  return res.status(201).json(nuevaTarea);
});

/*
 * PUT /tareas/:nombre
 *
 * Modifica una tarea existente.
 *
 * Permite modificar:
 * - nombre
 * - completada
 *
 * Body esperado:
 *
 * {
 *   "nombre": "Estudiar ExpressJS",
 *   "completada": true
 * }
 */
app.put("/tareas/:nombre", (req, res) => {
  const nombreActual = req.params.nombre;
  const { nombre, completada } = req.body;

  // Buscar la tarea.
  const tarea = buscarTarea(nombreActual);

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada"
    });
  }

  /*
   * Si se envía un nuevo nombre,
   * debemos validar que sea correcto.
   */
  let nuevoNombre = tarea.nombre;

  if (nombre !== undefined) {
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({
        error: "El nombre debe ser un texto no vacío"
      });
    }

    const nombreLimpio = nombre.trim();

    /*
     * Comprobar que el nuevo nombre no pertenezca
     * a otra tarea.
     */
    const tareaConMismoNombre = tareas.find(
      (otraTarea) =>
        otraTarea !== tarea &&
        otraTarea.nombre === nombreLimpio
    );

    if (tareaConMismoNombre) {
      return res.status(409).json({
        error: "Ya existe otra tarea con ese nombre"
      });
    }

    nuevoNombre = nombreLimpio;
  }

  /*
   * Si se envía el estado, debe ser booleano.
   */
  let nuevoEstado = tarea.completada;

  if (completada !== undefined) {
    if (typeof completada !== "boolean") {
      return res.status(400).json({
        error: "El campo completada debe ser true o false"
      });
    }

    nuevoEstado = completada;
  }

  // Actualizar la tarea.
  tarea.nombre = nuevoNombre;
  tarea.completada = nuevoEstado;

  return res.status(200).json(tarea);
});

/*
 * DELETE /tareas/:nombre
 *
 * Elimina una tarea por su nombre.
 */
app.delete("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const indice = tareas.findIndex(
    (tarea) => tarea.nombre === nombre
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Tarea no encontrada"
    });
  }

  tareas.splice(indice, 1);

  return res.status(204).send();
});

/*
 * Ruta para endpoints que no existen.
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Recurso no encontrado"
  });
});

/*
 * Iniciar servidor.
 */
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});