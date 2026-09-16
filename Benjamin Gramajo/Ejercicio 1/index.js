import express from "express";

const app = express();

app.use(express.json());

//Valida que un valor recibido por query string sea un número > 0.
// Devuelve un mensaje de error (string) o null si es válido.

function validarLado(valor, nombreCampo) {
  if (valor === undefined || valor === null || valor === "") {
    return `El parámetro "${nombreCampo}" es obligatorio.`;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return `El parámetro "${nombreCampo}" debe ser un número válido.`;
  }

  if (numero <= 0) {
    return `El parámetro "${nombreCampo}" debe ser mayor a 0.`;
  }

  return null;
}

// GET /rectangulos?base=&altura= Calcula perímetro, superficie e indica si el rectángulo es también un cuadrado.

app.get("/rectangulos", (req, res) => {
  const { base, altura } = req.query;

  const errores = [
    validarLado(base, "base"),
    validarLado(altura, "altura"),
  ].filter(Boolean);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const baseNum = Number(base);
  const alturaNum = Number(altura);

  const perimetro = 2 * (baseNum + alturaNum);
  const superficie = baseNum * alturaNum;
  const esCuadrado = baseNum === alturaNum;

  return res.status(200).json({
    base: baseNum,
    altura: alturaNum,
    perimetro,
    superficie,
    esCuadrado,
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
