import express from "express";

const app = express();
app.use(express.json());

let alumnos = [];
let ultimoId = 0;

const esIdValido = (id) => Number.isInteger(id) && id > 0;

// Devuelve un mensaje de error, o null si los datos son válidos
const validarAlumno = ({ nombre, notas } = {}) => {
  if (typeof nombre !== "string" || nombre.trim() === "") return "nombre es obligatorio";
  if (!Array.isArray(notas) || notas.length !== 3) return "notas debe ser un arreglo de 3 notas";
  if (!notas.every((n) => typeof n === "number" && n >= 1 && n <= 10)) {
    return "cada nota debe ser un número entre 1 y 10";
  }
  return null;
};

// idExcluido permite que un alumno se modifique conservando su propio nombre
const nombreRepetido = (nombre, idExcluido) =>
  alumnos.some(
    (a) => a.id !== idExcluido && a.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );

const calcularCondicion = (promedio) => {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
};

app.get("/alumnos", (req, res) => {
  res.json(alumnos);
});

app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

  res.json(alumno);
});

// Notas con datos derivados (promedio y condición), sin guardarlos
app.get("/alumnos/:id/notas", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

  const suma = alumno.notas.reduce((acc, n) => acc + n, 0);
  const promedio = Math.round((suma / alumno.notas.length) * 100) / 100;

  res.json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion: calcularCondicion(promedio),
  });
});

app.post("/alumnos", (req, res) => {
  const error = validarAlumno(req.body);
  if (error) return res.status(400).json({ error });

  const { nombre, notas } = req.body;
  if (nombreRepetido(nombre)) return res.status(409).json({ error: "Ya existe un alumno con ese nombre" });

  const alumno = { id: ++ultimoId, nombre: nombre.trim(), notas };
  alumnos.push(alumno);
  res.status(201).json(alumno);
});

app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const error = validarAlumno(req.body);
  if (error) return res.status(400).json({ error });

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

  const { nombre, notas } = req.body;
  if (nombreRepetido(nombre, id)) return res.status(409).json({ error: "Ya existe un alumno con ese nombre" });

  alumno.nombre = nombre.trim();
  alumno.notas = notas;
  res.json(alumno);
});

app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  if (!alumnos.some((a) => a.id === id)) return res.status(404).json({ error: "Alumno no encontrado" });

  alumnos = alumnos.filter((a) => a.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Ejercicio 2 escuchando en http://localhost:3000"));
