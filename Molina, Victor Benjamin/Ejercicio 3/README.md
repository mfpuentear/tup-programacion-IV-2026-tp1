# Ejercicio 3 - Gestión de tareas

API desarrollada con ExpressJS para administrar tareas y su estado de realización.

## Recurso

Se definió el recurso:

`/tareas`

Cada tarea se representa mediante un nombre y un estado que indica si se encuentra completada.

Ejemplo:

{
    "nombre": "Estudiar programación",
    "completada": false
}

Las tareas se almacenan en un arreglo interno mientras el servidor se encuentra en ejecución.

## Métodos HTTP

Se definieron los siguientes métodos:

- `POST /tareas`: crea una nueva tarea.
- `GET /tareas`: consulta todas las tareas.
- `GET /tareas/:nombre`: consulta una tarea determinada.
- `PUT /tareas/:nombre`: modifica una tarea.
- `DELETE /tareas/:nombre`: elimina una tarea.

El nombre se utiliza como identificador de la tarea, por lo que no se permiten tareas con nombres repetidos.

## Consulta por estado

Para facilitar la diferenciación entre tareas completadas y pendientes se utiliza el parámetro query `completada`.

Tareas completadas:

`GET /tareas?completada=true`

Tareas pendientes:

`GET /tareas?completada=false`

Si no se proporciona el parámetro `completada`, se devuelven todas las tareas.

## Validaciones

Al crear o modificar una tarea se verifica que:

- El nombre exista y sea una cadena de texto válida.
- El estado `completada` sea un valor booleano (`true` o `false`).
- No exista otra tarea con el mismo nombre.

La comparación de nombres no distingue entre mayúsculas y minúsculas para evitar nombres duplicados.

El parámetro query `completada`, cuando se utiliza, solamente acepta los valores `true` o `false`.

Cuando se intenta consultar, modificar o eliminar una tarea inexistente, la API devuelve el código de estado `404`.

Los datos inválidos devuelven el código de estado `400`.

La creación correcta de una tarea devuelve el código de estado `201`.

## Pruebas

El archivo `pruebas.http` contiene solicitudes para comprobar la creación, consulta, modificación y eliminación de tareas, además del filtrado entre tareas completadas y pendientes y diferentes casos de datos inválidos.