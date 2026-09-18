import express from 'express';
import { rectangulosRouter } from './routes/rectangulos.routes.js';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API de Rectángulos y Cuadrados - Ejercicio 1 (TP1)',
    autor: 'Federico Merlo Brac',
    recursos: {
      coleccion: '/rectangulos',
      filtroCuadrados: '/rectangulos?esCuadrado=true',
      filtroRectangulos: '/rectangulos?esCuadrado=false',
      detallePorId: '/rectangulos/:id',
      perimetro: '/rectangulos/:id/perimetro',
      superficie: '/rectangulos/:id/superficie',
      calcularDirecto: '/rectangulos/calcular?base=10&altura=5'
    }
  });
});

app.use('/rectangulos', rectangulosRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe.`
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición.' });
  }
  res.status(500).json({ error: 'Error interno del servidor.' });
});
