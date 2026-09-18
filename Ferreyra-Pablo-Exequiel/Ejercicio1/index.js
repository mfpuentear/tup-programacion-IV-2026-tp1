import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let calculos = [];
let id = 1;
// esta ruta recibe el alto y el ancho mediante JSON y calcula el perimetro y la superficie y guarda el resultado
app.post("/posteos", (req, res) => {
  const { ancho, alto } = req.body;

  let numAncho = parseFloat(ancho);
  let numAlto = parseFloat(alto);

  if (isNaN(numAncho)||isNaN(numAlto)||numAncho <= 0 ||numAlto <= 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: "los numeros deben ser positivos"
      });
  }

  const perimetro = 2 * (numAncho + numAlto);
  const superficie = numAncho * numAlto;

  const calculo = {
    id: id++,
    alto: numAlto,
    ancho: numAncho,
    perimetro,
    superficie
  };

  calculos.push(calculo);

  res.json(calculo);
});

app.get("/llamadas", (req, res) => {
  calculos = calculos.map(calculo => {
    const tipo =
      calculo.alto === calculo.ancho
        ? "cuadrado"
        : "rectangulo";

    return { ...calculo, tipo };
  });

  res.json(calculos);
});

// iniciamos el servidor y mostramos un mensaje en la terminal para confirmar que el servidor esta funcionando
app.listen(port, () => {
  console.log(`Puerto activo en http://localhost:${port}`);
});