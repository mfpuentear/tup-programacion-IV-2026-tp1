import express from "express";

const app = express();
const PORT = 3000;
const MAX_DIMENSION = 1_000_000;

// ---------- Validación ----------
function parsearDimension(valor, nombre) {
  if (valor === undefined || String(valor).trim() === "") {
    return { error: `El parámetro '${nombre}' es obligatorio` };
  }
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return { error: `El parámetro '${nombre}' debe ser un número` };
  }
  if (numero <= 0) {
    return { error: `El parámetro '${nombre}' debe ser mayor que 0` };
  }
  if (numero > MAX_DIMENSION) {
    return {
      error: `El parámetro '${nombre}' no puede superar ${MAX_DIMENSION}`,
    };
  }
  return { valor: numero };
}

function validarRectangulo(req, res, next) {
  const base = parsearDimension(req.query.base, "base");
  const altura = parsearDimension(req.query.altura, "altura");

  const errores = [base.error, altura.error].filter(Boolean);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  req.rectangulo = { base: base.valor, altura: altura.valor };
  next();
}

// ---------- Lógica ----------
const perimetro = ({ base, altura }) => 2 * (base + altura);
const superficie = ({ base, altura }) => base * altura;
const esCuadrado = ({ base, altura }) => base === altura;

function describir(rect) {
  const cuadrado = esCuadrado(rect);
  return {
    base: rect.base,
    altura: rect.altura,
    esCuadrado: cuadrado,
    tipo: cuadrado ? "cuadrado" : "rectangulo",
    ...(cuadrado && { lado: rect.base }),
  };
}

// ---------- Rutas ----------
const router = express.Router();

router.get("/perimetro", validarRectangulo, (req, res) => {
  res.json({
    ...describir(req.rectangulo),
    perimetro: perimetro(req.rectangulo),
  });
});

router.get("/superficie", validarRectangulo, (req, res) => {
  res.json({
    ...describir(req.rectangulo),
    superficie: superficie(req.rectangulo),
  });
});

router.get("/calculo", validarRectangulo, (req, res) => {
  res.json({
    ...describir(req.rectangulo),
    perimetro: perimetro(req.rectangulo),
    superficie: superficie(req.rectangulo),
  });
});

app.use("/rectangulos", router);

// ---------- 404 y errores ----------
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`Ejercicio 1 en http://localhost:${PORT}`));
