import express from 'express';

const app = express();

app.use(express.json());

//validación para base y altura
function validarDimensiones(req, res, next) {
  const base = parseFloat(req.query.base ?? req.body.base);
  const altura = parseFloat(req.query.altura ?? req.body.altura);

  if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
    return res.status(400).json({
      error: 'Parámetros inválidos. "base" y "altura" deben ser números positivos mayores a cero.'
    });
  }

  req.dimensiones = {
    base,
    altura,
    esCuadrado: base === altura
  };
  next();
}

//Endpoint de calculo completo
app.all('/api/rectangulo/calcular', validarDimensiones, (req, res) => {
  const { base, altura, esCuadrado } = req.dimensiones;
  const area = base * altura;
  const perimetro = 2 * (base + altura);

  res.json({
    figura: esCuadrado ? 'cuadrado' : 'rectangulo',
    esCuadrado,
    dimensiones: { base, altura },
    area,
    perimetro
  });
});

//Endpoint exclusivo para area/superficie
app.get('/api/rectangulo/area', validarDimensiones, (req, res) => {
  const { base, altura, esCuadrado } = req.dimensiones;
  res.json({
    figura: esCuadrado ? 'cuadrado' : 'rectangulo',
    esCuadrado,
    area: base * altura
  });
});

//Endpoint exclusivo para perimetro
app.get('/api/rectangulo/perimetro', validarDimensiones, (req, res) => {
  const { base, altura, esCuadrado } = req.dimensiones;
  res.json({
    figura: esCuadrado ? 'cuadrado' : 'rectangulo',
    esCuadrado,
    perimetro: 2 * (base + altura)
  });
});

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});

// "/api/rectangulo/calcular" todo junto (área + perímetro + tipo)
// "/api/rectangulo/area" solo área
// "/api/rectangulo/perimetro" solo perímetro