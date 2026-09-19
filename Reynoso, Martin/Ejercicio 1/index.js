import express from 'express';
const app = express();

app.use(express.json());

function calcularRectangulo(anchoQuery, altoQuery) {
  const ancho = Number(anchoQuery);
  const alto = Number(altoQuery);

  if (!anchoQuery || !altoQuery || isNaN(ancho) || isNaN(alto) || ancho <= 0 || alto <= 0) {
    throw new Error('Los parámetros "ancho" y "alto" son obligatorios y deben ser números mayores a 0.');
  }

  return {
    dimensiones: { ancho, alto },
    perimetro: 2 * (ancho + alto),
    superficie: ancho * alto,
    esCuadrado: ancho === alto
  };
}

app.get('/api/rectangulos/calcular', (req, res) => {
  try {
    const { ancho, alto } = req.query;
    const resultado = calcularRectangulo(ancho, alto);

    return res.status(200).json({
      exito: true,
      datos: resultado
    });
  } catch (error) {
    return res.status(400).json({
      exito: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});