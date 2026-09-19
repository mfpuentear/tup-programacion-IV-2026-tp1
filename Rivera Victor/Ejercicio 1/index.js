const express = require('express');

const app = express();

const PORT = 3000;

app.get('/rectangulo', (req, res) => {
    const base = Number(req.query.base);
    const altura = Number(req.query.altura);

    if (!Number.isFinite(base) || !Number.isFinite(altura) || base <= 0 || altura <= 0) {
        return res.status(400).json({
            error: 'La base y la altura deben ser números mayores que 0'
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
        esCuadrado: esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});