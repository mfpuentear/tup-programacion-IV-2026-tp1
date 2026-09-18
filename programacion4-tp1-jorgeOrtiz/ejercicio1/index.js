import express from "express";

const app = express();
const port = 3000;

app.use(express.json())

let calculos = []; // guardamos la coleccion de recursos mediante un arreglo con el fin de recorrerlo y poder definir el tipo de figura en otra variable
let id = 1;

// mediante post se crean nuevos recursos (alto, ancho , area y perimetro).
//validamos que los datos de tipo numericos sean positivos
// se calculan el area y perimetro
// por ultimo devolvemos el objeto mediante un json 

app.post("/medidas", (req, res) => {
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


// consultamos los recursos existentes mediante un metodo get
// recorremos el arreglo mediante un map para tomar cada calculo almacenado y devolver un nuevo arreglo con informacion del tipo de figura
// devolvemos el objeto en formato json  
app.get("/figuras", (req, res) => {
    calculos = calculos.map(calculo => {
        const tipo = (calculo.alto === calculo.ancho) ? "cuadrado" : "rectangulo";
        return {...calculo, tipo};
    }) 

    res.json(calculos)
});

app.listen(port, () => {
  console.log(` La aplicacion esta funcionando en ${port} `);
});
