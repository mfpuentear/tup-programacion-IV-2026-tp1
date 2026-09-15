const express = require('express');
const app = express();
const PORT = 3000;

app.get('/rectangulos', (req, res) => {
  const { base, altura } = req.query;

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  if (base === undefined || altura === undefined) {
    return res.status(400).json({
      error: 'Debe indicar los parámetros "base" y "altura"'
    });
  }

  if (isNaN(baseNum) || isNaN(alturaNum) || baseNum <= 0 || alturaNum <= 0) {
    return res.status(400).json({
      error: 'Los parámetros "base" y "altura" deben ser números mayores a 0'
    });
  }

  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;
  const esCuadrado = baseNum === alturaNum;

  res.json({
    base: baseNum,
    altura: alturaNum,
    perimetro,
    superficie,
    esCuadrado
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});