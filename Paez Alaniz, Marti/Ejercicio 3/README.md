# Ejercicio 3

Desarrollar una API con ExpressJS para administrar tareas y su estado de
avance. Cada tarea deberá contar con un nombre y un estado que indique si fue
completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar
consultas que permitan diferenciar las tareas completadas de las pendientes.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Recurso:** `tareas`. Cada tarea se modela como `{ nombre, completada }`,
  con `completada` booleano.
- **Identificador:** al igual que en el ejercicio 2, el `nombre` es único por
  consigna, así que se usa como identificador en la URL (`/tareas/:nombre`) en
  vez de agregar un `id` artificial.
- **Diferenciar completadas de pendientes:** se resuelve con un *query param*
  de filtro sobre el mismo recurso (`GET /tareas?completada=true|false`), en
  vez de crear rutas separadas como `/tareas/completadas`. Es la forma más
  RESTful: `tareas` sigue siendo un único recurso, y el filtro es un criterio
  de búsqueda sobre sus atributos, no un recurso en sí mismo.
- **Métodos HTTP:**
  - `POST /tareas` — crea una tarea. Body: `{ nombre }` (nace `pendiente`,
    es decir `completada: false`).
  - `GET /tareas` — lista tareas; admite `?completada=true` o
    `?completada=false` para filtrar.
  - `GET /tareas/:nombre` — consulta una tarea puntual.
  - `PUT /tareas/:nombre` — actualiza el estado (`completada`) y/o el nombre.
  - `DELETE /tareas/:nombre` — elimina una tarea.
- **Validaciones:**
  - `nombre`: string no vacío y único al crear o renombrar (`409 Conflict` si
    ya existe).
  - `completada` (en `PUT`): debe ser booleano si se envía.
  - `?completada=` (en `GET`): si viene, debe ser literalmente `"true"` o
    `"false"`; cualquier otro valor devuelve `400`.
  - Tarea inexistente en `GET/PUT/DELETE /tareas/:nombre` → `404`.

## Endpoints

| Método | Ruta                        | Descripción                              |
|--------|-----------------------------|-------------------------------------------|
| POST   | /tareas                     | Crear tarea (pendiente por defecto)       |
| GET    | /tareas                     | Listar tareas                             |
| GET    | /tareas?completada=true     | Listar solo completadas                   |
| GET    | /tareas?completada=false    | Listar solo pendientes                    |
| GET    | /tareas/:nombre             | Consultar una tarea                       |
| PUT    | /tareas/:nombre             | Modificar nombre y/o estado               |
| DELETE | /tareas/:nombre             | Eliminar tarea                            |
