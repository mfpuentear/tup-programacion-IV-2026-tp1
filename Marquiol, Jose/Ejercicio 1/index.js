import express from "express";

const app = express();
const port = 3001;

app.use(express.json());

let rectangulos = [
  { id: 1, base: 10, altura: 5 },
  { id: 2, base: 8, altura: 8 },
  { id: 3, base: 12, altura: 4 },
];

let nextId = 4;

app.get("/", (req, res) => {
  res.send("API de rectángulos funcionando");
});

app.get("/rectangulos", (req, res) => {
  let rectangulosFiltrados = [...rectangulos];

  const cuadrado = req.query.cuadrado;

  if (cuadrado) {
    if (cuadrado !== "true" && cuadrado !== "false") {
      return res.status(400).send("El valor de cuadrado debe ser true o false");
    }

    const esCuadrado = cuadrado === "true";

    rectangulosFiltrados = rectangulosFiltrados.filter(
      (r) => (r.base === r.altura) === esCuadrado,
    );
  }

  let resultado = [];

  rectangulosFiltrados.forEach((r) => {
    resultado.push({
      id: r.id,
      base: r.base,
      altura: r.altura,
      perimetro: 2 * (r.base + r.altura),
      superficie: r.base * r.altura,
      cuadrado: r.base === r.altura,
    });
  });

  res.send(resultado);
});

app.get("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const rectangulo = rectangulos.find((r) => r.id === id);

  if (!rectangulo) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  const resultado = {
    id: rectangulo.id,
    base: rectangulo.base,
    altura: rectangulo.altura,
    perimetro: 2 * (rectangulo.base + rectangulo.altura),
    superficie: rectangulo.base * rectangulo.altura,
    cuadrado: rectangulo.base === rectangulo.altura,
  };

  res.send(resultado);
});

app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  if (base === undefined || altura === undefined) {
    return res.status(400).send("La base y la altura son obligatorias");
  }

  if (
    typeof base !== "number" ||
    typeof altura !== "number" ||
    isNaN(base) ||
    isNaN(altura) ||
    base <= 0 ||
    altura <= 0
  ) {
    return res.status(400).send("La base y la altura deben ser números positivos");
  }

  const nuevoRectangulo = {
    id: nextId++,
    base,
    altura,
  };

  rectangulos.push(nuevoRectangulo);

  res.status(201).send(nuevoRectangulo);
});

app.put("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const rectanguloEncontrado = rectangulos.find((r) => r.id === id);

  if (!rectanguloEncontrado) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  const { base, altura } = req.body;

  if (base === undefined || altura === undefined) {
    return res.status(400).send("La base y la altura son obligatorias");
  }

  if (
    typeof base !== "number" ||
    typeof altura !== "number" ||
    isNaN(base) ||
    isNaN(altura) ||
    base <= 0 ||
    altura <= 0
  ) {
    return res.status(400).send("La base y la altura deben ser números positivos");
  }

  rectanguloEncontrado.base = base;
  rectanguloEncontrado.altura = altura;

  res.send(rectanguloEncontrado);
});

app.delete("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).send("Id inválido");
  }

  const rectanguloEncontrado = rectangulos.find((r) => r.id === id);

  if (!rectanguloEncontrado) {
    return res.status(404).send("Rectángulo no encontrado");
  }

  rectangulos = rectangulos.filter((r) => r.id !== id);

  res.send(rectanguloEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`);
});