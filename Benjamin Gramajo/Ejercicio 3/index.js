import express from 'express';

const app = express();
app.use(express.json());

// Almacenamiento en memoria: arreglo de tareas.
// Cada tarea: { nombre: string, completada: boolean }
let tareas = [];

function validarNombre(nombre) {
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.';
  }
  return null;
}

function validarCompletada(completada) {
  if (completada === undefined) {
    return null; // Es opcional al crear; se asume false por defecto.
  }
  if (typeof completada !== 'boolean') {
    return 'El campo "completada" debe ser un valor booleano (true o false).';
  }
  return null;
}

function buscarTareaPorNombre(nombre) {
  return tareas.find(
    (tarea) => tarea.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

// GET /tareas?completada=true|false - listar tareas, con filtro opcional por estado
app.get('/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada === undefined) {
    return res.status(200).json(tareas);
  }

  if (completada !== 'true' && completada !== 'false') {
    return res.status(400).json({
      errores: ['El query param "completada" debe ser "true" o "false".'],
    });
  }

  const filtroBooleano = completada === 'true';
  const tareasFiltradas = tareas.filter(
    (tarea) => tarea.completada === filtroBooleano
  );

  res.status(200).json(tareasFiltradas);
});

// GET /tareas/:nombre - consultar una tarea puntual
app.get('/tareas/:nombre', (req, res) => {
  const tarea = buscarTareaPorNombre(req.params.nombre);

  if (!tarea) {
    return res
      .status(404)
      .json({ error: `No existe una tarea con nombre "${req.params.nombre}".` });
  }

  res.status(200).json(tarea);
});

// POST /tareas - crear una tarea nueva
app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  const errores = [validarNombre(nombre), validarCompletada(completada)].filter(
    Boolean
  );

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  if (buscarTareaPorNombre(nombre)) {
    return res
      .status(409)
      .json({ error: `Ya existe una tarea con nombre "${nombre}".` });
  }

  const nuevaTarea = {
    nombre,
    completada: completada === undefined ? false : completada,
  };
  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

// PUT /tareas/:nombre - modificar nombre y/o estado de una tarea
app.put('/tareas/:nombre', (req, res) => {
  const tarea = buscarTareaPorNombre(req.params.nombre);

  if (!tarea) {
    return res
      .status(404)
      .json({ error: `No existe una tarea con nombre "${req.params.nombre}".` });
  }

  const { nombre, completada } = req.body;

  const errores = [validarNombre(nombre), validarCompletada(completada)].filter(
    Boolean
  );

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  if (nombre.toLowerCase() !== tarea.nombre.toLowerCase()) {
    const colision = buscarTareaPorNombre(nombre);
    if (colision) {
      return res
        .status(409)
        .json({ error: `Ya existe una tarea con nombre "${nombre}".` });
    }
  }

  tarea.nombre = nombre;
  tarea.completada = completada === undefined ? tarea.completada : completada;

  res.status(200).json(tarea);
});

// DELETE /tareas/:nombre - eliminar una tarea
app.delete('/tareas/:nombre', (req, res) => {
  const indice = tareas.findIndex(
    (tarea) => tarea.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ error: `No existe una tarea con nombre "${req.params.nombre}".` });
  }

  tareas.splice(indice, 1);
  res.status(204).send();
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado.' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
