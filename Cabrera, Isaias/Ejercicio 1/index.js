const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

/**
 * DECISIÓN DE DISEÑO:
 * - Recurso: "/rectangulos"
 * - Método: GET, dado que es una operación segura e idempotente que no altera el estado del servidor.
 * - Parámetros: Query Params (?base=X&altura=Y).
 */
app.get('/rectangulos', (req, res) => {
  const { base, altura } = req.query;

  // 1. Validar presencia
  if (base === undefined || altura === undefined) {
    return res.status(400).json({
      error: 'Debe ingresar ambos parámetros de consulta: base y altura.'
    });
  }

  // 2. Conversión a número
  const b = Number(base);
  const a = Number(altura);

  // 3. Validar valores numéricos positivos
  if (isNaN(b) || isNaN(a)) {
    return res.status(400).json({
      error: 'Tanto la base como la altura deben ser valores numéricos válidos.'
    });
  }

  if (b <= 0 || a <= 0) {
    return res.status(400).json({
      error: 'La base y la altura deben ser números mayores a cero.'
    });
  }

  // 4. Cálculos
  const perimetro = 2 * (b + a);
  const superficie = b * a;
  const esCuadrado = (b === a);

  // 5. Respuesta distinguiendo si es cuadrado
  return res.status(200).json({
    figura: esCuadrado ? 'cuadrado' : 'rectangulo',
    base: b,
    altura: a,
    perimetro: perimetro,
    superficie: superficie,
    esCuadrado: esCuadrado
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 1 corriendo en http://localhost:${PORT}`);
});