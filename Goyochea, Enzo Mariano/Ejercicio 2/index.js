import express from "express"

const app = express();

app.use(express.json());

let listaAlumnos = [ // Un placeholder
  {
    id: 1,
    nombreAlumno: 'Mariano Goyochea',
    nota1: 4,
    nota2: 4,
    nota3: 4,
    promedio: 4,
    estadoAcademico: "Reprobado/a",
  }
];



app.get("/alumnos", (req, res) => {
  return res.send(listaAlumnos)
})

//////////////////////////////////

// Agregar alumno
app.post("/alumnos/agregar", (req, res) =>{
  
  const Alumno = 
  {
    nombreAlumno: 'Lionel Messi',
    nota1: 10,
    nota2: 10,
    nota3: 10
  }

  // Validar caracteres en nombre

  if (
  typeof Alumno.nombreAlumno !== "string" ||
  !Alumno.nombreAlumno.trim() ||
  /* Regla para que permita caracteres existentes en nombres
  del alfabeto latino multilenguaje, como Agustín Muñoz o Mary-Beth O'Donell
  */
  !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(Alumno.nombreAlumno.trim()) //
) {
  return res.status(400).json({
    error: "Nombre inválido. Solo letras, espacios, guiones y apóstrofes.",
  });
}

  // Revisar si el nombre ya existe
 const nombreNormalizado = Alumno.nombreAlumno.trim().toLowerCase(); //

  const yaExiste = listaAlumnos.some(
    (a) => a.nombreAlumno.toLowerCase() === nombreNormalizado
  );

  if (yaExiste) {
    return res.status(400).json({
      error: "Ya existe un alumno con este nombre.",
    });
  }
  // carga de notas y validacion
  const n1 = Number(Alumno.nota1);
  const n2 = Number(Alumno.nota2);
  const n3 = Number(Alumno.nota3);

  if (
    isNaN(n1) || isNaN(n2) || isNaN(n3) ||
    n1 < 0 || n1 > 10 ||
    n2 < 0 || n2 > 10 ||
    n3 < 0 || n3 > 10
  ) {
    return res.status(400).json({
      error: "Las notas deben ser números entre 0 y 10.",
    });
  }

  console.log("Validacion OK")


  // Modulo de calculos
  const promedio = Number(((n1 + n2 + n3) / 3).toFixed(2));

  let estadoAcademico;
  if (promedio < 6) {
    estadoAcademico = "Reprobado/a";
  } else if (promedio < 8) {
    estadoAcademico = "Aprobado/a"; // mayor o igual a 6 y menor que 8
  } else {
    estadoAcademico = "Promocionado/a"; // mayor o igual a 8
  }


  // Carga de datos para un nuevo alumno
const nuevoAlumno = {
    id: listaAlumnos.length + 1,
    nombreAlumno: Alumno.nombreAlumno.trim(),
    nota1: n1,
    nota2: n2,
    nota3: n3,
    promedio,
    estadoAcademico,
  };

  listaAlumnos.push(nuevoAlumno);

  return res.status(201).json({
    mensaje: "Alumno agregado correctamente",
    alumno: nuevoAlumno,
  });
});


//////////////////////////////////

// Modificar alumno

app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  // Buscar el alumno
  const indiceAlumnos = listaAlumnos.findIndex((a) => a.id === id);

  if (indiceAlumnos === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado.",
    });
  }
  
  // Cargar nuevos datos a ese id
  const Alumno = 
  {
    nombreAlumno: 'Mariano Goyochea',
    nota1: 8,
    nota2: 7,
    nota3: 8
  }



  // Validacion de nombre
  if (
    typeof Alumno.nombreAlumno !== "string" ||
    !Alumno.nombreAlumno.trim() ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(Alumno.nombreAlumno.trim())
  ) {
    return res.status(400).json({
      error: "Nombre inválido. Solo letras, espacios, guiones y apóstrofes.",
    });
  }

  const nombreNormalizado = Alumno.nombreAlumno.trim().toLowerCase();

  // Verificar que el nombre no haga conflicto con otro alumno
  const yaExiste = listaAlumnos.some(
    (a) =>
      a.id !== id && 
      a.nombreAlumno.toLowerCase() === nombreNormalizado
  );

  if (yaExiste) {
    return res.status(400).json({
      error: "Ya existe un alumno con este nombre.",
    });
  }

const n1 = Number(Alumno.nota1);
  const n2 = Number(Alumno.nota2);
  const n3 = Number(Alumno.nota3);

  if (
    isNaN(n1) || isNaN(n2) || isNaN(n3) ||
    n1 < 0 || n1 > 10 ||
    n2 < 0 || n2 > 10 ||
    n3 < 0 || n3 > 10
  ) {
    return res.status(400).json({
      error: "Las notas deben ser números entre 0 y 10.",
    });
  }

  const promedio = Number(((n1 + n2 + n3) / 3).toFixed(2));

  let estadoAcademico;
  if (promedio < 6) {
    estadoAcademico = "Reprobado/a";
  } else if (promedio < 8) {
    estadoAcademico = "Aprobado/a";
  } else {
    estadoAcademico = "Promocionado/a";
  }

  listaAlumnos[indiceAlumnos] = {
    id, // se mantiene el mismo ID
    nombreAlumno: Alumno.nombreAlumno.trim(),
    nota1: n1,
    nota2: n2,
    nota3: n3,
    promedio,
    estadoAcademico,
  };

  return res.json({
    mensaje: "Alumno modificado correctamente",
    alumno: listaAlumnos[indiceAlumnos],
  });
});

//////////////////////////////////

// Eliminar alumno

app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);

  const indiceAlumno = listaAlumnos.findIndex((a) => a.id === id);

  if (indiceAlumno === -1) {
    return res.status(404).json({
      error: "Alumno no encontrado.",
    });
  }

  listaAlumnos.splice(indiceAlumno, 1);

  return res.json({
    mensaje: "Alumno eliminado correctamente"
  });
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});