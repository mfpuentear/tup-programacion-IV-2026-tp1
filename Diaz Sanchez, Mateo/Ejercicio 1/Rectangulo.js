import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const rectangulos = [];
let siguienteId = 1;

const validarNumeroPositivo = (valor, nombreCampo) => {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero <= 0) {
    const error = new Error(`${nombreCampo} debe ser un número positivo.`);
    error.statusCode = 400;
    throw error;
  }

  return numero;
};

const calcularDatos = (rectangulo) => ({
  ...rectangulo,
  perimetro: 2 * (rectangulo.base + rectangulo.altura),
  superficie: rectangulo.base * rectangulo.altura,
  esCuadrado: rectangulo.base === rectangulo.altura,
});

app.get("/rectangulos", (req, res) => {
  res.json(rectangulos.map((rectangulo) => calcularDatos(rectangulo)));
});

app.get("/rectangulos/:id", (req, res) => {
  const rectangulo = rectangulos.find((item) => item.id === Number(req.params.id));

  if (!rectangulo) {
    return res.status(404).json({ message: "Rectángulo no encontrado." });
  }

  return res.json(calcularDatos(rectangulo));
});

app.post("/rectangulos", (req, res) => {
  try {
    const base = validarNumeroPositivo(req.body.base, "base");
    const altura = validarNumeroPositivo(req.body.altura, "altura");

    const rectangulo = {
      id: siguienteId++,
      base,
      altura,
    };

    rectangulos.push(rectangulo);

    return res.status(201).json(calcularDatos(rectangulo));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.put("/rectangulos/:id", (req, res) => {
  const rectangulo = rectangulos.find((item) => item.id === Number(req.params.id));

  if (!rectangulo) {
    return res.status(404).json({ message: "Rectángulo no encontrado." });
  }

  try {
    rectangulo.base = validarNumeroPositivo(req.body.base ?? rectangulo.base, "base");
    rectangulo.altura = validarNumeroPositivo(req.body.altura ?? rectangulo.altura, "altura");

    return res.json(calcularDatos(rectangulo));
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
});

app.delete("/rectangulos/:id", (req, res) => {
  const posicion = rectangulos.findIndex((item) => item.id === Number(req.params.id));

  if (posicion === -1) {
    return res.status(404).json({ message: "Rectángulo no encontrado." });
  }

  const [eliminado] = rectangulos.splice(posicion, 1);

  return res.json({
    message: "Rectángulo eliminado correctamente.",
    rectangulo: calcularDatos(eliminado),
  });
});

app.listen(port, () => {
  console.log(`API de rectángulos escuchando en http://localhost:${port}`);
});
