import { Router } from 'express';
import {
  listarRectangulos,
  obtenerPorId,
  obtenerPerimetro,
  obtenerSuperficie,
  crearRectangulo,
  modificarRectangulo,
  eliminarRectangulo,
  calcularDirecto
} from '../controllers/rectangulos.controller.js';
import {
  validarId,
  validarBodyCrear,
  validarBodyModificar,
  validarFiltroCuadrado,
  validarCalculoDirecto
} from '../middlewares/validaciones.js';

export const rectangulosRouter = Router();

// Endpoint de cálculo al vuelo sin persistir
rectangulosRouter.get('/calcular', validarCalculoDirecto, calcularDirecto);

// Colección general
rectangulosRouter.get('/', validarFiltroCuadrado, listarRectangulos);
rectangulosRouter.post('/', validarBodyCrear, crearRectangulo);

// Endpoints por ID
rectangulosRouter.get('/:id', validarId, obtenerPorId);
rectangulosRouter.get('/:id/perimetro', validarId, obtenerPerimetro);
rectangulosRouter.get('/:id/superficie', validarId, obtenerSuperficie);
rectangulosRouter.put('/:id', validarId, validarBodyModificar, modificarRectangulo);
rectangulosRouter.delete('/:id', validarId, eliminarRectangulo);
