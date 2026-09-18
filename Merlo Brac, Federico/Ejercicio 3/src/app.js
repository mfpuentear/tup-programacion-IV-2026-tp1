import express from 'express';
import { tareasRouter } from './routes/tareas.routes.js';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API de Administración de Tareas y Estado de Avance - Ejercicio 3 (TP1)',
    autor: 'Federico Merlo Brac',
    recursos: {
      coleccion: '/tareas',
      filtroCompletadas: '/tareas?completada=true (o ?estado=completada)',
      filtroPendientes: '/tareas?completada=false (o ?estado=pendiente)',
      detallePorId: '/tareas/:id'
    }
  });
});

app.use('/tareas', tareasRouter);

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
