const express = require("express");

const app = express();
const PORT = 3001;

function convertirNumero(valor) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : NaN;
}

function esValorValido(numero) {
    return Number.isFinite(numero) && numero > 0;
}

function obtenerTipo(base, altura) {
    return base === altura ? "Cuadrado" : "Rectángulo";
}

app.get("/rectangulos", (req, res) => {
    let { base, altura } = req.query;

    if (base === undefined || altura === undefined) {
        return res.status(400).json({
            error: "Se deben indicar la base y la altura"
        });
    }

    base = convertirNumero(base);
    altura = convertirNumero(altura);

    if (!esValorValido(base) || !esValorValido(altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que cero"
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;

    return res.status(200).json({
        base,
        altura,
        perimetro,
        superficie,
        tipoFigura: obtenerTipo(base, altura)
    });
});

app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});