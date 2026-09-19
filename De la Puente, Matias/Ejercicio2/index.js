const express = require('express');
const app = express();

app.use(express.json());

let alumnos = [];
let proximoId = 1;


function calcularCondicion(notas) {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  const promedio = Number((suma / notas.length).toFixed(2));

  let condicion = '';
  if (promedio < 6) {
    condicion = 'reprobado';
  } else if (promedio <= 7) {
    condicion = 'aprobado';
  } else {
    condicion = 'promocionado';
  }

  return { promedio, condicion };
}

function validarDatosAlumno(nombre, notas, idActual = null) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { ok: false, mensaje: 'El nombre es obligatorio y debe ser un texto.' };
  }

  const nombreLimpio = nombre.trim();
  const nombreExiste = alumnos.some(
    a => a.nombre.toLowerCase() === nombreLimpio.toLowerCase() && a.id !== idActual
  );

  if (nombreExiste) {
    return { ok: false, mensaje: `Ya existe un alumno con el nombre '${nombreLimpio}'.` };
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return { ok: false, mensaje: 'Las notas deben ser 3 minimo.' };
  }

  for (let i = 0; i < notas.length; i++) {
    const nota = Number(notas[i]);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      return { ok: false, mensaje: `La nota en la posición ${i + 1} debe ser un número entre 0 y 10.` };
    }
  }

  return { ok: true, nombre: nombreLimpio, notas: notas.map(Number) };
}




app.get('/api/alumnos', (req, res) => {
  const respuesta = alumnos.map(alumno => {
    const { promedio, condicion } = calcularCondicion(alumno.notas);
    return { ...alumno, promedio, condicion };
  });

  return res.status(200).json(respuesta);
});

app.get('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumno = alumnos.find(a => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'No se encontro el alumno.' });
  }

  const { promedio, condicion } = calcularCondicion(alumno.notas);
  return res.status(200).json({ ...alumno, promedio, condicion });
});

app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  const validacion = validarDatosAlumno(nombre, notas);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  const nuevoAlumno = {
    id: proximoId++,
    nombre: validacion.nombre,
    notas: validacion.notas
  };

  alumnos.push(nuevoAlumno);

  const { promedio, condicion } = calcularCondicion(nuevoAlumno.notas);
  return res.status(201).json({ ...nuevoAlumno, promedio, condicion });
});

app.put('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumnoIndex = alumnos.findIndex(a => a.id === id);

  if (alumnoIndex === -1) {
    return res.status(404).json({ error: 'No se encontro el alumno.' });
  }

  const { nombre, notas } = req.body;
  const validacion = validarDatosAlumno(nombre, notas, id);

  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  alumnos[alumnoIndex] = {
    id,
    nombre: validacion.nombre,
    notas: validacion.notas
  };

  const { promedio, condicion } = calcularCondicion(alumnos[alumnoIndex].notas);
  return res.status(200).json({ ...alumnos[alumnoIndex], promedio, condicion });
});

app.delete('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const alumnoIndex = alumnos.findIndex(a => a.id === id);

  if (alumnoIndex === -1) {
    return res.status(404).json({ error: 'No se encontro el alumno.' });
  }

  alumnos.splice(alumnoIndex, 1);
  return res.status(200).json({ mensaje: 'Se elimino el alumno correctamente.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Alumnos ejecutándose en http://localhost:${PORT}`);
});