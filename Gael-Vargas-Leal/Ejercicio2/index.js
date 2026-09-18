    import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno en memoria para conservar los datos
let alumnos = [
  { id: 1, nombre: "Juan Perez", notas: [7, 8, 9] },
  { id: 2, nombre: "Maria Gomez", notas: [5, 4, 6] }
];

let proximoId = 3;


function calcularPromedio(notas) {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return Number((suma / notas.length).toFixed(2));
}

function determinarCondicion(promedio) {
  if (promedio < 6) return "reprobado";
  if (promedio <= 7) return "aprobado";
  return "promocionado";
}

// validar datos de entrada
function validarDatosAlumno(nombre, notas) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { valido: false, error: "El nombre es obligatorio y debe ser un texto valido." };
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return { valido: false, error: "Se deben ingresar exactamente 3 notas en un arreglo." };
  }

  const notasValidas = notas.every(n => typeof n === 'number' && !isNaN(n) && n >= 1 && n <= 10);
  if (!notasValidas) {
    return { valido: false, error: "Todas las notas deben ser numeros entre 1 y 10." };
  }

  return { valido: true };
}

// 1. OBTENER TODOS LOS ALUMNOS 
app.get('/api/alumnos', (req, res) => {
  const listado = alumnos.map(al => {
    const promedio = calcularPromedio(al.notas);
    return {
      id: al.id,
      nombre: al.nombre,
      notas: al.notas,
      promedio,
      condicion: determinarCondicion(promedio)
    };
  });

  res.status(200).json({ datos: listado });
});

// 2. OBTENER UN ALUMNO POR ID O NOMBRE
app.get('/api/alumnos/:criterio', (req, res) => {
  const { criterio } = req.params;
  
  const alumno = alumnos.find(a => 
    a.id === Number(criterio) || 
    a.nombre.toLowerCase() === criterio.toLowerCase()
  );

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  const promedio = calcularPromedio(alumno.notas);

  res.status(200).json({
    datos: {
      id: alumno.id,
      nombre: alumno.nombre,
      notas: alumno.notas,
      promedio,
      condicion: determinarCondicion(promedio)
    }
  });
});

// 3. CREAR NUEVO ALUMNO
app.post('/api/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  const validacion = validarDatosAlumno(nombre, notas);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const existeNombre = alumnos.some(
    a => a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (existeNombre) {
    return res.status(400).json({ error: "Ya existe un alumno registrado con ese nombre." });
  }

  const nuevoAlumno = {
    id: proximoId++,
    nombre: nombre.trim(),
    notas
  };

  alumnos.push(nuevoAlumno);

  const promedio = calcularPromedio(nuevoAlumno.notas);

  res.status(201).json({
    mensaje: "Alumno creado con exito.",
    datos: {
      ...nuevoAlumno,
      promedio,
      condicion: determinarCondicion(promedio)
    }
  });
});

// 4. MODIFICAR ALUMNO
app.put('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nombre, notas } = req.body;

  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  const validacion = validarDatosAlumno(nombre, notas);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const duplicado = alumnos.some(
    a => a.id !== id && a.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (duplicado) {
    return res.status(400).json({ error: "Ya existe otro alumno con ese nombre." });
  }

  alumno.nombre = nombre.trim();
  alumno.notas = notas;

  const promedio = calcularPromedio(alumno.notas);

  res.status(200).json({
    mensaje: "Alumno actualizado con exito.",
    datos: {
      ...alumno,
      promedio,
      condicion: determinarCondicion(promedio)
    }
  });
});

// 5. ELIMINAR ALUMNO
app.delete('/api/alumnos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alumnos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  alumnos.splice(index, 1);
  res.status(200).json({ mensaje: "Alumno eliminado correctamente." });
});

app.listen(PORT, () => {
  console.log(`Servidor Ejercicio 2 corriendo en http://localhost:${PORT}`);
});