import express from "express";

const app = express();

const PORT = 3000;

app.get("/rectangulos", (req, res) => {

    const { base, altura } = req.query;

    const baseNumero = Number(base);
    const alturaNumero = Number(altura);

    if (
        !Number.isFinite(baseNumero) ||
        !Number.isFinite(alturaNumero) ||
        baseNumero <= 0 ||
        alturaNumero <= 0
    ) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0"
        });
    }

    const perimetro = 2 * (baseNumero + alturaNumero);
    const superficie = baseNumero * alturaNumero;
    const esCuadrado = baseNumero === alturaNumero;

    res.json({
        base: baseNumero,
        altura: alturaNumero,
        perimetro,
        superficie,
        esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});