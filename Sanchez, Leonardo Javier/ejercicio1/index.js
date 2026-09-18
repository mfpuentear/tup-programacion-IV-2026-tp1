import express from "express"

//crear una instancia de aplicacion express
const app = express()

//definimos primera ruta
app.get("/", (req, res) => {
    res.send("Hola mundo")
})

//la aplicacion escucha en el puerto 3000
app.listen(3000, () => {
    console.log("servidor escuchando solicitudes en http://localhost:3000")
})

