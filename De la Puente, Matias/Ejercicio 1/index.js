const express = require('express');

const app = express();

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de rectángulos funcionando'
    });
});

// Calcular datos de un rectángulo
app.post('/rectangulos', (req, res) => {
    const { base, altura } = req.body;

    // Validar que existan base y altura
    if (base === undefined || altura === undefined) {
        return res.status(400).json({
            error: 'La base y la altura son obligatorias'
        });
    }

    // Validar que sean números
    if (typeof base !== 'number' || typeof altura !== 'number') {
        return res.status(400).json({
            error: 'La base y la altura deben ser números'
        });
    }

    // Validar que sean mayores que cero
    if (base <= 0 || altura <= 0) {
        return res.status(400).json({
            error: 'La base y la altura deben ser mayores que 0'
        });
    }

    // Cálculos
    const superficie = base * altura;
    const perimetro = 2 * (base + altura);
    const esCuadrado = base === altura;

    // Respuesta
    res.json({
        base,
        altura,
        superficie,
        perimetro,
        esCuadrado
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});