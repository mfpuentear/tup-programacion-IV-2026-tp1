import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

function validarMedidas(base, altura) {
    const baseNumerica = Number(base);
    const alturaNumerica = Number(altura);

    if (base === undefined || altura === undefined) {
        return {
            esValido: false,
            mensaje: "Los parametros base y altura son obligatorios."
        };
    }

    if (
        Number.isNaN(baseNumerica) ||
        Number.isNaN(alturaNumerica) ||
        !Number.isFinite(baseNumerica) ||
        !Number.isFinite(alturaNumerica)
    ) {
        return {
            esValido: false,
            mensaje: "La base y la altura deben ser numeros validos."
        };
    }

    if (baseNumerica <= 0 || alturaNumerica <= 0) {
        return {
            esValido: false,
            mensaje: "La base y la altura deben ser mayores a cero."
        };
    }

    if (baseNumerica > 100000 || alturaNumerica > 100000) {
        return {
            esValido: false,
            mensaje: "La base y la altura no pueden superar el valor 100000."
        };
    }

    return {
        esValido: true,
        base: baseNumerica,
        altura: alturaNumerica
    };
}

app.get("/api/rectangulos/calculo", (req, res) => {
    const { base, altura } = req.query;

    const validacion = validarMedidas(base, altura);

    if (!validacion.esValido) {
        return res.status(400).json({
            error: validacion.mensaje
        });
    }

    const superficie = validacion.base * validacion.altura;
    const perimetro = 2 * (validacion.base + validacion.altura);
    const esCuadrado = validacion.base === validacion.altura;

    return res.status(200).json({
        figura: esCuadrado ? "cuadrado" : "rectangulo",
        medidas: {
            base: validacion.base,
            altura: validacion.altura
        },
        resultados: {
            superficie,
            perimetro
        },
        esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`API disponible en http://localhost:${PORT}`);
});