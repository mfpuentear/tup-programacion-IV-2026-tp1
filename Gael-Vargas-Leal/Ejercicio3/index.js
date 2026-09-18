import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno con datos iniciales de prueba
let tareas = [
  { id: 1, nombre: "Ir al gimnasio", completada: true },
  { id: 2, nombre: "Sacar a pasear al perro", completada: false }
];

let proximoId = 3;

// Helper para validar datos de entrada
function validarDatosTarea(nombre, completada) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { valido: false, error: "El nombre de la tarea es obligatorio y debe ser un texto valido." };
  }

  if (completada !== undefined && typeof completada !== 'boolean') {
    return { valido: false, error: "El campo 'completada' debe ser un valor booleano (true o false)." };
  }

  return { valido: true };
}

// 1. OBTENER TAREAS (Soporta filtrado mediante ?completada=true|false)
app.get('/api/tareas', (req, res) => {
  const { completada } = req.query;

  if (completada !== undefined) {
    if (completada !== 'true' && completada !== 'false') {
      return res.status(400).json({ error: "El parametro 'completada' debe ser 'true' o 'false'." });
    }

    const estadoFiltro = completada === 'true';
    const filtradas = tareas.filter(t => t.completada === estadoFiltro);
    return res.status(200).json({ datos: filtradas });
  }

  res.status(200).json({ datos: tareas });
});

// 2. OBTENER UNA TAREA POR ID
app.get('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  res.status(200).json({ datos: tarea });
});

// 3. CREAR NUEVA TAREA
app.post('/api/tareas', (req, res) => {
  const { nombre, completada = false } = req.body;

  const validacion = validarDatosTarea(nombre, completada);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const existeNombre = tareas.some(
    t => t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (existeNombre) {
    return res.status(400).json({ error: "Ya existe una tarea con ese nombre." });
  }

  const nuevaTarea = {
    id: proximoId++,
    nombre: nombre.trim(),
    completada
  };

  tareas.push(nuevaTarea);
  res.status(201).json({ mensaje: "Tarea creada con exito.", datos: nuevaTarea });
});

// 4. MODIFICAR TAREA
app.put('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nombre, completada } = req.body;

  const tarea = tareas.find(t => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  const validacion = validarDatosTarea(nombre, completada);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const duplicado = tareas.some(
    t => t.id !== id && t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (duplicado) {
    return res.status(400).json({ error: "Ya existe otra tarea con ese nombre." });
  }

  tarea.nombre = nombre.trim();
  if (completada !== undefined) {
    tarea.completada = completada;
  }

  res.status(200).json({ mensaje: "Tarea actualizada con exito.", datos: tarea });
});

// 5. ELIMINAR TAREA
app.delete('/api/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  tareas.splice(index, 1);
  res.status(200).json({ mensaje: "Tarea eliminada correctamente." });
});

app.listen(PORT, () => {
  console.log(`Servidor Ejercicio 3 corriendo en http://localhost:${PORT}`);
});