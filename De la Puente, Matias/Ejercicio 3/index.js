const express = require('express');
const app = express();

app.use(express.json());


app.post('/api/rectangulos/calcular', (req, res) => {

  const { base, altura } = req.body;


  if (base === undefined || altura === undefined) {
    return res.status(400).json({ error: 'Por favor, envía tanto la base como la altura.' });

    
  }

  const baseNum = Number(base);
  const alturaNum = Number(altura);


  if (isNaN(baseNum) || isNaN(alturaNum)) {
    return res.status(400).json({ error: 'La base y la altura tienen que ser números.' });

  }


  if (baseNum <= 0 || alturaNum <= 0) {
    return res.status(400).json({ error: 'Los valores tienen que ser mayores a cero.' });


  }
  const perimetro = (baseNum * 2) + (alturaNum * 2);
  const superficie = baseNum * alturaNum;
  
  const esCuadrado = baseNum === alturaNum;


  return res.status(200).json({
    mensaje: esCuadrado ? '¡Es un cuadrado!' : 'Es un rectángulo',
    base: baseNum,
    altura: alturaNum,
    perimetro: perimetro,
    superficie: superficie,
    esCuadrado: esCuadrado


  });
});

app.get('/api/rectangulos/calcular', (req, res) => {
  // En GET, los datos vienen dentro de req.query
  const { base, altura } = req.query;

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  if (!base || !altura) {
    return res.status(400).json({ error: 'Falta ingresar la base o la altura en la URL.' });

  }

  if (isNaN(baseNum) || isNaN(alturaNum) || baseNum <= 0 || alturaNum <= 0) {
    return res.status(400).json({ error: 'Ingresa valores numéricos válidos y mayores a cero.' });
  }

  const perimetro = (baseNum * 2) + (alturaNum * 2);
  const superficie = baseNum * alturaNum;
  const esCuadrado = baseNum === alturaNum;

  return res.status(200).json({
    mensaje: esCuadrado ? '¡Es un cuadrado!' : 'Es un rectángulo',
    base: baseNum,
    altura: alturaNum,
    perimetro: perimetro,
    superficie: superficie,
    esCuadrado: esCuadrado


  });


});

app.listen(3000, () => {
  console.log('Servidor andando en http://localhost:3000 🚀');

  
});