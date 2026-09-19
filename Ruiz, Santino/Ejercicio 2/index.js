import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para conservar a los alumnos
let alumnos = [
  { id: 1, nombre: "Juan Perez", notas: [8, 9, 7] },
  { id: 2, nombre: "Ana Gomez", notas: [4, 5, 5] },
];

let nextId = 3;

// Función para calcular los datos derivados
const calcularDatos = (alumno) => {
  const suma = alumno.notas.reduce((a, b) => a + b, 0);
  const promedio = parseFloat((suma / 3).toFixed(2));
  
  let condicion = "";
  if (promedio < 6) {
    condicion = "reprobado";
  } else if (promedio >= 8) {
    condicion = "promocionado";
  } else {
    condicion = "aprobado";
  }

  // Se devuelve un nuevo objeto para no modificar el almacenamiento interno original
  return { ...alumno, promedio, condicion };
};

// GET para entregar listado de alumnos con sus datos derivados
app.get("/alumnos", (req, res) => {
  const alumnosConDatos = alumnos.map(calcularDatos);
  res.send(alumnosConDatos);
});

// GET para entregar detalle de un alumno en particular
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  res.send(calcularDatos(alumno));
});

// POST para crear un alumno
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  // Validaciones
  if (!nombre || nombre.trim() === "") {
    return res.status(400).send("El nombre es obligatorio");
  }
  if (!notas || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).send("Debe proporcionar exactamente tres notas en un arreglo");
  }

  const nombreNormalizado = nombre.trim().toLowerCase();
  const existe = alumnos.find((a) => a.nombre.toLowerCase() === nombreNormalizado);
  
  if (existe) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
  }

  const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    notas
  };

  alumnos.push(nuevoAlumno);
  res.status(201).send(nuevoAlumno);
});

// PUT para modificar a un alumno
app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  let alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  const { nombre, notas } = req.body;

  // Validaciones
  if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).send("Datos incompletos o incorrectos (se requiere nombre y tres notas)");
  }

  const nombreNormalizado = nombre.trim().toLowerCase();
  
  // Verificamos si existe el nombre
  const nombreOcupado = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombreNormalizado && a.id !== id
  );

  if (nombreOcupado) {
    return res.status(400).send("El nombre provisto ya le pertenece a otro alumno");
  }

  alumnoEncontrado.nombre = nombre.trim();
  alumnoEncontrado.notas = notas;

  res.send(alumnoEncontrado);
});

// DELETE para quitar un alumno
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  alumnos = alumnos.filter((a) => a.id !== id);
  res.send(alumnoEncontrado);
});

app.listen(port, () => {
  console.log(`API de Alumnos funcionando en el puerto ${port}`);
});