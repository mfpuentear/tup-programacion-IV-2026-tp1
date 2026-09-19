import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let rectangulos = [
  { id: 1, base: 10, altura: 5 },
  { id: 2, base: 4, altura: 4 },
];
let nextId = 3; //

const serializarRectangulo = (figura) => {
  const superficie = figura.base * figura.altura;
  const perimetro = 2 * (figura.base + figura.altura);
  const esCuadrado = figura.base === figura.altura;
  return {
    ...figura,
    superficie,
    perimetro,
    esCuadrado,
    clasificacion: esCuadrado ? "cuadrado" : "rectángulo",
  };
};

// Consultar rectángulos (con filtro opcional por tipo)
app.get("/rectangulos", (req, res) => {
  let resultado = [...rectangulos]; //
  const { tipo } = req.query;

  if (tipo) {
    const tipoNormalizado = tipo.toLowerCase();
    if (tipoNormalizado === "cuadrado") {
      resultado = resultado.filter((r) => r.base === r.altura);
    } else if (tipoNormalizado === "rectangulo") {
      resultado = resultado.filter((r) => r.base !== r.altura);
    } else {
      return res.status(400).send("Parámetro 'tipo' inválido (usar 'cuadrado' o 'rectangulo')");
    }
  }

  res.send(resultado.map(serializarRectangulo));
});

// Consultar por ID
app.get("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id); //
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  res.send(serializarRectangulo(figura));
});

// Crear rectángulo
app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body; //

  if (
    typeof base !== "number" ||
    typeof altura !== "number" ||
    base <= 0 ||
    altura <= 0
  ) {
    return res.status(400).send("Base y altura deben ser números positivos mayores a 0");
  }

  const nuevo = { id: nextId++, base, altura };
  rectangulos.push(nuevo);

  res.status(201).send(serializarRectangulo(nuevo));
});

// Modificar rectángulo
app.put("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  const { base, altura } = req.body;
  if (
    typeof base !== "number" ||
    typeof altura !== "number" ||
    base <= 0 ||
    altura <= 0
  ) {
    return res.status(400).send("Base y altura deben ser números positivos mayores a 0");
  }

  figura.base = base;
  figura.altura = altura;

  res.send(serializarRectangulo(figura));
});

// Quitar rectángulo
app.delete("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).send("ID inválido");
  }

  const index = rectangulos.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  const [eliminado] = rectangulos.splice(index, 1);
  res.send(serializarRectangulo(eliminado));
});

app.listen(port, () => console.log(`Servidor en puerto ${port}`));