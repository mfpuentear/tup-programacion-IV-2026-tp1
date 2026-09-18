import express from "express"

//crear una instancia de aplicacion express
const app = express()

//definimos primera ruta
app.get("/", (req, res) => {
    res.send("Hola mundo")
})

//definir ruta para calcular el perimetro y superficie de un rectangulo
app.post("/rectangulo", (req, res) => {
    const { base, altura } = req.body

    //validar que base y altura sean numeros positivos
    if (base <= 0 || altura <= 0){
        return res.status(400).json({ error: "Base y altura deben ser numeros positivos"})
    }

    // Calcular perimetro y superficie
    const perimetro = 2 * (base + altura)
    const superficie = base * altura
    
    // Determinar si es un cuadrado
    const esCuadrado = base === altura

    // Devolver la respuesta con los resultados
    res.json ({
    perimetro,
    superficie,
    esCuadrado,
    })
})

//la aplicacion escucha en el puerto 3000
app.listen(3000, () => {
    console.log("servidor escuchando solicitudes en http://localhost:3000")
})

