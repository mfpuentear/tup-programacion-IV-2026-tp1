# Ejercicio 3

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance.
Cada tarea deberá contar con un nombre y un estado que indique si fue
completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar consultas
que permitan diferenciar las tareas completadas de las pendientes.

## Decisiones de diseño

### Modelo de información

Se define una tarea con los siguientes atributos:
- `id`: identificador único
- `nombre`: nombre descriptivo de la tarea
- `completada`: valor booleano que indica si la tarea está finalizada

La lista de tareas se guarda dentro de un arreglo interno en memoria. Esta forma
permite mantener la lógica del ejercicio simple y fácil de comprender.

### Unicidad del recurso

Se evita la creación de tareas duplicadas verificando el nombre antes de agregar o
modificar una tarea, ignorando mayúsculas y minúsculas. Esto garantiza que cada
tarea tenga una identidad clara dentro de la colección.

### Filtrado por estado

Para diferenciar tareas completadas y pendientes, la consulta del listado acepta
el query param `completada`:
- `GET /tareas?completada=true`
- `GET /tareas?completada=false`

Esto mantiene la API RESTful y permite consultar subcolecciones sin alterar la
estructura del recurso.

### Validaciones

Antes de guardar o actualizar, la API valida:
- nombre obligatorio
- no duplicados
- `completada` debe ser un booleano

## Endpoints implementados

- `GET /tareas`
- `GET /tareas/:id`
- `POST /tareas`
- `PUT /tareas/:id`
- `DELETE /tareas/:id`

## Implementación

Se implementa la API de tareas en español con validación de duplicados,
filtrado por estado y archivo HTTP para probar los distintos métodos del
recurso.
