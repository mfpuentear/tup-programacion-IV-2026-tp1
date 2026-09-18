import express from "express";

const app = express();
const port = 3000;

app.use(express.json())

let calculos = [];
let id = 1;

app.post("/posteo", (req, res) => {
  // Extraigo del body los atributos del nuevo producto
  const { ancho, alto} = req.body;
  let numAncho= parseFloat(ancho);
  let numAlto = parseFloat(alto);

  if(isNaN(numAncho)||isNaN(numAlto)|| numAncho<=0 || numAlto<=0){
    return res
    .status(400)
    .json({success: false, message: "los numeros deben ser positivos"})
  }

  const perimetro=  2*(numAncho + numAlto);
  const superficie= numAncho * numAlto;
const call= {id: id++, alto: numAlto, ancho:numAncho, perimetro, superficie };
calculos.push(call);
res.json(call);

})

app.get("/llamada", (req, res) => {
    calculos = calculos.map(calculo => {
        const tipo = (calculo.alto === calculo.ancho) ? "cuadrado" : "rectangulo";
        return {...calculo, tipo};
    }) 

    res.json(calculos)
});


app.listen(port, () => {
  console.log(` La aplicacion esta funcionando en ${port} `);
});
