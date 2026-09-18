import express from 'express';

export const app = express();
app.use(express.json());

// ==========================================
// ARREGLO INTERNO CON DATOS INICIALES
// ==========================================
// El arreglo interno almacena id, nombre y el estado de completada de cada tarea.
let proximoId = 1;
const tareas = [
  { id: proximoId++, nombre: 'Instalar dependencias de Node.js', completada: true },
  { id: proximoId++, nombre: 'Diseñar endpoints de la API', completada: true },
  { id: proximoId++, nombre: 'Implementar validaciones de entrada', completada: false },
  { id: proximoId++, nombre: 'Probar endpoints en archivo .http', completada: false }
];

// Función para verificar unicidad de nombres (insensible a mayúsculas/minúsculas)
function existeTareaConNombre(nombre, excluirId = null) {
  const norm = nombre.trim().toLowerCase();
  return tareas.some((t) => t.nombre.toLowerCase() === norm && (excluirId === null || t.id !== excluirId));
}

// Función auxiliar para formatear la respuesta de la tarea con un estado legible
function formatearTarea(tarea) {
  return {
    id: tarea.id,
    nombre: tarea.nombre,
    completada: Boolean(tarea.completada),
    estado: tarea.completada ? 'completada' : 'pendiente'
  };
}

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Administración de Tareas - Ejercicio 3 (TP1)',
    autor: 'Federico Merlo Brac',
    consigna: 'Gestión de tareas y diferenciación de tareas completadas y pendientes.',
    recursos: {
      todas: '/tareas',
      completadas: '/tareas?completada=true',
      pendientes: '/tareas?completada=false',
      filtroEstado: '/tareas?estado=completada | pendiente',
      porId: '/tareas/1'
    },
    totalTareasPrecargadas: tareas.length
  });
});

// GET /tareas: Listar tareas con soporte para diferenciar completadas y pendientes
app.get('/tareas', (req, res) => {
  const { completada, estado, nombre } = req.query;

  let resultado = tareas.map(formatearTarea);

  // Filtro canónico por booleano (?completada=true / false)
  if (completada !== undefined) {
    const esCompletada = completada === 'true' || completada === '1';
    resultado = resultado.filter((t) => t.completada === esCompletada);
  }

  // Filtro semántico por estado (?estado=completada / pendiente)
  if (estado !== undefined) {
    const estNorm = estado.trim().toLowerCase();
    if (estNorm === 'completada' || estNorm === 'completadas') {
      resultado = resultado.filter((t) => t.completada === true);
    } else if (estNorm === 'pendiente' || estNorm === 'pendientes') {
      resultado = resultado.filter((t) => t.completada === false);
    }
  }

  // Filtro opcional por búsqueda de nombre
  if (nombre) {
    const term = nombre.trim().toLowerCase();
    resultado = resultado.filter((t) => t.nombre.toLowerCase().includes(term));
  }

  res.json(resultado);
});

// GET /tareas/:id: Obtener tarea por ID
app.get('/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  res.json(formatearTarea(tarea));
});

// POST /tareas: Crear una nueva tarea
app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre de la tarea es obligatorio y debe ser texto no vacío.' });
  }

  // Verificación de nombre único (HTTP 409 Conflict)
  if (existeTareaConNombre(nombre)) {
    return res.status(409).json({ error: `Ya existe una tarea con el nombre "${nombre.trim()}".` });
  }

  const nuevaTarea = {
    id: proximoId++,
    nombre: nombre.trim(),
    completada: completada !== undefined ? Boolean(completada) : false
  };

  tareas.push(nuevaTarea);
  res.status(201).json(formatearTarea(nuevaTarea));
});

// PUT /tareas/:id: Modificar una tarea existente
app.put('/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const { nombre, completada } = req.body;

  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre no puede ser una cadena vacía.' });
    }
    if (existeTareaConNombre(nombre, id)) {
      return res.status(409).json({ error: `Ya existe otra tarea con el nombre "${nombre.trim()}".` });
    }
    tarea.nombre = nombre.trim();
  }

  if (completada !== undefined) {
    tarea.completada = Boolean(completada);
  }

  res.json(formatearTarea(tarea));
});

// PATCH /tareas/:id/completar: Marcar rápidamente como completada
app.patch('/tareas/:id/completar', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  tarea.completada = true;
  res.json(formatearTarea(tarea));
});

// DELETE /tareas/:id: Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const index = tareas.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  const [eliminada] = tareas.splice(index, 1);
  res.json({
    mensaje: 'Tarea eliminada correctamente.',
    tarea: formatearTarea(eliminada)
  });
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `No existe la ruta ${req.method} ${req.originalUrl}`
  });
});

// Manejo de errores de formato JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición.' });
  }
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Inicio del servidor (solo si se ejecuta directamente este archivo)
const PORT = process.env.PORT || 3000;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`\n Servidor de Ejercicio 3 iniciado en: http://localhost:${PORT}`);
    console.log(` Consulta todas las tareas en: http://localhost:${PORT}/tareas`);
    console.log(` Consulta tareas completadas en: http://localhost:${PORT}/tareas?completada=true`);
    console.log(` Consulta tareas pendientes en: http://localhost:${PORT}/tareas?completada=false\n`);
  });
}
