const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

const alumnos = [];

function buscarAlumno(nombre) {
  return alumnos.find((alumno) => alumno.nombre === nombre);
}

/*
 * Función para calcular el promedio de un alumno.
 */
function calcularPromedio(notas) {
  const suma = notas.reduce((total, nota) => total + nota, 0);

  return suma / notas.length;
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

 
  if (!Array.isArray(notas)) {
    return "Las notas deben enviarse en un arreglo";
  }

  
  if (notas.length !== 3) {
    return "El alumno debe tener exactamente tres notas";
  }

  
  for (const nota of notas) {
    if (typeof nota !== "number" || !Number.isFinite(nota)) {
      return "Todas las notas deben ser números válidos";
    }

    if (nota < 0 || nota > 10) {
      return "Las notas deben estar entre 0 y 10";
    }
  }

  return null;
}


app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map((alumno) => {
    const promedio = calcularPromedio(alumno.notas);
    const condicion = determinarCondicion(promedio);

    return {
      nombre: alumno.nombre,
      notas: alumno.notas,
      promedio: Number(promedio.toFixed(2)),
      condicion
    };
  });

  return res.status(200).json(resultado);
});


app.get("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const alumno = buscarAlumno(nombre);

  if (!alumno) {
    return res.status(404).json({
      error: "Alumno no encontrado"
    });
  }

  const promedio = calcularPromedio(alumno.notas);
  const condicion = determinarCondicion(promedio);

  return res.status(200).json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: Number(promedio.toFixed(2)),
    condicion
  });
});


app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  
  const error = validarAlumno(nombre, notas);

  if (error) {
    return res.status(400).json({
      error
    });
  }

  
  if (buscarAlumno(nombre.trim())) {
    return res.status(409).json({
      error: "Ya existe un alumno con ese nombre"
    });
  }

  
  const nuevoAlumno = {
    nombre: nombre.trim(),
    notas
  };

  alumnos.push(nuevoAlumno);

  return res.status(201).json(nuevoAlumno);
});


app.put("/alumnos/:nombre", (req, res) => {
  const nombreActual = req.params.nombre;
  const { nombre, notas } = req.body;

  // Buscar alumno existente.
  const alumno = buscarAlumno(nombreActual);

  if (!alumno) {
    return res.status(404).json({
      error: "Alumno no encontrado"
    });
  }


  let nuevoNombre = alumno.nombre;

  if (nombre !== undefined) {
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({
        error: "El nombre debe ser un texto no vacío"
      });
    }

    const nombreLimpio = nombre.trim();

    const alumnoConMismoNombre = alumnos.find(
      (otroAlumno) =>
        otroAlumno !== alumno && otroAlumno.nombre === nombreLimpio
    );

    if (alumnoConMismoNombre) {
      return res.status(409).json({
        error: "Ya existe otro alumno con ese nombre"
      });
    }

    nuevoNombre = nombreLimpio;
  }


  let nuevasNotas = alumno.notas;

  if (notas !== undefined) {
    if (!Array.isArray(notas)) {
      return res.status(400).json({
        error: "Las notas deben enviarse en un arreglo"
      });
    }

    if (notas.length !== 3) {
      return res.status(400).json({
        error: "El alumno debe tener exactamente tres notas"
      });
    }

    for (const nota of notas) {
      if (typeof nota !== "number" || !Number.isFinite(nota)) {
        return res.status(400).json({
          error: "Todas las notas deben ser números válidos"
        });
      }

      if (nota < 0 || nota > 10) {
        return res.status(400).json({
          error: "Las notas deben estar entre 0 y 10"
        });
      }
    }

    nuevasNotas = notas;
  }

  
  alumno.nombre = nuevoNombre;
  alumno.notas = nuevasNotas;

  return res.status(200).json(alumno);
});


app.delete("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  const indice = alumnos.findIndex(
    (alumno) => alumno.nombre === nombre
  );

  if (indice === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado"
    });
  }

  alumnos.splice(indice, 1);

  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    error: "Recurso no encontrado"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});