import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Función para validar que base y altura sean números positivos
function validarMedidas(base, altura) {
    return (
        typeof base === "number" &&
        typeof altura === "number" &&
        base > 0 &&
        altura > 0
    );
}

// GET /rectangulos
// Devuelve información sobre un rectángulo a partir de base y altura
app.get("/rectangulos", (req, res) => {
    const base = Number(req.query.base);
    const altura = Number(req.query.altura);

    if (!validarMedidas(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
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

// POST /rectangulos
// Recibe base y altura mediante JSON
app.post("/rectangulos", (req, res) => {
    const { base, altura } = req.body;

    if (!validarMedidas(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.status(201).json({
        base: base,
        altura: altura,
        perimetro: perimetro,
        superficie: superficie,
        esCuadrado: esCuadrado
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});