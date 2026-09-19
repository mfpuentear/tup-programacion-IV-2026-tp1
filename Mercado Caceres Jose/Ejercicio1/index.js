import express from 'express';
const app = express();
const PORT = 3000;

app.get('/calculos/rectangulo', (req, res) => {
    const base = parseFloat(req.query.base);
    const altura = parseFloat(req.query.altura);

    if (!base || !altura || isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
        return res.status(400).json({ 
            error: "Valores inválidos. Debe enviar 'base' y 'altura' como números mayores a 0." 
        });
    }

    const perimetro = (base * 2) + (altura * 2);
    const superficie = base * altura;
    const esCuadrado = (base === altura); 

    res.json({
        base,
        altura,
        perimetro,
        superficie,
        esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 1 corriendo en http://localhost:${PORT}`);
});