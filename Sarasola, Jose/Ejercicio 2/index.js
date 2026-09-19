const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

/**
 * Arreglo interno solicitado por la consigna.
 *
 * Únicamente se almacenan:
 * - nombre
 * - notas
 *
 * El promedio y la condición académica NO se almacenan.
 */
const alumnos = [];

/**
 * Normaliza un nombre para realizar comparaciones.
 * De esta manera "Ana", "ana" y " ANA " se consideran
 * el mismo nombre.
 */
function normalizarNombre(nombre) {
  return nombre.trim().toLowerCase();
}

/**
 * Valida el nombre de un alumno.
 */
function validarNombre(nombre) {
  if (nombre === undefined) {
    return "El nombre es obligatorio.";
  }

  if (typeof nombre !== "string") {
    return "El nombre debe ser una cadena de texto.";
  }

  if (nombre.trim() === "") {
    return "El nombre no puede estar vacío.";
  }

  return null;
}

/**
 * Valida que existan exactamente tres notas
 * y que cada una sea un número entre 0 y 10.
 */
function validarNotas(notas) {
  if (notas === undefined) {
    return "Las notas son obligatorias.";
  }

  if (!Array.isArray(notas)) {
    return "Las notas deben enviarse en un arreglo.";
  }

  if (notas.length !== 3) {
    return "El alumno debe tener exactamente tres notas.";
  }

  for (const nota of notas) {
    if (typeof nota !== "number" || !Number.isFinite(nota)) {
      return "Todas las notas deben ser valores numéricos.";
    }

    if (nota < 0 || nota > 10) {
      return "Cada nota debe estar comprendida entre 0 y 10.";
    }
  }

  return null;
}

/**
 * Valida el body completo de un alumno.
 */
function validarAlumno(body) {
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      error: "El cuerpo de la petición debe ser un objeto JSON.",
    };
  }

  const errorNombre = validarNombre(body.nombre);

  if (errorNombre) {
    return {
      error: errorNombre,
    };
  }

  const errorNotas = validarNotas(body.notas);

  if (errorNotas) {
    return {
      error: errorNotas,
    };
  }

  return {
    alumno: {
      nombre: body.nombre.trim(),
      notas: [...body.notas],
    },
  };
}

/**
 * Busca un alumno por nombre.
 */
function buscarIndiceAlumno(nombre) {
  const nombreNormalizado = normalizarNombre(nombre);

  return alumnos.findIndex(
    (alumno) =>
      normalizarNombre(alumno.nombre) === nombreNormalizado
  );
}

/**
 * Calcula el promedio.
 */
function calcularPromedio(notas) {
  const suma = notas.reduce(
    (acumulador, nota) => acumulador + nota,
    0
  );

  return suma / notas.length;
}

/**
 * Determina la condición académica a partir del promedio.
 */
function obtenerCondicion(promedio) {
  if (promedio < 6) {
    return "reprobado";
  }

  if (promedio < 8) {
    return "aprobado";
  }

  return "promocionado";
}

/**
 * Construye la representación del alumno que se devuelve
 * al cliente.
 *
 * El promedio y la condición se calculan en este momento
 * y NO se agregan al arreglo interno.
 */
function obtenerAlumnoConDatosDerivados(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  const condicion = obtenerCondicion(promedio);

  return {
    nombre: alumno.nombre,
    notas: [...alumno.notas],
    promedio,
    condicion,
  };
}

/**
 * GET /alumnos
 *
 * Lista todos los alumnos.
 */
app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map(
    obtenerAlumnoConDatosDerivados
  );

  return res.status(200).json(resultado);
});

/**
 * GET /alumnos/:nombre
 *
 * Consulta un alumno por nombre.
 */
app.get("/alumnos/:nombre", (req, res) => {
  const errorNombre = validarNombre(req.params.nombre);

  if (errorNombre) {
    return res.status(400).json({
      error: errorNombre,
    });
  }

  const indice = buscarIndiceAlumno(req.params.nombre);

  if (indice === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado.",
    });
  }

  return res
    .status(200)
    .json(obtenerAlumnoConDatosDerivados(alumnos[indice]));
});

/**
 * POST /alumnos
 *
 * Crea un alumno.
 */
app.post("/alumnos", (req, res) => {
  const resultadoValidacion = validarAlumno(req.body);

  if (resultadoValidacion.error) {
    return res.status(400).json({
      error: resultadoValidacion.error,
    });
  }

  const nuevoAlumno = resultadoValidacion.alumno;

  if (buscarIndiceAlumno(nuevoAlumno.nombre) !== -1) {
    return res.status(409).json({
      error: "Ya existe un alumno con ese nombre.",
    });
  }

  alumnos.push(nuevoAlumno);

  return res
    .status(201)
    .json(obtenerAlumnoConDatosDerivados(nuevoAlumno));
});

/**
 * PUT /alumnos/:nombre
 *
 * Reemplaza los datos de un alumno.
 */
app.put("/alumnos/:nombre", (req, res) => {
  const errorNombreParametro = validarNombre(
    req.params.nombre
  );

  if (errorNombreParametro) {
    return res.status(400).json({
      error: errorNombreParametro,
    });
  }

  const indiceActual = buscarIndiceAlumno(
    req.params.nombre
  );

  if (indiceActual === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado.",
    });
  }

  const resultadoValidacion = validarAlumno(req.body);

  if (resultadoValidacion.error) {
    return res.status(400).json({
      error: resultadoValidacion.error,
    });
  }

  const alumnoModificado =
    resultadoValidacion.alumno;

  const indiceNombreNuevo = buscarIndiceAlumno(
    alumnoModificado.nombre
  );

  if (
    indiceNombreNuevo !== -1 &&
    indiceNombreNuevo !== indiceActual
  ) {
    return res.status(409).json({
      error: "Ya existe otro alumno con ese nombre.",
    });
  }

  alumnos[indiceActual] = alumnoModificado;

  return res
    .status(200)
    .json(
      obtenerAlumnoConDatosDerivados(
        alumnos[indiceActual]
      )
    );
});

/**
 * DELETE /alumnos/:nombre
 *
 * Elimina un alumno.
 */
app.delete("/alumnos/:nombre", (req, res) => {
  const errorNombre = validarNombre(req.params.nombre);

  if (errorNombre) {
    return res.status(400).json({
      error: errorNombre,
    });
  }

  const indice = buscarIndiceAlumno(
    req.params.nombre
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado.",
    });
  }

  alumnos.splice(indice, 1);

  return res.status(204).send();
});

/**
 * Ruta inexistente.
 */
app.use((req, res) => {
  return res.status(404).json({
    error: "Recurso no encontrado.",
  });
});

/**
 * Manejo de JSON mal formado.
 */
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      error: "El cuerpo JSON no es válido.",
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Error interno del servidor.",
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 2 ejecutándose en http://localhost:${PORT}`);
});