const express = require('express');

const app = express();
const PORT = 3000;

app.get('/api/rectangulo', (req, res) => {
    const base = req.query.base;
    const altura = req.query.altura;

    // Verificamos que se hayan enviado los dos parámetros
    if (base === undefined || altura === undefined) {
        return res.status(400).json({
            error: 'Debe ingresar la base y la altura del rectángulo.'
        });
    }

    const medidaBase = Number(base);
    const medidaAltura = Number(altura);

    // Verificamos que sean números mayores a cero
    if (
        isNaN(medidaBase) ||
        isNaN(medidaAltura) ||
        medidaBase <= 0 ||
        medidaAltura <= 0
    ) {
        return res.status(400).json({
            error: 'La base y la altura deben ser números mayores que cero.'
        });
    }

    const superficie = medidaBase * medidaAltura;
    const perimetro = 2 * (medidaBase + medidaAltura);
    const cuadrado = medidaBase === medidaAltura;

    res.status(200).json({
        base: medidaBase,
        altura: medidaAltura,
        superficie: superficie,
        perimetro: perimetro,
        esCuadrado: cuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});