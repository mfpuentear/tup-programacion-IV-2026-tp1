import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/v1/rectangulos/calcular', (req, res) => {
  const { base, altura } = req.query;

  if (!base || !altura) {
    return res.status(400).json({ error: 'Faltan parámetros: base y altura son obligatorios.' });
  }

  const b = parseFloat(base);
  const a = parseFloat(altura);

  if (isNaN(b) || isNaN(a) || b <= 0 || a <= 0) {
    return res.status(400).json({ error: 'La base y la altura deben ser números mayores a 0.' });
  }

  const perimetro = 2 * (b + a);
  const superficie = b * a;
  const esCuadrado = b === a;

  res.json({
    base: b,
    altura: a,
    perimetro,
    superficie,
    esCuadrado
  });
});

app.listen(PORT, () => console.log(`Ejercicio 1 activo en puerto ${PORT}`));