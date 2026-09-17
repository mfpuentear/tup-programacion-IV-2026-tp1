const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Arreglo interno en memoria para conservar las tareas
let tareas = [];

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API de administración de tareas. Endpoints disponibles bajo /tareas');
});

// 1. GET /tareas - Listar tareas con soporte para filtrado (completadas vs pendientes)
app.get('/tareas', (req, res) => {
  const { completada, estado } = req.query;

  // Filtrado principal por query parameter booleano: ?completada=true o ?completada=false
  if (completada !== undefined) {
    if (completada !== 'true' && completada !== 'false') {
      return res.status(400).json({
        error: 'El parámetro de consulta "completada" debe ser "true" o "false".'
      });
    }
    const filtro = (completada === 'true');
    return res.json(tareas.filter(t => t.completada === filtro));
  }

  // Soporte alternativo intuitivo: ?estado=completada o ?estado=pendiente
  if (estado !== undefined) {
    const estadoLimpio = estado.toLowerCase().trim();
    if (estadoLimpio === 'completada' || estadoLimpio === 'completadas') {
      return res.json(tareas.filter(t => t.completada === true));
    } else if (estadoLimpio === 'pendiente' || estadoLimpio === 'pendientes') {
      return res.json(tareas.filter(t => t.completada === false));
    } else {
      return res.status(400).json({
        error: 'El parámetro "estado" debe ser "completada" o "pendiente".'
      });
    }
  }

  // Sin filtros: retorna todas las tareas registradas
  return res.json(tareas);
});

// 2. GET /tareas/:nombre - Consultar una tarea puntual por su nombre
app.get('/tareas/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreBuscado);

  if (!tarea) {
    return res.status(404).json({
      error: `No se encontró ninguna tarea con el nombre "${req.params.nombre}".`
    });
  }

  return res.json(tarea);
});

// 3. POST /tareas - Crear una nueva tarea
app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  // Validación de nombre obligatorio
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      error: 'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.'
    });
  }

  const nombreLimpio = nombre.trim();

  // Validación de unicidad de nombre (no sensible a mayúsculas/minúsculas)
  const existe = tareas.some(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase());
  if (existe) {
    return res.status(409).json({
      error: `Ya existe una tarea registrada con el nombre "${nombreLimpio}".`
    });
  }

  // Validación del estado (si no se envía, por defecto se inicializa en false / pendiente)
  let estadoCompletada = false;
  if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
      return res.status(400).json({
        error: 'El campo "completada" debe ser un valor booleano (true o false).'
      });
    }
    estadoCompletada = completada;
  }

  const nuevaTarea = {
    nombre: nombreLimpio,
    completada: estadoCompletada
  };

  tareas.push(nuevaTarea);

  return res.status(201).json(nuevaTarea);
});

// 4. PUT /tareas/:nombre - Actualizar completamente una tarea (nombre y/o estado)
app.put('/tareas/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreBuscado);

  if (!tarea) {
    return res.status(404).json({
      error: `No se encontró ninguna tarea con el nombre "${req.params.nombre}".`
    });
  }

  const { nombre: nuevoNombre, completada } = req.body;

  // Validar y actualizar nombre si se envía
  if (nuevoNombre !== undefined) {
    if (typeof nuevoNombre !== 'string' || nuevoNombre.trim() === '') {
      return res.status(400).json({
        error: 'El nuevo "nombre" debe ser una cadena de texto no vacía.'
      });
    }

    const nuevoNombreLimpio = nuevoNombre.trim();
    if (nuevoNombreLimpio.toLowerCase() !== tarea.nombre.toLowerCase()) {
      const duplicada = tareas.some(t => t.nombre.toLowerCase() === nuevoNombreLimpio.toLowerCase());
      if (duplicada) {
        return res.status(409).json({
          error: `Ya existe otra tarea con el nombre "${nuevoNombreLimpio}".`
        });
      }
      tarea.nombre = nuevoNombreLimpio;
    }
  }

  // Validar y actualizar estado si se envía
  if (completada !== undefined) {
    if (typeof completada !== 'boolean') {
      return res.status(400).json({
        error: 'El campo "completada" debe ser un valor booleano (true o false).'
      });
    }
    tarea.completada = completada;
  } else if (nuevoNombre === undefined) {
    return res.status(400).json({
      error: 'Debe enviar al menos el campo "nombre" o "completada" para actualizar la tarea.'
    });
  }

  return res.json(tarea);
});

// 5. PATCH /tareas/:nombre - Modificación puntual del estado de completitud
app.patch('/tareas/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreBuscado);

  if (!tarea) {
    return res.status(404).json({
      error: `No se encontró ninguna tarea con el nombre "${req.params.nombre}".`
    });
  }

  const { completada } = req.body;
  if (typeof completada !== 'boolean') {
    return res.status(400).json({
      error: 'El campo "completada" es obligatorio y debe ser un valor booleano (true o false).'
    });
  }

  tarea.completada = completada;
  return res.json(tarea);
});

// 6. DELETE /tareas/:nombre - Eliminar una tarea del arreglo
app.delete('/tareas/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const indice = tareas.findIndex(t => t.nombre.toLowerCase() === nombreBuscado);

  if (indice === -1) {
    return res.status(404).json({
      error: `No se encontró ninguna tarea con el nombre "${req.params.nombre}".`
    });
  }

  const tareaEliminada = tareas.splice(indice, 1)[0];
  return res.json({
    mensaje: `Tarea "${tareaEliminada.nombre}" eliminada correctamente.`
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor del Ejercicio 3 escuchando en el puerto ${PORT}`);
});
