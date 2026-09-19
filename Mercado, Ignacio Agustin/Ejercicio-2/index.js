import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para conservar alumnos y notas
let alumnos = [
    {id: 1, nombre: "Santino Ruiz", notas: [8, 9, 8]},
    {id: 2, nombre: "Thiago Quintero", notas: [3, 10, 1]},
    {id: 3, nombre: "Jose Mercado", notas: [4, 4, 6]},
];

let nextId = 5;

// Helper para calcular promedio y condicion academica
const obtenerDatosDerivados = (notas) => {
    const suma = notas.reduce((acc, curr) => acc + curr, 0);
    const promedio = Number((suma / notas.length).toFixed(2));

    let condicion = "Reprobado";
    if (promedio >= 8){
        condicion = "Promocionado";
    } else if (promedio >= 6) {
        condicion ="Aprobado";
    }
    
    return { promedio, condicion}
};

// Helper para validar datos de entradad 
const validarAlumno = (nombre, notas) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return { valido: false, mensaje: "El nombre es obligatorio y debe ser texto" };
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return { valido: false, mensaje: "Deben proporcionarse exactamente 3 notas en un arreglo" };
  }

  for (let nota of notas) {
    const n = Number(nota);
    if (isNaN(n) || n < 1 || n > 10) {
      return { valido: false, mensaje: "Cada nota debe ser un número entre 1 y 10" };
    }
  }

  return { valido: true };
};

app.get("/", (req, res) => {
  res.send("API de Gestión Académica de Alumnos");
});

// GET para entregar listado de alumnos (con opción de filtrar por nombre)
app.get("/alumnos", (req, res) => {
  let resultado = alumnos.map((a) => {
    const { promedio, condicion } = obtenerDatosDerivados(a.notas);
    return { ...a, promedio, condicion };
  });

  const nombreQuery = req.query.nombre;
  if (nombreQuery) {
    resultado = resultado.filter((a) =>
      a.nombre.toLowerCase().includes(nombreQuery.toLowerCase())
    );
  }

  res.send(resultado);
});

// GET para entregar detalle de un alumno con sus notas y datos derivados
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const alumno = alumnos.find((a) => a.id === id);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  const { promedio, condicion } = obtenerDatosDerivados(alumno.notas);

  res.send({
    ...alumno,
    promedio,
    condicion,
  });
});

// POST para crear un alumno 
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  const validacion = validarAlumno(nombre, notas);
  if (!validacion.valido) {
    return res.status(400).send(validacion.mensaje);
  }

  const nombreLimpio = nombre.trim();

  // Verificar que no exista otro alumno con el mismo nombre (case insensitive)
  const existe = alumnos.some(
    (a) => a.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );

  if (existe) {
    return res.status(400).send("Ya existe un alumno registrado con ese nombre");
  }

  const nuevoAlumno = {
    id: nextId++,
    nombre: nombreLimpio,
    notas: notas.map(Number),
  };

  alumnos.push(nuevoAlumno);

  const { promedio, condicion } = obtenerDatosDerivados(nuevoAlumno.notas);

  res.status(201).send({
    ...nuevoAlumno,
    promedio,
    condicion,
  });
});

// PUT para modificar un alumno por id
app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  let alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  const { nombre, notas } = req.body;

  const validacion = validarAlumno(nombre, notas);
  if (!validacion.valido) {
    return res.status(400).send(validacion.mensaje);
  }

  const nombreLimpio = nombre.trim();

  // Verificar que no exista otro alumno con el mismo nombre (excluyendo al actual)
  const existeDuplicado = alumnos.some(
    (a) => a.id !== id && a.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  );

  if (existeDuplicado) {
    return res.status(400).send("Ya existe otro alumno registrado con ese nombre");
  }

  alumnoEncontrado.nombre = nombreLimpio;
  alumnoEncontrado.notas = notas.map(Number);

  const { promedio, condicion } = obtenerDatosDerivados(alumnoEncontrado.notas);

  res.send({
    ...alumnoEncontrado,
    promedio,
    condicion,
  });
});

// DELETE para eliminar un alumno por id
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  let alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  alumnos = alumnos.filter((a) => a.id !== id);

  const { promedio, condicion } = obtenerDatosDerivados(alumnoEncontrado.notas);

  res.send({
    ...alumnoEncontrado,
    promedio,
    condicion,
  });
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});