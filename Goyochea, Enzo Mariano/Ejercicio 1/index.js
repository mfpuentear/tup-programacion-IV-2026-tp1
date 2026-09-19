import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Testing hola");
});


// Recibir del body y validar los parametros del rectangulo
app.get("/rectangulo", (req, res) =>{

  const alto = Number(req.query.alto)
  const ancho = Number(req.query.ancho)

  if(isNaN(alto) || isNaN(ancho) || alto <= 0 || ancho <= 0){
    return res.status(400).send("Los valores son invalidos. Deben ser numeros mayores a cero")
  }

  // Calculos e identificacion de cuadrados
  const perimetro = 2*(alto + ancho)
  const superficie = alto * ancho
  const cuadrado = (alto === ancho) ? true : false;

  // Retorno de la consulta en forma de json
  return res.json(
    {
      alto: alto,
      ancho: ancho,
      perimetro: perimetro,
      superficie: superficie,
      cuadrado: cuadrado
    }
  )
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});