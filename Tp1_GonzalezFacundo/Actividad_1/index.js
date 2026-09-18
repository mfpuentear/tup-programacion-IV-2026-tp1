// Actividad 1
const express = require('express');

const app = express();

const PORT = 3000;

app.get('/rectangulos', (req, res) => {

    const base = Number(req.query.base);
    const altura = Number(req.query.altura);

    if (!req.query.base || !req.query.altura || isNaN(base) || isNaN(altura)) {
        return res.status(400).json({
            error: 'La base y la altura deben ser valores numéricos'
        });
    }

    if (base <= 0 || altura <= 0) {
        return res.status(400).json({
            error: 'La base y la altura deben ser mayores a cero'
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.json({
        base: base,
        altura: altura,
        perimetro: perimetro,
        superficie: superficie,
        cuadrado: esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});