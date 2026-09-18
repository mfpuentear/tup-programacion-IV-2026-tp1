import express, { json } from "express";
const app = express();

app.use(express.json());
let Alumnos = [];

app.get("/Alumnos", (req, res) => {
  res.send(Alumnos);
});

app.post("/Alumno", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre.length || notas.length !== 3) {
    res.status(400).send("Faltan datos, ingrese nombre y notas");
    return;
  }

  if (Alumnos.find((a) => a.nombre === nombre)) {
    res.status(400).send("Ya existe un alumno con ese nombre");
    return;
  }

  Alumnos.push({ nombre, notas });
  res.send("alumno guardado");
});

app.get("/condicion", (req, res) => {
  const notas = Alumnos.map((a) => {
    const promedio =
      a.notas.reduce((acum, nota) => acum + nota, 0) / a.notas.length;

    let condicion = "";
    if (promedio < 6) {
      condicion = "reprobado";
    } else if (promedio < 8) {
      condicion = "aprobado";
    } else {
      condicion = "promocionado";
    }
    return { ...a, promedio, condicion };
  });
  res.json(notas);
});

const port = 3000;
app.listen(port, () => {
  console.log("Servidor levantado");
});
