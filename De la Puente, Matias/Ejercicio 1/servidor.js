const express = require('express');
const aplicacion = express();
const puerto = 3001;

aplicacion.use(express.json());

let rectangulos = [
  { id: 1, ancho: 4, alto: 3 },
  { id: 2, ancho: 5, alto: 5 },
];

function esNumeroPositivo(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) && valor > 0;
}

function resumirRectangulo(rectangulo) {
  const perimetro = 2 * (rectangulo.ancho + rectangulo.alto);
  const superficie = rectangulo.ancho * rectangulo.alto;

  return {
    ...rectangulo,
    perimetro,
    superficie,
    esCuadrado: rectangulo.ancho === rectangulo.alto,
  };
}

aplicacion.get('/rectangulos', (peticion, respuesta) => {
  respuesta.json(rectangulos.map(resumirRectangulo));
});

aplicacion.get('/rectangulos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const rectangulo = rectangulos.find((elemento) => elemento.id === id);

  if (!rectangulo) {
    return respuesta.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  return respuesta.json(resumirRectangulo(rectangulo));
});

aplicacion.post('/rectangulos', (peticion, respuesta) => {
  const { ancho, alto } = peticion.body;

  if (!esNumeroPositivo(Number(ancho)) || !esNumeroPositivo(Number(alto))) {
    return respuesta.status(400).json({
      error: 'Los valores ancho y alto deben ser números mayores a 0.',
    });
  }

  const nuevoRectangulo = {
    id: Date.now(),
    ancho: Number(ancho),
    alto: Number(alto),
  };

  rectangulos.push(nuevoRectangulo);
  return respuesta.status(201).json(resumirRectangulo(nuevoRectangulo));
});

aplicacion.put('/rectangulos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const rectangulo = rectangulos.find((elemento) => elemento.id === id);

  if (!rectangulo) {
    return respuesta.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  const { ancho, alto } = peticion.body;

  if (ancho !== undefined && !esNumeroPositivo(Number(ancho))) {
    return respuesta.status(400).json({ error: 'El ancho debe ser un número mayor a 0.' });
  }

  if (alto !== undefined && !esNumeroPositivo(Number(alto))) {
    return respuesta.status(400).json({ error: 'El alto debe ser un número mayor a 0.' });
  }

  rectangulo.ancho = ancho !== undefined ? Number(ancho) : rectangulo.ancho;
  rectangulo.alto = alto !== undefined ? Number(alto) : rectangulo.alto;

  return respuesta.json(resumirRectangulo(rectangulo));
});

aplicacion.delete('/rectangulos/:id', (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const longitudInicial = rectangulos.length;
  rectangulos = rectangulos.filter((elemento) => elemento.id !== id);

  if (rectangulos.length === longitudInicial) {
    return respuesta.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  return respuesta.status(204).send();
});

aplicacion.listen(puerto, () => {
  console.log(`Ejercicio 1 corriendo en http://localhost:${puerto}`);
});
