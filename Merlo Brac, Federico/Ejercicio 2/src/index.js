import express from 'express';

export const app = express();
app.use(express.json());

// ==========================================
// ARREGLO INTERNO CON DATOS INICIALES
// ==========================================
// El arreglo interno almacena ÚNICAMENTE los datos elementales (id, nombre, notas).
// El promedio y la condición académica NUNCA se guardan aquí, son datos derivados calculados en tiempo de ejecución.
let proximoId = 1;
const alumnos = [
  { id: proximoId++, nombre: 'Juan Pérez', notas: [8, 9, 8] },       // Promedio: 8.33 -> Promocionado
  { id: proximoId++, nombre: 'María González', notas: [7, 6, 7] },   // Promedio: 6.67 -> Aprobado
  { id: proximoId++, nombre: 'Carlos Rodríguez', notas: [4, 5, 4] }  // Promedio: 4.33 -> Reprobado
];

// Funciones auxiliares para calcular datos derivados
function calcularPromedio(notas) {
  if (!notas || notas.length === 0) return 0;
  const suma = notas.reduce((acc, n) => acc + Number(n), 0);
  return Number((suma / notas.length).toFixed(2));
}

function calcularCondicion(promedio) {
  if (promedio >= 8) return 'promocionado';
  if (promedio >= 6) return 'aprobado';
  return 'reprobado';
}

function enriquecerAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  const condicion = calcularCondicion(promedio);
  return {
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion
  };
}

// Función para validar unicidad de nombre (insensible a mayúsculas/minúsculas)
function existeAlumnoConNombre(nombre, excluirId = null) {
  const norm = nombre.trim().toLowerCase();
  return alumnos.some((a) => a.nombre.toLowerCase() === norm && (excluirId === null || a.id !== excluirId));
}

// Función para validar que las notas sean exactamente 3 números entre 1 y 10
function validarNotas(notas) {
  if (!Array.isArray(notas) || notas.length !== 3) {
    return 'Las notas deben ser un arreglo de exactamente 3 elementos.';
  }
  for (const n of notas) {
    const num = Number(n);
    if (isNaN(num) || num < 1 || num > 10) {
      return 'Cada calificación debe ser un número válido entre 1 y 10.';
    }
  }
  return null;
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
        <title>Ejercicio 2 - Alumnos y Calificaciones</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; line-height: 1.6; background: #f8fafc; color: #1e293b; max-width: 800px; margin: 0 auto; }
          h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px; }
          ul { list-style: none; padding: 0; }
          li { margin: 12px 0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 16px; }
          a:hover { text-decoration: underline; color: #1d4ed8; }
          .desc { color: #64748b; font-size: 14px; margin-left: 8px; }
          .badge { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Ejercicio 2: Gestión de Alumnos <span class="badge">Puerto 3002</span></h1>
        <p><strong>Autor:</strong> Federico Merlo Brac | <strong>Estado:</strong> Activo</p>
        <div class="card">
          <h3>Enlaces para probar en el navegador:</h3>
          <ul>
            <li><a href="/alumnos">/alumnos</a> <span class="desc">&rarr; Ver todos los alumnos con promedio y condición</span></li>
            <li><a href="/alumnos/1/notas">/alumnos/1/notas</a> <span class="desc">&rarr; Consultar notas y condición de Juan Pérez (Promocionado)</span></li>
            <li><a href="/alumnos/2/notas">/alumnos/2/notas</a> <span class="desc">&rarr; Consultar notas y condición de María González (Aprobado)</span></li>
            <li><a href="/alumnos/3/notas">/alumnos/3/notas</a> <span class="desc">&rarr; Consultar notas y condición de Carlos Rodríguez (Reprobado)</span></li>
            <li><a href="/alumnos?condicion=promocionado">/alumnos?condicion=promocionado</a> <span class="desc">&rarr; Filtrar alumnos promocionados</span></li>
            <li><a href="/alumnos?condicion=aprobado">/alumnos?condicion=aprobado</a> <span class="desc">&rarr; Filtrar alumnos aprobados</span></li>
            <li><a href="/alumnos?condicion=reprobado">/alumnos?condicion=reprobado</a> <span class="desc">&rarr; Filtrar alumnos reprobados</span></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    mensaje: 'API de Gestión Académica de Alumnos - Ejercicio 2 (TP1)',
    autor: 'Federico Merlo Brac',
    consigna: 'Gestión de alumnos y calificaciones con cálculo dinámico de promedio y condición académica.',
    recursos: {
      todos: '/alumnos',
      promocionados: '/alumnos?condicion=promocionado',
      aprobados: '/alumnos?condicion=aprobado',
      reprobados: '/alumnos?condicion=reprobado',
      porId: '/alumnos/1',
      consultaNotas: '/alumnos/1/notas'
    },
    totalAlumnosPrecargados: alumnos.length
  });
});

