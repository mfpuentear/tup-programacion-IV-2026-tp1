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

// Ruta raíz informativa
app.get('/', (req, res) => {
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

// Inicio del servidor (solo si se ejecuta directamente este archivo)
const PORT = process.env.PORT || 3000;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`\n Servidor de Ejercicio 2 iniciado en: http://localhost:${PORT}`);
    console.log(` Consulta la lista en: http://localhost:${PORT}/alumnos`);
    console.log(` Consulta notas del alumno 1 en: http://localhost:${PORT}/alumnos/1/notas\n`);
  });
}
