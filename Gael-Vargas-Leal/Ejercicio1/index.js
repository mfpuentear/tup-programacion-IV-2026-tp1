import express from 'express';
const app = express();
const PORT = 3000;

app.use(express.json());


function validarDimensiones(alto, ancho) {
  const numAlto = Number(alto);
  const numAncho = Number(ancho);

  if (
    alto === undefined || 
    ancho === undefined ||
    isNaN(numAlto) || 
    isNaN(numAncho) || 
    !isFinite(numAlto) || 
    !isFinite(numAncho)
  ) {
    return { 
      valido: false, 
      error: "Los campos 'alto' y 'ancho' son obligatorios y deben ser números válidos." 
    };
  }

  if (numAlto <= 0 || numAncho <= 0) {
    return { 
      valido: false, 
      error: "Tanto 'alto' como 'ancho' deben ser valores mayores a cero." 
    };
  }

  return { valido: true, alto: numAlto, ancho: numAncho };
}

// Endpoint POST (Datos en el body JSON)
app.post('/api/rectangulos/calcular', (req, res) => {
  const { alto, ancho } = req.body;

  const validacion = validarDimensiones(alto, ancho);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const { alto: h, ancho: w } = validacion;
  const superficie = h * w;
  const perimetro = 2 * (h + w);
  const esCuadrado = h === w;

  return res.status(200).json({
    mensaje: "Cálculo realizado con éxito",
    datos: {
      alto: h,
      ancho: w,
      superficie,
      perimetro,
      esCuadrado,
      tipoFigura: esCuadrado ? "Cuadrado" : "Rectángulo"
    }
  });
});

// Endpoint GET (Datos mediante Query Parameters)
app.get('/api/rectangulos/calcular', (req, res) => {
  const { alto, ancho } = req.query;

  const validacion = validarDimensiones(alto, ancho);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }

  const { alto: h, ancho: w } = validacion;
  const superficie = h * w;
  const perimetro = 2 * (h + w);
  const esCuadrado = h === w;

  return res.status(200).json({
    mensaje: "Consulta realizada con éxito",
    datos: {
      alto: h,
      ancho: w,
      superficie,
      perimetro,
      esCuadrado,
      tipoFigura: esCuadrado ? "Cuadrado" : "Rectángulo"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Ejercicio 1 ejecutándose en http://localhost:${PORT}`);
});