// GET /alumnos: Listar todos los alumnos con promedio y condición calculados dinámicamente
app.get('/alumnos', (req, res) => {
  const { condicion, nombre } = req.query;

  let resultado = alumnos.map(enriquecerAlumno);

  if (condicion) {
    const condNorm = condicion.trim().toLowerCase();
    resultado = resultado.filter((a) => a.condicion === condNorm);
  }

  if (nombre) {
    const term = nombre.trim().toLowerCase();
    resultado = resultado.filter((a) => a.nombre.toLowerCase().includes(term));
  }

  res.json(resultado);
});

// GET /alumnos/:id/notas: Requisito de la consigna para consultar notas, promedio y condición
app.get('/alumnos/:id/notas', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const enr = enriquecerAlumno(alumno);
  res.json({
    id: enr.id,
    nombre: enr.nombre,
    notas: enr.notas,
    promedio: enr.promedio,
    condicion: enr.condicion
  });
});

// GET /alumnos/:id: Obtener alumno por ID
app.get('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  res.json(enriquecerAlumno(alumno));
});

// POST /alumnos: Registrar un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre del alumno es obligatorio y debe ser texto no vacío.' });
  }

  const errorNotas = validarNotas(notas);
  if (errorNotas) {
    return res.status(400).json({ error: errorNotas });
  }

  // Verificación de nombre único (HTTP 409 Conflict)
  if (existeAlumnoConNombre(nombre)) {
    return res.status(409).json({ error: `Ya existe un alumno registrado con el nombre "${nombre.trim()}".` });
  }

  const nuevoAlumno = {
    id: proximoId++,
    nombre: nombre.trim(),
    notas: notas.map(Number)
  };

  alumnos.push(nuevoAlumno);
  res.status(201).json(enriquecerAlumno(nuevoAlumno));
});

// PUT /alumnos/:id: Modificar alumno existente
app.put('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const { nombre, notas } = req.body;

  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    }
    if (existeAlumnoConNombre(nombre, id)) {
      return res.status(409).json({ error: `Ya existe otro alumno registrado con el nombre "${nombre.trim()}".` });
    }
    alumno.nombre = nombre.trim();
  }

  if (notas !== undefined) {
    const errorNotas = validarNotas(notas);
    if (errorNotas) {
      return res.status(400).json({ error: errorNotas });
    }
    alumno.notas = notas.map(Number);
  }

  res.json(enriquecerAlumno(alumno));
});

// DELETE /alumnos/:id: Eliminar alumno
app.delete('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const index = alumnos.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
  }

  const [eliminado] = alumnos.splice(index, 1);
  res.json({
    mensaje: 'Alumno eliminado correctamente.',
    alumno: enriquecerAlumno(eliminado)
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

// Inicio del servidor en puerto 3002 por defecto (o process.env.PORT si se especifica)
const PORT = process.env.PORT || 3002;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  const server = app.listen(PORT, () => {
    console.log(`\n===============================================================`);
    console.log(`  Ejercicio 2 iniciado en: http://localhost:${PORT}`);
    console.log(`  Abre en tu navegador:    http://localhost:${PORT}`);
    console.log(`  Ver todos los alumnos:   http://localhost:${PORT}/alumnos`);
    console.log(`  Ver notas alumno 1:      http://localhost:${PORT}/alumnos/1/notas`);
    console.log(`===============================================================\n`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n [AVISO] El puerto ${PORT} está ocupado. Cerrá el proceso anterior con Ctrl+C.\n`);
    }
  });
}
