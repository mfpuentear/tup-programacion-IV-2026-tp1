const express = require("express");

const app = express();
const PORT = 3001;

/**
 * Valida una dimensión recibida mediante query string.
 * La dimensión debe existir, ser numérica, finita y mayor que cero.
 */
function obtenerDimension(valor, nombre) {
  if (valor === undefined) {
    return {
      error: `El parámetro '${nombre}' es obligatorio.`,
    };
  }

  if (typeof valor !== "string" || valor.trim() === "") {
    return {
      error: `El parámetro '${nombre}' debe contener un número válido.`,
    };
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return {
      error: `El parámetro '${nombre}' debe ser numérico.`,
    };
  }

  if (numero <= 0) {
    return {
      error: `El parámetro '${nombre}' debe ser mayor que cero.`,
    };
  }

  return {
    valor: numero,
  };
}

/**
 * GET /rectangulos?base=5&altura=3
 *
 * Devuelve el perímetro, superficie y si el rectángulo
 * también constituye un cuadrado.
 */
app.get("/rectangulos", (req, res) => {
  const resultadoBase = obtenerDimension(req.query.base, "base");

  if (resultadoBase.error) {
    return res.status(400).json({
      error: resultadoBase.error,
    });
  }

  const resultadoAltura = obtenerDimension(req.query.altura, "altura");

  if (resultadoAltura.error) {
    return res.status(400).json({
      error: resultadoAltura.error,
    });
  }

  const base = resultadoBase.valor;
  const altura = resultadoAltura.valor;

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;
  const esCuadrado = base === altura;

  return res.status(200).json({
    base,
    altura,
    perimetro,
    superficie,
    esCuadrado,
  });
});

// Ruta inexistente
app.use((req, res) => {
  return res.status(404).json({
    error: "Recurso no encontrado.",
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 1 ejecutándose en http://localhost:${PORT}`);
});