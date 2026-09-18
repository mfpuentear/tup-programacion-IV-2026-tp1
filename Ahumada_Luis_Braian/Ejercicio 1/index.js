import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send("Hello, World!");
});


//Determina el perimetro de un rectangulo a partir de su base y altura
app.get("/rectangulo/perimetro", (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  //Valida que los valores ingresados sean numeros y mayores a 0
  if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
    return res.status(400).send("Los valores ingresados no son validos");
  }

  //Calcula el perimetro del rectangulo y lo envia como respuesta
  const perimetro = 2 * (base + altura);
  //Enviado en formato JSON (enviando base y altura para que el usuario pueda verificar los valores ingresados)
  res.json({ 
             base: base,
             altura: altura,
             perimetro: perimetro 
            });
});

//Determina la superficie de un rectangulo a partir de su base y altura
app.get("/rectangulo/superficie", (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);


  //Valida que los valores ingresados sean numeros y mayores a 0
  if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
    return res.status(400).send("Los valores ingresados no son validos");
  }

  //Calcula la superficie del rectangulo y lo envia como respuesta
  const superficie = base * altura;
  //Enviado en formato JSON
  res.json({
             base: base,
             altura: altura,
             superficie: superficie 
            });
});


//Envia un JSON con la información general, base, altura, superficie, perimetro y es un cuadrado o no
app.get("/rectangulo", (req, res) => {
  const base = Number(req.query.base);
  const altura = Number(req.query.altura);

  //Valida que los valores ingresados sean numeros y mayores a 0
  if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
    return res.status(400).send("Los valores ingresados no son validos");
  }

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;
  const esCuadrado = base === altura;

  //enviado en formato JSON
  res.json({ 
             base: base,
             altura: altura,
             perimetro: perimetro,
             superficie: superficie,
             esCuadrado: esCuadrado 
            });
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
