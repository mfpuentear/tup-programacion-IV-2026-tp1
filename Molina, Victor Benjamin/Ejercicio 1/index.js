const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/rectangulos", (req, res) => {
    const base = Number(req.query.base);
    const altura = Number(req.query.altura);

    if (!req.query.base || !req.query.altura) {
        return res.status(400).json({
            error: "Debe ingresar la base y la altura."
        });
    }

    if (isNaN(base) || isNaN(altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números."
        });
    }

    if (base <= 0 || altura <= 0) {
        return res.status(400).json({
            error: "La base y la altura deben ser mayores a 0."
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.status(200).json({
        base,
        altura,
        perimetro,
        superficie,
        esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});