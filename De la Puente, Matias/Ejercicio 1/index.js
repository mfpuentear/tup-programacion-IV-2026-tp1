const express = require('express');
const app = express();
 
app.use(express.json());

function validarDimensiones(base, altura) {
  const b = Number(base);
  const h = Number(altura);

  if (base === undefined || altura === undefined) {
    return { ok: false, mensaje: 'Debe ingresar tanto la base como la altura.' };
  }

  if (isNaN(b) || isNaN(h)) {
    return { ok: false, mensaje: 'La base y la altura deben ser valores numéricos.' };
  }

  if (b <= 0 || h <= 0) {
    return { ok: false, mensaje: 'La base y la altura deben ser números mayores a 0.' };
  }

  return { ok: true, base: b, altura: h };

}




app.post('/api/rectangulos/calcular', (req, res) => {
  const { base, altura } = req.body;

  const validacion = validarDimensiones(base, altura);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });


  }


  const { base: b, altura: h } = validacion;
  const perimetro = 2 * (b + h);
  const superficie = b * h;
  const esCuadrado = b === h;

  return res.status(200).json({
    figura: esCuadrado ? 'Cuadrado' : 'Rectángulo',
    base: b,
    altura: h,
    perimetro,
    superficie,
    esCuadrado


  });


});




app.get('/api/rectangulos/calcular', (req, res) => {
  const { base, altura } = req.query;

  const validacion = validarDimensiones(base, altura);
  if (!validacion.ok) {
    return res.status(400).json({ error: validacion.mensaje });
  }


  const { base: b, altura: h } = validacion;
  const perimetro = 2 * (b + h);
  const superficie = b * h;
  const esCuadrado = b === h;

  return res.status(200).json({
    figura: esCuadrado ? 'Cuadrado' : 'Rectángulo',
    base: b,
    altura: h,
    perimetro,
    superficie,
    esCuadrado


  });



});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});