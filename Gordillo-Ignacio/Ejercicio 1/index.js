import express from "express";

const app = express();
app.use(express.json());

let rectangulos = [];
let ultimoId = 0;

// Datos derivados: se calculan al responder, no se guardan en el arreglo
const conCalculos = (r) => ({
  ...r,
  perimetro: 2 * (r.base + r.altura),
  superficie: r.base * r.altura,
  esCuadrado: r.base === r.altura,
});

const esMedidaValida = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;
const esIdValido = (id) => Number.isInteger(id) && id > 0;

// GET /rectangulos?cuadrado=true|false
app.get("/rectangulos", (req, res) => {
  const { cuadrado } = req.query;
  if (cuadrado !== undefined && cuadrado !== "true" && cuadrado !== "false") {
    return res.status(400).json({ error: "cuadrado debe ser true o false" });
  }

  let resultado = rectangulos.map(conCalculos);
  if (cuadrado !== undefined) {
    resultado = resultado.filter((r) => r.esCuadrado === (cuadrado === "true"));
  }
  res.json(resultado);
});

app.get("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const rect = rectangulos.find((r) => r.id === id);
  if (!rect) return res.status(404).json({ error: "Rectángulo no encontrado" });

  res.json(conCalculos(rect));
});

app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body ?? {};
  if (!esMedidaValida(base) || !esMedidaValida(altura)) {
    return res.status(400).json({ error: "base y altura deben ser números mayores a 0" });
  }

  const rect = { id: ++ultimoId, base, altura };
  rectangulos.push(rect);
  res.status(201).json(conCalculos(rect));
});

app.put("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const { base, altura } = req.body ?? {};
  if (!esMedidaValida(base) || !esMedidaValida(altura)) {
    return res.status(400).json({ error: "base y altura deben ser números mayores a 0" });
  }

  const rect = rectangulos.find((r) => r.id === id);
  if (!rect) return res.status(404).json({ error: "Rectángulo no encontrado" });

  rect.base = base;
  rect.altura = altura;
  res.json(conCalculos(rect));
});

app.delete("/rectangulos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!esIdValido(id)) return res.status(400).json({ error: "id inválido" });

  const existe = rectangulos.some((r) => r.id === id);
  if (!existe) return res.status(404).json({ error: "Rectángulo no encontrado" });

  rectangulos = rectangulos.filter((r) => r.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Ejercicio 1 escuchando en http://localhost:3000"));