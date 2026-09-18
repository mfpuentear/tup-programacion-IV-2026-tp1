import { Router } from 'express';
import {
  listarAlumnos,
  obtenerPorId,
  obtenerNotas,
  crearAlumno,
  modificarAlumno,
  eliminarAlumno
} from '../controllers/alumnos.controller.js';
import {
  validarId,
  validarBodyCrear,
  validarBodyModificar,
  validarQueryFiltro
} from '../middlewares/validaciones.js';

export const alumnosRouter = Router();

alumnosRouter.get('/', validarQueryFiltro, listarAlumnos);
alumnosRouter.post('/', validarBodyCrear, crearAlumno);

alumnosRouter.get('/:id', validarId, obtenerPorId);
alumnosRouter.get('/:id/notas', validarId, obtenerNotas);
alumnosRouter.put('/:id', validarId, validarBodyModificar, modificarAlumno);
alumnosRouter.delete('/:id', validarId, eliminarAlumno);
