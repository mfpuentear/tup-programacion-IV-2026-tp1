const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Ruta de bienvenida y ayuda
app.get('/', (req, res) => {
  res.send('API de cálculo de rectángulos y cuadrados. Consultar endpoint: GET /rectangulos?base=VALOR&altura=VALOR');
});

// Endpoint principal para consultar perímetro y superficie
app.get('/rectangulos', (req, res) => {
  const { base, altura } = req.query;

  // 1. Verificamos que ambos parámetros estén presentes
  if (base === undefined || altura === undefined) {
    return res.status(400).json({
      error: 'Se deben ingresar ambos parámetros obligatorios: "base" y "altura".'
    });
  }

  // 2. Convertimos a tipo numérico
  const baseNum = Number(base);
  const alturaNum = Number(altura);

  // 3. Validamos que sean números válidos y mayores a 0
  if (isNaN(baseNum) || isNaN(alturaNum)) {
    return res.status(400).json({
      error: 'Los parámetros "base" y "altura" deben ser valores numéricos válidos.'
    });
  }

  if (baseNum <= 0 || alturaNum <= 0) {
    return res.status(400).json({
      error: 'Tanto la "base" como la "altura" deben ser números estrictamente mayores a cero.'
    });
  }

  // 4. Cálculos geométricos
  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;
  const esCuadrado = (baseNum === alturaNum);

  // 5. Respuesta en formato JSON
  return res.json({
    base: baseNum,
    altura: alturaNum,
    perimetro,
    superficie,
    esCuadrado
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor del Ejercicio 1 escuchando en el puerto ${PORT}`);
});
