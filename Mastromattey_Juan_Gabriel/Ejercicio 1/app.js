const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// calculo
function calcularPerimetro(base, altura) {
  return 2 * (base + altura);
}

function calcularSuperficie(base, altura) {
  return base * altura;
}

function esCuadrado(base, altura) {
  return base === altura;
}

app.get("/rectangulos", (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  // base
  if (!Number.isFinite(base) || base <= 0) {
    return res.status(400).json({
      error: "La base debe ser un numero mayor que 0",
    });
  }

  // altura
  if (!Number.isFinite(altura) || altura <= 0) {
    return res.status(400).json({
      error: "La altura debe ser un numero mayor que 0",
    });
  }

  const perimetro = calcularPerimetro(base, altura);
  const superficie = calcularSuperficie(base, altura);
  const cuadrado = esCuadrado(base, altura);

  res.status(200).json({
    base,
    altura,
    perimetro,
    superficie,
    esCuadrado: cuadrado,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
