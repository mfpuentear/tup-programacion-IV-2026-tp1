import express from 'express';

const app = express();

app.use(express.json());

// Endpoint para calcular perímetros y superficies de rectángulos / cuadrados
app.get('/api/rectangulos/calcular', (req, res) => {
    const { base, altura } = req.query;

    // Validación interna: verificar que los parámetros existan
    if (base === undefined || altura === undefined) {
        return res.status(400).json({
            error: "Faltan parámetros obligatorios. Debe enviar 'base' y 'altura'."
        });
    }

    // Convertir los valores a números flotantes
    const baseNum = parseFloat(base);
    const alturaNum = parseFloat(altura);

    // Validación interna: verificar que sean números válidos y mayores a 0
    if (isNaN(baseNum) || isNaN(alturaNum) || baseNum <= 0 || alturaNum <= 0) {
        return res.status(400).json({
            error: "Los valores de 'base' y 'altura' deben ser numéricos y mayores a cero."
        });
    }

    // Lógica de negocio / cálculos geométricos
    const superficie = baseNum * alturaNum;
    const perimetro = 2 * (baseNum + alturaNum);
    
    // Distinguir cuando constituye un cuadrado
    const esCuadrado = baseNum === alturaNum;

    // Respuesta de la API
    return res.status(200).json({
        figura: esCuadrado ? "Cuadrado (caso especial de rectángulo)" : "Rectángulo",
        base: baseNum,
        altura: alturaNum,
        superficie: superficie,
        perimetro: perimetro,
        esCuadrado: esCuadrado
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});