import express from 'express';

const app = express();


app.get('/', (req, res) => {
    res.send('Hola World');
});

//Get para calcular perimetro y area a partir de la base y altura
app.get("/rectangulos", (req,res) => {

    const base= req.query.base;
    const altura= req.query.altura;

    //Validacion de ambos numeros ingresados
    if ( base === undefined || altura === undefined) {
        return res.status(400).send("Debe ingresar ambos valores de base y altura");
    }

    const baseNum = Number(base);
    const alturaNum = Number(altura);

    //Validamos que sean numeros positivos para cada lado 
    if (isNaN(baseNum) || isNaN(alturaNum) || baseNum <= 0 || alturaNum <= 0) {
        return res.status(400).send("La base y altura deben ser numeros mayores a 0");

    }


    const perimetro = 2 * (baseNum + alturaNum);
    const area = baseNum * alturaNum;
    const esCuadrado = baseNum === alturaNum;

    res.send({ base: baseNum, altura: alturaNum, perimetro, area, esCuadrado});

});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});