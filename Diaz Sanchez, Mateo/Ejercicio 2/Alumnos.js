import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const alumnos = [];
let siguienteId = 1;

const validarNombre = (nombre) => {
  if (typeof nombre !== "string" || nombre.trim() === "") {
    const error = new Error("El nombre es obligatorio.");
    error.statusCode = 400;
    throw error;
  }

  return nombre.trim();
};

const validarNota = (valor, nombreCampo) => {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0 || numero > 10) {
    const error = new Error(`${nombreCampo} debe estar entre 0 y 10.`);
    error.statusCode = 400;
    throw error;
  }

  return numero;
};

const calcularPromedio = (notas) => {
  const total = notas.reduce((sum, nota) => sum + nota, 0);
  return total / notas.length;
};

const obtenerCondicion = (promedio) => {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
};

const serializarAlumno = (alumno) => {
  const promedio = calcularPromedio(alumno.notas);

  return {
    ...alumno,
    promedio: Number(promedio.toFixed(2)),
    condicion: obtenerCondicion(promedio),
  };
};

app.get("/alumnos", (req, res) => {
  res.json(alumnos.map(serializarAlumno));
});

app.get("/alumnos/:id", (req, res) => {
  const alumno = alumnos.find((item) => item.id === Number(req.params.id));

  if (!alumno) {
    return res.status(404).json({ message: "Alumno no encontrado." });
  }

  return res.json(serializarAlumno(alumno));
});

app.post("/alumnos", (req, res) => {
  try {
    const nombre = validarNombre(req.body.nombre);
    const notas = [
      validarNota(req.body.nota1, "nota1"),
      validarNota(req.body.nota2, "nota2"),
      validarNota(req.body.nota3, "nota3"),
    ];

    const existente = alumnos.some((item) => item.nombre.toLowerCase() === nombre.toLowerCase());
    if (existente) {
      return res.status(409).json({ message: "Ya existe un alumno con ese nombre." });
    }

    const alumno = {
      id: siguienteId++,
      nombre,
      notas,
    };

    alumnos.push(alumno);

    return res.status(201).json(serializarAlumno(alumno));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.put("/alumnos/:id", (req, res) => {
  const alumno = alumnos.find((item) => item.id === Number(req.params.id));

  if (!alumno) {
    return res.status(404).json({ message: "Alumno no encontrado." });
  }

  try {
    if (req.body.nombre !== undefined) {
      const nombre = validarNombre(req.body.nombre);
      const existeOtro = alumnos.some(
        (item) => item.id !== alumno.id && item.nombre.toLowerCase() === nombre.toLowerCase()
      );

      if (existeOtro) {
        return res.status(409).json({ message: "Ya existe un alumno con ese nombre." });
      }

      alumno.nombre = nombre;
    }

    if (req.body.nota1 !== undefined) alumno.notas[0] = validarNota(req.body.nota1, "nota1");
    if (req.body.nota2 !== undefined) alumno.notas[1] = validarNota(req.body.nota2, "nota2");
    if (req.body.nota3 !== undefined) alumno.notas[2] = validarNota(req.body.nota3, "nota3");

    return res.json(serializarAlumno(alumno));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.delete("/alumnos/:id", (req, res) => {
  const posicion = alumnos.findIndex((item) => item.id === Number(req.params.id));

  if (posicion === -1) {
    return res.status(404).json({ message: "Alumno no encontrado." });
  }

  const [eliminado] = alumnos.splice(posicion, 1);

  return res.json({
    message: "Alumno eliminado correctamente.",
    alumno: serializarAlumno(eliminado),
  });
});

app.listen(port, () => {
  console.log(`API de alumnos escuchando en http://localhost:${port}`);
});
