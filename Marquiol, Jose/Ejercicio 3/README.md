# Ejercicio 3

## Diseño

La información se modela mediante un arreglo interno llamado `tareas`.

Cada tarea contiene:

* `id`
* `nombre`
* `completada`

El campo `completada` permite representar si la tarea está terminada o pendiente.

## Metodos

* `GET /tareas`: obtiene todas las tareas.
* `GET /tareas/:id`: obtiene una tarea específica.
* `POST /tareas`: crea una nueva tarea.
* `PUT /tareas/:id`: modifica una tarea existente.
* `DELETE /tareas/:id`: elimina una tarea.

También se utiliza el parámetro de consulta `completada` para filtrar las tareas:

* `GET /tareas?completada=true`
* `GET /tareas?completada=false`

## Validaciones

Se valida que:

* El `id` sea válido.
* El nombre esté presente y no esté vacío.
* `completada` sea un valor booleano.
* No existan dos tareas con el mismo nombre.
* La tarea exista antes de modificarla o eliminarla.

El nombre se compara sin distinguir entre mayúsculas y minúsculas.
