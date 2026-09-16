// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Servicio de dominio / Lógica de negocio
function analizarRectangulo(base, altura) {
  const b = parseFloat(base);
  const h = parseFloat(altura);

  return {
    base: b,
    altura: h,
    perimetro: 2 * (b + h),
    superficie: b * h,
    esCuadrado: b === h
  };
}

// Endpoint
app.post('/api/rectangulos/calcular', (req, res) => {
  const { base, altura } = req.body;

  // Validaciones
  if (base === undefined || altura === undefined) {
    return res.status(400).json({ error: 'Se requieren las propiedades "base" y "altura".' });
  }

  const numBase = Number(base);
  const numAltura = Number(altura);

  if (isNaN(numBase) || isNaN(numAltura) || numBase <= 0 || numAltura <= 0) {
    return res.status(400).json({ error: '"base" y "altura" deben ser números mayores a 0.' });
  }

  const resultado = analizarRectangulo(numBase, numAltura);
  return res.status(200).json({ status: 'success', data: resultado });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});