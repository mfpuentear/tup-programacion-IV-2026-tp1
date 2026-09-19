const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/rectangulos", (req, res) => {
  const { ancho, alto } = req.query;

  if (ancho === undefined || alto === undefined) {
    return res.status(400).json({
      error: "Los parámetros ancho y alto son obligatorios"
    });
  }

  const anchoNumero = Number(ancho);
  const altoNumero = Number(alto);

  if (!Number.isFinite(anchoNumero) || !Number.isFinite(altoNumero)) {
    return res.status(400).json({
      error: "El ancho y el alto deben ser valores numéricos"
    });
  }

  if (anchoNumero <= 0 || altoNumero <= 0) {
    return res.status(400).json({
      error: "El ancho y el alto deben ser mayores que cero"
    });
  }

  const perimetro = 2 * (anchoNumero + altoNumero);

  const superficie = anchoNumero * altoNumero;

  const esCuadrado = anchoNumero === altoNumero;

  return res.status(200).json({
    ancho: anchoNumero,
    alto: altoNumero,
    perimetro,
    superficie,
    esCuadrado
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Recurso no encontrado"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});