const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Arreglo interno en memoria (almacena únicamente nombre y notas)
let alumnos = [];

// Función para calcular el promedio (dato derivado)
function calcularPromedio(notas) {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return parseFloat((suma / notas.length).toFixed(2));
}

// Función para determinar la condición académica (dato derivado)
function obtenerCondicion(promedio) {
  if (promedio < 6) {
    return 'reprobado';
  } else if (promedio < 8) {
    return 'aprobado';
  } else {
    return 'promocionado';
  }
}

// Genera la respuesta del alumno calculando los datos derivados al vuelo
function formatearRespuestaAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  const condicion = obtenerCondicion(promedio);

  return {
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    condicion
  };
}

// Valida que el arreglo contenga exactamente 3 notas numéricas entre 0 y 10
function sonNotasValidas(notas) {
  if (!Array.isArray(notas) || notas.length !== 3) {
    return false;
  }
  return notas.every(nota => typeof nota === 'number' && !isNaN(nota) && nota >= 0 && nota <= 10);
}

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API de gestión académica de alumnos. Endpoints disponibles bajo /alumnos');
});

// 1. GET /alumnos - Listar todos los alumnos con sus datos derivados
app.get('/alumnos', (req, res) => {
  const resultado = alumnos.map(formatearRespuestaAlumno);
  return res.json(resultado);
});

// 2. GET /alumnos/:nombre - Consultar notas, promedio y condición de un alumno
app.get('/alumnos/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreBuscado);

  if (!alumno) {
    return res.status(404).json({
      error: `No se encontró ningún alumno con el nombre "${req.params.nombre}".`
    });
  }

  return res.json(formatearRespuestaAlumno(alumno));
});

// 3. POST /alumnos - Registrar un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  // Validación de nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      error: 'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.'
    });
  }

  const nombreLimpio = nombre.trim();

  // Validación de unicidad de nombre (no sensible a mayúsculas/minúsculas)
  const existe = alumnos.some(a => a.nombre.toLowerCase() === nombreLimpio.toLowerCase());
  if (existe) {
    return res.status(409).json({
      error: `Ya existe un alumno registrado con el nombre "${nombreLimpio}".`
    });
  }

  // Validación de notas
  if (!sonNotasValidas(notas)) {
    return res.status(400).json({
      error: 'El campo "notas" debe ser un arreglo de exactamente 3 números entre 0 y 10.'
    });
  }

  // Se almacena estrictamente sin promedio ni condición en el arreglo interno
  const nuevoAlumno = {
    nombre: nombreLimpio,
    notas
  };

  alumnos.push(nuevoAlumno);

  return res.status(201).json(formatearRespuestaAlumno(nuevoAlumno));
});

// 4. PUT /alumnos/:nombre - Modificar datos de un alumno existente
app.put('/alumnos/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreBuscado);

  if (!alumno) {
    return res.status(404).json({
      error: `No se encontró ningún alumno con el nombre "${req.params.nombre}".`
    });
  }

  const { nombre: nuevoNombre, notas } = req.body;

  // Si se desea modificar el nombre, validar que no esté en blanco y no esté duplicado
  if (nuevoNombre !== undefined) {
    if (typeof nuevoNombre !== 'string' || nuevoNombre.trim() === '') {
      return res.status(400).json({
        error: 'El nuevo "nombre" debe ser una cadena de texto no vacía.'
      });
    }

    const nuevoNombreLimpio = nuevoNombre.trim();
    if (nuevoNombreLimpio.toLowerCase() !== alumno.nombre.toLowerCase()) {
      const repetido = alumnos.some(a => a.nombre.toLowerCase() === nuevoNombreLimpio.toLowerCase());
      if (repetido) {
        return res.status(409).json({
          error: `Ya existe otro alumno con el nombre "${nuevoNombreLimpio}".`
        });
      }
      alumno.nombre = nuevoNombreLimpio;
    }
  }

  // Si se envían notas, validarlas
  if (notas !== undefined) {
    if (!sonNotasValidas(notas)) {
      return res.status(400).json({
        error: 'El campo "notas" debe ser un arreglo de exactamente 3 números entre 0 y 10.'
      });
    }
    alumno.notas = notas;
  } else if (nuevoNombre === undefined) {
    return res.status(400).json({
      error: 'Debe enviar al menos el campo "notas" o "nombre" para realizar la actualización.'
    });
  }

  return res.json(formatearRespuestaAlumno(alumno));
});

// 5. DELETE /alumnos/:nombre - Eliminar un alumno del registro
app.delete('/alumnos/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.trim().toLowerCase();
  const indice = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreBuscado);

  if (indice === -1) {
    return res.status(404).json({
      error: `No se encontró ningún alumno con el nombre "${req.params.nombre}".`
    });
  }

  const alumnoEliminado = alumnos.splice(indice, 1)[0];
  return res.json({
    mensaje: `Alumno "${alumnoEliminado.nombre}" eliminado correctamente.`
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor del Ejercicio 2 escuchando en el puerto ${PORT}`);
});
