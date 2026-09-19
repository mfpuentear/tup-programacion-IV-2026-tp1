import express from 'express'

const app = express()

app.use(express.json())

// Endpoint para cálculos geométricos mediante Query Parameters
app.get('/rectangulo', (req, res) => {
    const { base, altura } = req.query

    // Corroboramos que no falten parámetros
    if (!base || !altura) {
        return res.status(400).send("Faltan parametros")
    }

    const valBase = parseFloat(base)
    const valAltura = parseFloat(altura)

    // Validación de tipos de datos y valores lógicos
    if (isNaN(valBase) || isNaN(valAltura) || valBase <= 0 || valAltura <= 0) {
        return res.status(400).send("La base y la altura deben ser números mayores a 0")
    }

    // Cálculos
    const perimetro = 2 * (valBase + valAltura)
    const superficie = valBase * valAltura
    const esCuadrado = valBase === valAltura
    
    // Verificamos si es un cuadrado
    const obtenerTipoFigura = () => {
        if (valBase === valAltura) {
          return "Cuadrado" 
        } else {
            return "Rectángulo"
        }
    }
    
    // Estructuración de la respuesta
    res.json({
        datosIngresados: { base: valBase, altura: valAltura },
        resultados: { perimetro, superficie, esCuadrado, tipoFigura: obtenerTipoFigura() }
    })
})

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000")
})
