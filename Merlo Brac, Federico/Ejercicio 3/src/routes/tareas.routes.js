import { Router } from 'express';
import {
  listarTareas,
  obtenerPorId,
  crearTarea,
  modificarTarea,
  eliminarTarea
} from '../controllers/tareas.controller.js';
import {
  validarId,
  validarBodyCrear,
  validarBodyModificar,
  validarQueryFiltro
} from '../middlewares/validaciones.js';

export const tareasRouter = Router();

tareasRouter.get('/', validarQueryFiltro, listarTareas);
tareasRouter.post('/', validarBodyCrear, crearTarea);

tareasRouter.get('/:id', validarId, obtenerPorId);
tareasRouter.put('/:id', validarId, validarBodyModificar, modificarTarea);
tareasRouter.delete('/:id', validarId, eliminarTarea);
