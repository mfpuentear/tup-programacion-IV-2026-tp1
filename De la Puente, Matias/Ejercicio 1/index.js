import express from 'express'

const app = express()

app.use(express.json())

app.get('/rectangulo',(req,res) => {
    const {base, altura} = req.query

    if (!base || !altura) {
        return res.status(400).send("Faltan parametros")
    }

    const valBase = parseFloat(base)
    const valAltura = parseFloat(altura)

    if (isNaN (valBase) || isNaN (valAltura) || valBase <= 0 || valAltura <= 0 ){
        return res.status(400).send(" La base y la altura deben ser números mayores a 0")
    }

    const perimetro =  2 * (valBase + valAltura )
    const superficie = valBase * valAltura
    const esCuadrado = valBase === valAltura
    
    const obtenerTipoFigura = () => {
        if (valBase === valAltura) {
          return "Cuadradro"
        } else{
            return "Rectángulo"
        }
    }
    
    res.json({
        datosIngresados: {base: valBase, altura: valAltura},
        resultados: {perimetro,superficie,esCuadrado,tipoFigura: obtenerTipoFigura()}
    })
})


app.listen(3000,() => {
    console.log("Servidor fucionando en el puerto 3000")
})
