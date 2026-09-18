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

// Ruta raíz: si se abre en navegador responde HTML con enlaces; si es petición API devuelve JSON
app.get('/', (req, res) => {
  const esNavegador = req.headers.accept && req.headers.accept.includes('text/html') && !req.headers.accept.includes('application/json');
  if (esNavegador) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Ejercicio 3 - Administración de Tareas</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; line-height: 1.6; background: #f8fafc; color: #1e293b; max-width: 800px; margin: 0 auto; }
          h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px; }
          ul { list-style: none; padding: 0; }
          li { margin: 12px 0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 16px; }
          a:hover { text-decoration: underline; color: #1d4ed8; }
          .desc { color: #64748b; font-size: 14px; margin-left: 8px; }
          .badge { background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Ejercicio 3: Administración de Tareas <span class="badge">Puerto 3003</span></h1>
        <p><strong>Autor:</strong> Federico Merlo Brac | <strong>Estado:</strong> Activo</p>
        <div class="card">
          <h3>Enlaces para probar en el navegador:</h3>
          <ul>
            <li><a href="/tareas">/tareas</a> <span class="desc">&rarr; Ver todas las tareas precargadas</span></li>
            <li><a href="/tareas?completada=true">/tareas?completada=true</a> <span class="desc">&rarr; Filtrar solo tareas completadas</span></li>
            <li><a href="/tareas?completada=false">/tareas?completada=false</a> <span class="desc">&rarr; Filtrar solo tareas pendientes</span></li>
            <li><a href="/tareas?estado=completada">/tareas?estado=completada</a> <span class="desc">&rarr; Filtrar por estado semántico</span></li>
            <li><a href="/tareas/1">/tareas/1</a> <span class="desc">&rarr; Ver detalle de tarea ID 1</span></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }

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

  const index = tareas.findIndex((r) => r.id === id);
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

// Inicio del servidor en puerto 3003 por defecto (o process.env.PORT si se especifica)
const PORT = process.env.PORT || 3003;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  const server = app.listen(PORT, () => {
    console.log(`\n===============================================================`);
    console.log(`  Ejercicio 3 iniciado en: http://localhost:${PORT}`);
    console.log(`  Abre en tu navegador:    http://localhost:${PORT}`);
    console.log(`  Ver todas las tareas:    http://localhost:${PORT}/tareas`);
    console.log(`===============================================================\n`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n [AVISO] El puerto ${PORT} está ocupado. Cerrá el proceso anterior con Ctrl+C.\n`);
    }
  });
}
