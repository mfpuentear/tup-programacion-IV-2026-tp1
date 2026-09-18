import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// POST para calcular perimetro y superficie
app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  // validar que se envien ambos parametros
  if (base === undefined || altura === undefined) {
    return res.status(400).json({ success: false, message: "se debe enviar base y altura en el body" });
  }

  // validar que sean numeros
  if (isNaN(base) || isNaN(altura)) {
    return res.status(400).json({success: false, message: "base y altura deben ser valores numericos"});
  }

  // validar que sean positivos
  if (base <= 0 || altura <= 0) {
    return res.status(400).json({success: false, message: "base y altura deben ser mayores a cero"});
  }

  // calcular perimetro y superficie
  const perimetro = 2 * (base + altura);
  const superficie = base * altura;

  // determinar tipo 
  let tipo;
  if (base === altura) {
    tipo = "Cuadrado";
  } else {
    tipo = "Rectangulo";
  }

  res.json({success: true, data: { base, altura, perimetro, superficie, tipo }});
});


app.listen(port, () => {
  console.log(`API de rectangulos funcionando en puerto ${port}`);
});
