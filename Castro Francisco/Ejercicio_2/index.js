const express = require("express");
const app = express();
const PORT = 3002;

app.use(express.json());


let alumnos = [];

// Funcion para calcular promedio y condicion 
function calcularCondicion(notas) {
  const promedio = notas.reduce((sum, n) => sum + n, 0) / notas.length;
  let condicion;
  if (promedio < 6) {
    condicion = "reprobado";
  } else if (promedio <= 7) {
    condicion = "aprobado";
  } else {
    condicion = "promocionado";
  }
  return { promedio: parseFloat(promedio.toFixed(2)), condicion };
}

// Funcion para validar las notas
function validarNotas(notas) {
  if (!Array.isArray(notas) || notas.length !== 3) {
    return "Se deben ingresar 3 notas";
  }
  for (const nota of notas) {
    if (typeof nota !== "number" || nota < 0 || nota > 10) {
      return "La nota debe ser un numero entre 0 y 10";
    }
  }
  return null;
}

// GET Listar todos los alumnos
app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map((a) => ({
    nombre: a.nombre,
    notas: a.notas,
    ...calcularCondicion(a.notas),
  }));
  return res.status(200).json(resultado);
});

// GET Consultar un alumno por nombre
app.get("/alumnos/:nombre", (req, res) => {
  const alumno = alumnos.find(
    (a) => a.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (!alumno) {
    return res.status(404).json({ error: `Alumno '${req.params.nombre}' no encontrado.` });
  }
  return res.status(200).json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    ...calcularCondicion(alumno.notas),
  });
});

// POST Crear un alumno nuevo
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "El campo 'nombre' es requerido y debe ser texto." });
  }

  const errorNotas = validarNotas(notas);
  if (errorNotas) {
    return res.status(400).json({ error: errorNotas });
  }

  const existe = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  if (existe) {
    return res.status(409).json({ error: `Ya existe un alumno con el nombre '${nombre}'.` });
  }

  const nuevoAlumno = { nombre: nombre.trim(), notas };
  alumnos.push(nuevoAlumno);
  return res.status(201).json({
    mensaje: "Alumno creado exitosamente.",
    alumno: { nombre: nuevoAlumno.nombre, notas: nuevoAlumno.notas },
  });
});

// PUT Modificar un alumno existente
app.put("/alumnos/:nombre", (req, res) => {
  const { nombre, notas } = req.body;

  const indice = alumnos.findIndex(
    (a) => a.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (indice === -1) {
    return res.status(404).json({ error: `Alumno '${req.params.nombre}' no encontrado.` });
  }

  // Validar nuevo nombre 
  const nuevoNombre = nombre ? nombre.trim() : alumnos[indice].nombre;
  if (
    nuevoNombre.toLowerCase() !== req.params.nombre.toLowerCase()
  ) {
    const duplicado = alumnos.find(
      (a) => a.nombre.toLowerCase() === nuevoNombre.toLowerCase()
    );
    if (duplicado) {
      return res.status(409).json({ error: `Ya existe un alumno con el nombre '${nuevoNombre}'.` });
    }
  }

  const errorNotas = validarNotas(notas);
  if (errorNotas) {
    return res.status(400).json({ error: errorNotas });
  }

  alumnos[indice] = { nombre: nuevoNombre, notas };
  return res.status(200).json({
    mensaje: "Alumno modificado exitosamente.",
    alumno: { nombre: alumnos[indice].nombre, notas: alumnos[indice].notas },
  });
});

// DELETE Eliminar un alumno
app.delete("/alumnos/:nombre", (req, res) => {
  const indice = alumnos.findIndex(
    (a) => a.nombre.toLowerCase() === req.params.nombre.toLowerCase()
  );
  if (indice === -1) {
    return res.status(404).json({ error: `Alumno '${req.params.nombre}' no encontrado.` });
  }
  const eliminado = alumnos.splice(indice, 1)[0];
  return res.status(200).json({ mensaje: `Alumno '${eliminado.nombre}' eliminado exitosamente.` });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
