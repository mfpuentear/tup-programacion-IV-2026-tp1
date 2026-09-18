const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

// Devolvera el perimetro, la superficie e indica si es cuadrado o rectangulo
app.get("/rectangulos", (req, res) => {
  const base = parseFloat(req.query.base);
  const altura = parseFloat(req.query.altura);

  if (isNaN(base) || isNaN(altura)) {
    return res
      .status(400)
      .json({ error: "La base y la altura deben ser numeros" });
  }

  if (base <= 0 || altura <= 0) {
    return res
      .status(400)
      .json({ error: "La base y la altura deben ser mayores a 0" });
  }

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;
  const esCuadrado = base === altura;

  return res.status(200).json({
    base,
    altura,
    perimetro,
    superficie,
    esCuadrado,
    tipo: esCuadrado ? "cuadrado" : "rectángulo",
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
