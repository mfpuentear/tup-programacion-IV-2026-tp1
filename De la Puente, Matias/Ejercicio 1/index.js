import express from 'express'

const app = express()
app.use(express.json())

app.get('/rectangulo',(req,res) =>{
    const {base, altura} = req.query

    if(!base || !altura){
        return res.status(400).send("Dato Invalido")
    }

    const baseVal = parseFloat(base)
    const alturaVal = parseFloat(altura)

    if(isNaN (baseVal) || isNaN (alturaVal) || 
          baseVal <= 0 || alturaVal <= 0)
    return res.status(400).send("La Base y Alturas deben ser mayores a 0"

    )


    const perimetro = 2 *(baseVal + baseVal)
    const superficie = baseVal  *  alturaVal
    const Cuadrado = baseVal === alturaVal

    res.json({
        input: {base : baseVal , altura: alturaVal},
        resultado:{perimetro,superficie,Cuadrado}
    })

} )

app.listen(8000,() => {
    console.log("Servidor Funcionando en el puerto 8000")
})
