const express = require("express");

const app = express();
const PUERTO = 3002;

app.use(express.json());

// Arreglo interno en memoria: [{ nombre, notas: [n1, n2, n3] }, ...]
let alumnos = [];

// --- Helpers ---------------------------------------------------------

function calcularPromedio(notas) {
  const suma = notas.reduce((acc, n) => acc + n, 0);
  return suma / notas.length;
}

function calcularCondicion(promedio) {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
}

// El promedio y la condición son datos derivados: se calculan acá, nunca
// se guardan en el arreglo interno de alumnos.
function serializarAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion: calcularCondicion(promedio),
  };
}

function notasValidas(notas) {
  return (
    Array.isArray(notas) &&
    notas.length === 3 &&
    notas.every((n) => typeof n === "number" && !Number.isNaN(n) && n >= 0 && n <= 10)
  );
}

function buscarIndicePorNombre(nombre) {
  return alumnos.findIndex(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

// --- Endpoints ---------------------------------------------------------

// POST /alumnos  { nombre, notas: [n1, n2, n3] }
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "El 'nombre' es obligatorio" });
  }
  if (!notasValidas(notas)) {
    return res.status(400).json({
      error: "'notas' debe ser un arreglo de 3 números entre 0 y 10",
    });
  }
  if (buscarIndicePorNombre(nombre) !== -1) {
    return res.status(409).json({ error: "Ya existe un alumno con ese nombre" });
  }

  const alumno = { nombre: nombre.trim(), notas };
  alumnos.push(alumno);
  res.status(201).json(serializarAlumno(alumno));
});

// GET /alumnos
app.get("/alumnos", (req, res) => {
  res.status(200).json(alumnos.map(serializarAlumno));
});

// GET /alumnos/:nombre
app.get("/alumnos/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  res.status(200).json(serializarAlumno(alumnos[indice]));
});

// PUT /alumnos/:nombre  { nombre?, notas }
app.put("/alumnos/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  const { nombre, notas } = req.body;
  const nuevoNombre = nombre !== undefined ? nombre : alumnos[indice].nombre;

  if (typeof nuevoNombre !== "string" || nuevoNombre.trim() === "") {
    return res.status(400).json({ error: "El 'nombre' no puede estar vacío" });
  }
  if (!notasValidas(notas)) {
    return res.status(400).json({
      error: "'notas' debe ser un arreglo de 3 números entre 0 y 10",
    });
  }

  const indiceConEseNombre = buscarIndicePorNombre(nuevoNombre);
  if (indiceConEseNombre !== -1 && indiceConEseNombre !== indice) {
    return res.status(409).json({ error: "Ya existe un alumno con ese nombre" });
  }

  alumnos[indice] = { nombre: nuevoNombre.trim(), notas };
  res.status(200).json(serializarAlumno(alumnos[indice]));
});

// DELETE /alumnos/:nombre
app.delete("/alumnos/:nombre", (req, res) => {
  const indice = buscarIndicePorNombre(req.params.nombre);
  if (indice === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  const [eliminado] = alumnos.splice(indice, 1);
  res.status(200).json(serializarAlumno(eliminado));
});

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

app.listen(PUERTO, () => {
  console.log(`Ejercicio 2 escuchando en http://localhost:${PUERTO}`);
});
