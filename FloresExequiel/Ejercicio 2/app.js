import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

// ---------- Constantes ----------
const CANTIDAD_NOTAS = 3;
const NOTA_MIN = 0;
const NOTA_MAX = 10;
const LONGITUD_MAX_NOMBRE = 100;
const CONDICIONES = ["reprobado", "aprobado", "promocionado"];

// ---------- Almacenamiento interno (solo datos base) ----------
let alumnos = [
  { id: 1, nombre: "Ana Pérez", notas: [9, 8, 10] },
  { id: 2, nombre: "Luis Gómez", notas: [6, 7, 7] },
  { id: 3, nombre: "Marta Ruiz", notas: [4, 5, 3] },
];
let siguienteId = 4;

// ---------- Datos derivados (no se almacenan) ----------
const redondear = (n) => Math.round(n * 100) / 100;

function calcularPromedio(notas) {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return redondear(suma / notas.length);
}

function calcularCondicion(promedio) {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
}

function presentarAlumno(alumno) {
  const promedio = calcularPromedio(alumno.notas);
  return {
    id: alumno.id,
    nombre: alumno.nombre,
    notas: [...alumno.notas],
    promedio,
    condicion: calcularCondicion(promedio),
  };
}

// ---------- Validaciones ----------
function validarId(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id) || Number(id) === 0) {
    return res
      .status(400)
      .json({ errores: ["El id debe ser un entero positivo"] });
  }
  req.alumnoId = Number(id);
  next();
}

function validarAlumno(req, res, next) {
  const body = req.body;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res
      .status(400)
      .json({ errores: ["El cuerpo debe ser un objeto JSON"] });
  }

  const { nombre, notas } = body;
  const errores = [];

  if (typeof nombre !== "string" || nombre.trim() === "") {
    errores.push("'nombre' es obligatorio y debe ser un texto no vacío");
  } else if (nombre.trim().length > LONGITUD_MAX_NOMBRE) {
    errores.push(
      `'nombre' no puede superar los ${LONGITUD_MAX_NOMBRE} caracteres`,
    );
  }

  if (!Array.isArray(notas) || notas.length !== CANTIDAD_NOTAS) {
    errores.push(
      `'notas' debe ser un arreglo de exactamente ${CANTIDAD_NOTAS} valores`,
    );
  } else {
    notas.forEach((nota, i) => {
      if (
        typeof nota !== "number" ||
        !Number.isFinite(nota) ||
        nota < NOTA_MIN ||
        nota > NOTA_MAX
      ) {
        errores.push(
          `La nota ${i + 1} debe ser un número entre ${NOTA_MIN} y ${NOTA_MAX}`,
        );
      }
    });
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  req.datos = { nombre: nombre.trim(), notas: [...notas] };
  next();
}

const existeNombre = (nombre, idExcluido = null) =>
  alumnos.some(
    (a) =>
      a.id !== idExcluido && a.nombre.toLowerCase() === nombre.toLowerCase(),
  );

// ---------- Rutas ----------
const router = express.Router();

// Listar alumnos (filtro opcional por condición)
router.get("/", (req, res) => {
  const { condicion } = req.query;

  if (condicion !== undefined && !CONDICIONES.includes(condicion)) {
    return res.status(400).json({
      errores: [`'condicion' debe ser uno de: ${CONDICIONES.join(", ")}`],
    });
  }

  let resultado = alumnos.map(presentarAlumno);
  if (condicion) {
    resultado = resultado.filter((a) => a.condicion === condicion);
  }
  res.json(resultado);
});

// Consultar un alumno (incluye promedio y condición)
router.get("/:id", validarId, (req, res) => {
  const alumno = alumnos.find((a) => a.id === req.alumnoId);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  res.json(presentarAlumno(alumno));
});

// Crear alumno
router.post("/", validarAlumno, (req, res) => {
  const { nombre, notas } = req.datos;

  if (existeNombre(nombre)) {
    return res
      .status(409)
      .json({ error: `Ya existe un alumno con el nombre '${nombre}'` });
  }

  const nuevo = { id: siguienteId++, nombre, notas };
  alumnos.push(nuevo);

  res.status(201).location(`/alumnos/${nuevo.id}`).json(presentarAlumno(nuevo));
});

// Modificar alumno (reemplazo completo)
router.put("/:id", validarId, validarAlumno, (req, res) => {
  const alumno = alumnos.find((a) => a.id === req.alumnoId);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  const { nombre, notas } = req.datos;

  if (existeNombre(nombre, alumno.id)) {
    return res
      .status(409)
      .json({ error: `Ya existe un alumno con el nombre '${nombre}'` });
  }

  alumno.nombre = nombre;
  alumno.notas = notas;

  res.json(presentarAlumno(alumno));
});

// Eliminar alumno
router.delete("/:id", validarId, (req, res) => {
  const indice = alumnos.findIndex((a) => a.id === req.alumnoId);
  if (indice === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  alumnos.splice(indice, 1);
  res.status(204).send();
});

app.use("/alumnos", router);

// ---------- 404 y errores ----------
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ errores: ["El cuerpo de la petición no es un JSON válido"] });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`Ejercicio 2 en http://localhost:${PORT}`));
