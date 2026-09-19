import express, { json } from "express";
const app = express();

app.use(express.json());
let tareas = [];

app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  if (estado) {
    const tareasFiltradas = tareas.filter((t) => t.estado === estado)
    return res.send(tareasFiltradas);
  }

  res.send(tareas);
});

app.post("/tareas", (req, res) => {
  const {nombreTarea, estado} = req.body

  if (!nombreTarea) {
    return res.status(400).send("nombre de la tarea obligatorio")
  }  

  const encontrado=tareas.find((t) => t.nombreTarea === nombreTarea)
  if (encontrado ) {
    return res.status(400).send("la tarea ya existe")
  }

  const tarea = {nombreTarea, estado}
  tareas.push(tarea)

  res.status(201).json({ 
    mensaje: "Tarea agregada correctamente",
    tarea
   });
});

const port = 3000;
app.listen(port, () => {
  console.log("Servidor levantado");
});

