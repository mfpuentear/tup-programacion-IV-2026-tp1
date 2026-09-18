const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());


// ================================
// VALIDACIONES
// ================================

function validarNumero(valor) {
    return typeof valor === "number" &&
        Number.isFinite(valor) &&
        valor > 0;
}

function validarRectangulo(base, altura) {
    return validarNumero(base) && validarNumero(altura);
}


// ================================
// GET - Obtener información
// ================================

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de rectángulos funcionando correctamente"
    });
});


app.get("/rectangulos/:base/:altura", (req, res) => {

    const base = Number(req.params.base);
    const altura = Number(req.params.altura);

    if (!validarRectangulo(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.json({
        base,
        altura,
        perimetro,
        superficie,
        esCuadrado
    });
});


// ================================
// GET - Calcular perímetro
// ================================

app.get("/rectangulos/:base/:altura/perimetro", (req, res) => {

    const base = Number(req.params.base);
    const altura = Number(req.params.altura);

    if (!validarRectangulo(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const perimetro = 2 * (base + altura);

    res.json({
        base,
        altura,
        perimetro
    });
});


// ================================
// GET - Calcular superficie
// ================================

app.get("/rectangulos/:base/:altura/superficie", (req, res) => {

    const base = Number(req.params.base);
    const altura = Number(req.params.altura);

    if (!validarRectangulo(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const superficie = base * altura;

    res.json({
        base,
        altura,
        superficie
    });
});


// ================================
// GET - Verificar si es cuadrado
// ================================

app.get("/rectangulos/:base/:altura/es-cuadrado", (req, res) => {

    const base = Number(req.params.base);
    const altura = Number(req.params.altura);

    if (!validarRectangulo(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const esCuadrado = base === altura;

    res.json({
        base,
        altura,
        esCuadrado
    });
});


// ================================
// POST - Crear un cálculo
// ================================

app.post("/rectangulos", (req, res) => {

    const { base, altura } = req.body;

    if (!validarRectangulo(base, altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números mayores que 0."
        });
    }

    const perimetro = 2 * (base + altura);
    const superficie = base * altura;
    const esCuadrado = base === altura;

    res.status(201).json({
        base,
        altura,
        perimetro,
        superficie,
        esCuadrado
    });
});


// ================================
// Iniciar servidor
// ================================

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});