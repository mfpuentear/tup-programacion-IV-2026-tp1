import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let alumnos = [
  { id: 1, nombre: "Antonella Magaldi", notas: [8, 9, 8] },
  { id: 2, nombre: "Mateo Diaz", notas: [6, 7, 6] },
  { id: 3, nombre: "Lautaro Jover", notas: [4, 5, 2] },
];
let nextId = 4; //[cite: 2]

const determinarCondicion = (promedio) => {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
};

const serializarAlumno = (alumno) => {
  const suma = alumno.notas.reduce((acc, nota) => acc + nota, 0);
  const promedio = Number((suma / alumno.notas.length).toFixed(2));
  return {
    ...alumno,
    promedio,
    condicion: determinarCondicion(promedio),
  };
};

const validarNotas = (notas) => {
  return (
    Array.isArray(notas) &&
    notas.length === 3 &&
    notas.every((n) => typeof n === "number" && n >= 0 && n <= 10)
  );
};

// Consultar todos (filtro opcional por condición)
app.get("/alumnos", (req, res) => {
  let resultado = alumnos.map(serializarAlumno);
  const { condicion } = req.query;

  if (condicion) {
    const condNormalizada = condicion.toLowerCase();
    resultado = resultado.filter((a) => a.condicion === condNormalizada);
  }

  res.send(resultado);
});

// Detalle por ID
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  res.send(serializarAlumno(alumno));
});

// Crear alumno
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre es requerido");
  }

  const nombreLimpio = nombre.trim();
  const existe = alumnos.some(
    (a) => a.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );
  if (existe) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
  }

  if (!validarNotas(notas)) {
    return res.status(400).send("Debe proveer un arreglo de exactamente 3 notas entre 0 y 10");
  }

  const nuevoAlumno = { id: nextId++, nombre: nombreLimpio, notas };
  alumnos.push(nuevoAlumno);

  res.status(201).send(serializarAlumno(nuevoAlumno));
});

// Modificar alumno
app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const alumno = alumnos.find((a) => a.id === id);
  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  const { nombre, notas } = req.body; //[cite: 2]
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).send("El nombre es requerido");
  }

  const nombreLimpio = nombre.trim();
  const existe = alumnos.some(
    (a) => a.id !== id && a.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );
  if (existe) {
    return res.status(400).send("Ya existe otro alumno con ese nombre");
  }

  if (!validarNotas(notas)) {
    return res.status(400).send("Debe proveer un arreglo de exactamente 3 notas entre 0 y 10");
  }

  alumno.nombre = nombreLimpio;
  alumno.notas = notas;

  res.send(serializarAlumno(alumno));
});

// Quitar alumno
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const index = alumnos.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).send("Alumno no encontrado");
  }

  const [eliminado] = alumnos.splice(index, 1);
  res.send(serializarAlumno(eliminado));
});

app.listen(port, () => console.log(`Servidor en puerto ${port}`));