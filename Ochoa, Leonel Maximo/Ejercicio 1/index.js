const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3001;

/** Solo se guardan datos base. Perímetro, superficie y esCuadrado se calculan al responder. */
const rectangulos = [];
let siguienteId = 1;

function esNumeroValido(valor) {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0;
}

function enriquecer(rectangulo) {
  const { id, base, altura } = rectangulo;
  return {
    id,
    base,
    altura,
    perimetro: 2 * (base + altura),
    superficie: base * altura,
    esCuadrado: base === altura,
  };
}

function validarLados(body) {
  const { base, altura } = body ?? {};

  if (!esNumeroValido(base) || !esNumeroValido(altura)) {
    return "base y altura deben ser números mayores a 0";
  }

  return null;
}

// Listar todos
app.get("/rectangulos", (_req, res) => {
  res.json(rectangulos.map(enriquecer));
});

// Obtener uno por id
app.get("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const encontrado = rectangulos.find((r) => r.id === id);
  if (!encontrado) {
    return res.status(404).json({ error: "rectángulo no encontrado" });
  }

  res.json(enriquecer(encontrado));
});

// Crear
app.post("/rectangulos", (req, res) => {
  const error = validarLados(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const nuevo = {
    id: siguienteId++,
    base: req.body.base,
    altura: req.body.altura,
  };

  rectangulos.push(nuevo);
  res.status(201).json(enriquecer(nuevo));
});

// Reemplazar (PUT)
app.put("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const error = validarLados(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const indice = rectangulos.findIndex((r) => r.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "rectángulo no encontrado" });
  }

  rectangulos[indice] = {
    id,
    base: req.body.base,
    altura: req.body.altura,
  };

  res.json(enriquecer(rectangulos[indice]));
});

// Eliminar
app.delete("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id debe ser un entero positivo" });
  }

  const indice = rectangulos.findIndex((r) => r.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "rectángulo no encontrado" });
  }

  const eliminado = rectangulos.splice(indice, 1)[0];
  res.json(enriquecer(eliminado));
});

app.listen(PORT, () => {
  console.log(`API Ejercicio 1 escuchando en http://localhost:${PORT}`);
});
