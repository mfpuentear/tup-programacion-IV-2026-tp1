const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const alumnos = [
  {
    nombre: "Gabriel",
    notas: [8, 7, 9],
  },
  {
    nombre: "Nati",
    notas: [5, 6, 4],
  },
];

// Funciones auxiliares
function calcularPromedio(notas) {
  return (notas[0] + notas[1] + notas[2]) / 3;
}

function determinarCondicion(promedio) {
  if (promedio < 6) {
    return "reprobado";
  }

  if (promedio < 8) {
    return "aprobado";
  }

  return "promocionado";
}

function validarAlumno(nombre, notas) {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return "El nombre es obligatorio y debe ser un texto";
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return "El alumno debe tener exactamente tres notas";
  }

  const notasValidas = notas.every(
    (nota) =>
      typeof nota === "number" &&
      Number.isFinite(nota) &&
      nota >= 0 &&
      nota <= 10,
  );

  if (!notasValidas) {
    return "Las notas deben ser numeros entre 0 y 10";
  }

  return null;
}

// GET /alumnos
app.get("/alumnos", (req, res) => {
  res.status(200).json(alumnos);
});

// GET /alumnos/:nombre
app.get("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const alumno = alumnos.find(
    (alumno) => alumno.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (!alumno) {
    return res.status(404).json({
      error: "Alumno no encontrado",
    });
  }

  const promedio = calcularPromedio(alumno.notas);
  const condicion = determinarCondicion(promedio);

  res.status(200).json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion,
  });
});

// POST /alumnos
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  const error = validarAlumno(nombre, notas);

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  const nombreExiste = alumnos.some(
    (alumno) => alumno.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );

  if (nombreExiste) {
    return res.status(409).json({
      error: "Ya existe un alumno con ese nombre",
    });
  }

  const nuevoAlumno = {
    nombre: nombre.trim(),
    notas,
  };

  alumnos.push(nuevoAlumno);

  res.status(201).json(nuevoAlumno);
});

// PUT /alumnos/:nombre
app.put("/alumnos/:nombre", (req, res) => {
  const nombreBuscado = req.params.nombre;
  const { nombre, notas } = req.body;

  const indice = alumnos.findIndex(
    (alumno) => alumno.nombre.toLowerCase() === nombreBuscado.toLowerCase(),
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado",
    });
  }

  const error = validarAlumno(nombre, notas);

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  const nombreDuplicado = alumnos.some(
    (alumno, i) =>
      i !== indice &&
      alumno.nombre.toLowerCase() === nombre.trim().toLowerCase(),
  );

  if (nombreDuplicado) {
    return res.status(409).json({
      error: "Ya existe otro alumno con ese nombre",
    });
  }

  alumnos[indice] = {
    nombre: nombre.trim(),
    notas,
  };

  res.status(200).json(alumnos[indice]);
});

// DELETE /alumnos/:nombre
app.delete("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const indice = alumnos.findIndex(
    (alumno) => alumno.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado",
    });
  }

  alumnos.splice(indice, 1);

  res.status(200).json({
    mensaje: "Alumno eliminado correctamente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
