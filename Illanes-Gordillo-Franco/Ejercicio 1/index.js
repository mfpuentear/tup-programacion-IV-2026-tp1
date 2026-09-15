const express = require('express');
const app = express();
const PORT = 3000;

// Recurso: GET /api/rectangulos
app.get('/api/rectangulos', (req, res) => {
    const { base, altura } = req.query;

    // Validacion 1: Presencia de parametros
    if (!base || !altura) {
        return res.status(400).json({ 
            error: "Faltan parametros. Debes enviar 'base' y 'altura' por query." 
        });
    }

    const baseNum = Number(base);
    const alturaNum = Number(altura);

    // validacion: que sean numeros
    if (isNaN(baseNum) || isNaN(alturaNum)) {
        return res.status(400).json({ error: "parametro invalido: base y altura deben ser numeros" });
    }

    // validacion: mayores a 0
    if (baseNum <= 0 || alturaNum <= 0) {
        return res.status(400).json({ error: "la base y la altura deben ser mayores a 0" });
    }

    // Calculos
    const perimetro = 2 * (baseNum + alturaNum);
    const superficie = baseNum * alturaNum;
    const esCuadrado = baseNum === alturaNum;

    // Respuesta exitosa
    return res.status(200).json({
        base: baseNum,
        altura: alturaNum,
        perimetro,
        superficie,
        esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});