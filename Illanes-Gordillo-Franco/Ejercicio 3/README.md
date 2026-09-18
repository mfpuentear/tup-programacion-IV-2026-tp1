# Ejercicio 3

## Decisiones tomadas

* **Metodos HTTP y rutas:** arme una api rest con el recurso /api/tareas usando todos los verbos necesarios:
  * GET /api/tareas para listar todas las tareas guardadas.
  * GET /api/tareas/:id para buscar una sola tarea por su id.
  * POST /api/tareas para crear tareas enviando el titulo por el body. por defecto se guardan con completada: false.
  * PUT /api/tareas/:id para editar el titulo o cambiar el estado a completada.
  * DELETE /api/tareas/:id para eliminar la tarea de la lista.
* **Validaciones:** se controla que el titulo no venga vacio en el POST, que los id que viajan por params sean numericos y que el campo completada en el PUT sea booleano. si mandan algo mal responde con un 400 bad request y si no encuentra la tarea con un 404 not found.