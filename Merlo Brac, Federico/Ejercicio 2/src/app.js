import express from 'express';
import { alumnosRouter } from './routes/alumnos.routes.js';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API de Gestión Académica de Alumnos - Ejercicio 2 (TP1)',
    autor: 'Federico Merlo Brac',
    recursos: {
      coleccion: '/alumnos',
      filtroCondicion: '/alumnos?condicion=aprobado | reprobado | promocionado',
      detallePorId: '/alumnos/:id',
      consultaNotas: '/alumnos/:id/notas'
    }
  });
});

app.use('/alumnos', alumnosRouter);

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
