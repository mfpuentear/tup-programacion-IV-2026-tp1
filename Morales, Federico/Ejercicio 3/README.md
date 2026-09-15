# Ejercicio 3 - Tareas y estado de avance

## Decisiones de diseño

- **Recurso**: se modela como `tareas`, con persistencia en memoria (arreglo
  en el servidor), igual que en el Ejercicio 2.

- **Identificador**: se usa el **nombre de la tarea** como identificador en
  la URL (`/tareas/:nombre`), ya que la consigna exige nombres únicos.

- **Métodos HTTP**:
  - `GET /tareas` — listar todas las tareas.
  - `GET /tareas?completada=true` / `?completada=false` — filtrar tareas
    completadas o pendientes, cumpliendo con el requisito de diferenciarlas.
  - `GET /tareas/:nombre` — consultar una tarea puntual.
  - `POST /tareas` — crear una tarea nueva (nace como pendiente).
  - `PATCH /tareas/:nombre` — marcar una tarea como completada o pendiente.
  - `DELETE /tareas/:nombre` — eliminar una tarea.

- **PATCH en vez de PUT**: para cambiar el estado se eligió `PATCH` porque la
  operación modifica **parcialmente** el recurso (solo el campo `completada`),
  a diferencia de `PUT`, que se reserva para reemplazar el recurso completo.

- **Validaciones**:
  - El nombre debe ser un string no vacío.
  - No se permite crear una tarea con un nombre ya existente: la API
    responde `409 Conflict`.
  - El campo `completada` en el `PATCH` debe ser un booleano; si no,
    responde `400 Bad Request`.
  - Si se consulta, actualiza o borra una tarea inexistente, responde
    `404 Not Found`.