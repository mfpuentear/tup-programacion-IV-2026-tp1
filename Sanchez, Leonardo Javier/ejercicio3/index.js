import express, { json } from "express";
const app = express();

app.use(express.json());
let tareas = [];

app.get("/tareas", (req, res) => {
  res.send(tareas);
});

const port = 3000;
app.listen(port, () => {
  console.log("Servidor levantado");
});

