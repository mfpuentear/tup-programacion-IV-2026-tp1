const express = require('express');
const app = express();

app.use(express.json());

app.get('/rectangulo', (req, res) => {
    const base = parseFloat(req.query.base);
    const altura = parseFloat(req.query.altura);

    if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
        return res.status(400).json({ error: 'La base y la altura deben ser numeros mayores a 0' });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.json({ base, altura, perimetro, superficie, esCuadrado });
});

app.listen(3000, () => console.log('Ejercicio 1 en puerto 3000'));