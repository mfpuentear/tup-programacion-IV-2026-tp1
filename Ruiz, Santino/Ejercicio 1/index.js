import express from 'express'

const app = express()

app.use(express.json())

app.post('/rectangulos/calcular', (req, res) => {
  const { ancho, alto } = req.body;

  if (typeof ancho !== 'number' || typeof alto !== 'number' || ancho <= 0 || alto <= 0) {
    return res.status(400).json({
        error: 'Los parametros "ancho" y "alto" deben ser números positivos.'
    })
  }
    const perimetro = 2 * (ancho + alto);
    const superficie = ancho * alto;
    const esCuadrado = ancho === alto;
    
    return res.json({
      ancho,
      alto,
      perimetro,
      superficie,
      esCuadrado
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})