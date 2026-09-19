# Ejercicio 3 

API REST para la gestión de un listado de tareas con su estado de avance (**completadas** o **pendientes**).

##  Decisiones de Diseño

 **Estructura Interna:** Se utiliza un arreglo con objetos del tipo `{ id, nombre, completada }`.
 **Nombres Únicos:** Se valida que no puedan coexistir dos tareas con el mismo nombre.
 **Diferenciación por Estado:** Se expone la funcionalidad a través de un *Query Parameter* en `GET /api/tareas?completada=true` o `GET /api/tareas?completada=false`.
 **Endpoints Expuestos:**
   `GET /api/tareas`: Consulta global y consulta filtrada por estado.
   `GET /api/tareas/:id`: Obtiene una tarea específica. 

   `POST /api/tareas`: Agrega una tarea nueva.

   `PUT /api/tareas/:id`: Modifica una tarea existente.

   `PATCH /api/tareas/:id/completar`: Alterna rápidamente entre completada y pendiente.
   
   `DELETE /api/tareas/:id`: Elimina una tarea por su ID.
