const express = require('express');
const app = express();

app.use(express.json());

const alumnos = [];
let idContador = 1;
function calcularPromedio(notas) {

  const suma = notas.reduce((acc, n) => acc + n, 0);
  return Number((suma / notas.length).toFixed(2));


}

function obtenerCondicion(promedio) {
  if (promedio < 6) return 'reprobado';
  if (promedio < 8) return 'aprobado';
  return 'promocionado';

}


function formatearAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);


  return {
    id: alumno.id,
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: promedio,
    condicion: obtenerCondicion(promedio)



  };

}

function validarNotas(notas) {

  if (!Array.isArray(notas) || notas.length !== 3) return false;

  return notas.every(n => typeof n === 'number' && n >= 0 && n <= 10);


}



app.get('/api/alumnos', (req, res) => {
  const resultado = alumnos.map(a => formatearAlumno(a));
  res.json(resultado);

});


app.get('/api/alumnos/:id', (req, res) => {


  const id = Number(req.params.id);
  const alumno = alumnos.find(a => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });


  }

  res.json(formatearAlumno(alumno));

});


app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;



  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {

    return res.status(400).json({ error: 'El nombre es obligatorio' });

  }

  if (!validarNotas(notas)) {

    return res.status(400).json({ error: 'Se requieren exactamente 3 notas entre 0 y 10' });


  }



  const yaExiste = alumnos.some(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());

  if (yaExiste) {

    return res.status(400).json({ error: 'Ya existe un alumno con ese nombre' });


  }

  const nuevoAlumno = {
    id: idContador++,
    nombre: nombre.trim(),
    notas
  };


  alumnos.push(nuevoAlumno);

  res.status(201).json(formatearAlumno(nuevoAlumno));


});


app.put('/api/alumnos/:id', (req, res) => {

  const id = Number(req.params.id);
  const { nombre, notas } = req.body;

  const alumno = alumnos.find(a => a.id === id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });

  }

  if (nombre !== undefined) {


    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre no es válido' });


    }

    const nombreRepetido = alumnos.some(
      a => a.nombre.toLowerCase() === nombre.trim().toLowerCase() && a.id !== id

    );

    if (nombreRepetido) {
      return res.status(400).json({ error: 'Ya existe otro alumno con ese nombre' });
    }

    alumno.nombre = nombre.trim();

  }

  if (notas !== undefined) {
    if (!validarNotas(notas)) {
      return res.status(400).json({ error: 'Se requieren exactamente 3 notas entre 0 y 10' });
    }

    alumno.notas = notas;


  }

  res.json(formatearAlumno(alumno));
});


app.delete('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alumnos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado' });

  }

  alumnos.splice(index, 1);

  res.json({ mensaje: 'Alumno eliminado con éxito' });


});


app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');


});