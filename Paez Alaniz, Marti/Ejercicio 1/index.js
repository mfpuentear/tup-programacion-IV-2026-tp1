const express = require("express");

const app = express();
const PUERTO = 3001;

// GET /rectangulos?base=4&altura=4
// Calcula perímetro y superficie de un rectángulo, e indica si es cuadrado.
// Es un GET (no un POST) porque no crea ni modifica nada: solo calcula algo
// a partir de los valores recibidos por query string.
app.get("/rectangulos", (req, res) => {
  const { base, altura } = req.query;

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  const esValido = (valor, valorOriginal) =>
    valorOriginal !== undefined && !Number.isNaN(valor) && valor > 0;

  if (!esValido(baseNum, base) || !esValido(alturaNum, altura)) {
    return res.status(400).json({
      error:
        "Los parámetros 'base' y 'altura' son obligatorios y deben ser números mayores a 0",
    });
  }

  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;
  const esCuadrado = baseNum === alturaNum;

  res.status(200).json({
    base: baseNum,
    altura: alturaNum,
    perimetro,
    superficie,
    esCuadrado,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

app.listen(PUERTO, () => {
  console.log(`Ejercicio 1 escuchando en http://localhost:${PUERTO}`);
});
