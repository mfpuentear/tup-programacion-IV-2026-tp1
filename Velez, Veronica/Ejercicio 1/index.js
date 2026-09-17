const express = require('express');
const app = express();

app.use(express.json());

// Aca guardamos los rectangulos en memoria
const rectangulos = [];
let proximoId = 1;

// Endpoint para crear un rectangulo
app.post('/rectangulos', (req, res) => {
    const { base, altura } = req.body;

    // validacion basica para que los datos esten bien
    if (typeof base !== 'number' || typeof altura !== 'number' || base <= 0 || altura <= 0) {
        return res.status(400).json({ error: 'La base y la altura tienen que ser numeros mayores a cero' });
    }

    // calculamos las cosas
    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    const nuevoRectangulo = {
        id: proximoId++,
        base,
        altura,
        perimetro,
        superficie,
        esCuadrado
    };

    rectangulos.push(nuevoRectangulo);
    res.status(201).json(nuevoRectangulo);
});

// Endpoint para obtener todos los rectangulos
app.get('/rectangulos', (req, res) => {
    res.json(rectangulos);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API de rectangulos escuchando en el puerto ${PORT}`);
});
