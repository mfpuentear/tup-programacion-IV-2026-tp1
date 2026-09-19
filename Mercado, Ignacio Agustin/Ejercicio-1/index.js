import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Para validar datos
const validarDimensiones = (base, altura) => {
    const b = Number(base);
    const a = Number(altura);

    if (isNaN(b) || isNaN(a) || b <= 0 || a <= 0) {
        return { valido: false, mensaje: "Base y altura deben ser números mayores que cero." };
    }
    return { valido: true, base: b, altura: a };
};

// función para calcular perimetro, superficie y determinar si es un cuadrado
const calcularREctangulo = (b, a) => {
    const perimetro = 2 * (b + a);
    const superficie = b * a;
    const esCuadrado = b === a;
    
    return { 
        figura: esCuadrado ? "Cuadrado" : "Rectángulo",
        base: b,
        altura: a,
        perimetro,
        superficie,
        esCuadrado
    };
};

app.get("/", (req, res) => {
    res.send("Api de perimetro y superficies de Rectángulos");
});

// GET para calcular por query params 
app.get("/api/rectangulos/calcular", (req, res) => {
    const { base, altura } = req.query;
    const validacion = validarDimensiones(base, altura);

    if (!validacion.valido) {
        return res.status(400).send(validacion.mensaje);
    }
    
    const resultado = calcularREctangulo(validacion.base, validacion.altura);
    res.send(resultado);
});

// POST para caucular enviando JSON en el body
app.post("/api/rectangulos/calcular", (req, res) => {
    const { base, altura } = req.body;
    const validacion = validarDimensiones(base, altura);

    if (!validacion.valido) {
        return res.status(400).send(validacion.mensaje);
    }

    const resultado = calcularREctangulo(validacion.base, validacion.altura);
    res.status(200).send(resultado);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
