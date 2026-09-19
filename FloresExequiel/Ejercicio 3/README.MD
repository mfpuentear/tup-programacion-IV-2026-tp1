# Ejercicio 3: API de tareas

## Decisiones de diseño

### Modelado de la información

Cada tarea se almacena en un arreglo interno con tres datos:

- `id`: identificador numérico autoincremental generado por el servidor.
- `nombre`: texto no vacío y único.
- `completada`: valor booleano (`true` si la tarea fue completada, `false` si está pendiente).

El estado se modela como un **booleano** y no como un texto (`"completada"` / `"pendiente"`) porque el enunciado solo distingue dos situaciones posibles. Un booleano no admite valores intermedios ni errores de escritura, y simplifica tanto la validación como el filtrado. Si en el futuro se agregaran más estados (por ejemplo "en progreso"), habría que reemplazarlo por un campo de tipo enumerado.

### Identificador del recurso

Se utiliza un `id` numérico interno en lugar del nombre. El nombre es un dato modificable y debe ser único, por lo que usarlo como identificador obligaría a cambiar la URL del recurso cada vez que se renombre una tarea. Con un `id` estable, `/tareas/2` siempre apunta a la misma tarea.

### Recurso y endpoints

El recurso es `/tareas` (sustantivo en plural, según las convenciones REST).

| Método | Ruta          | Descripción                                                                                | Respuestas         |
| ------ | ------------- | ------------------------------------------------------------------------------------------ | ------------------ |
| GET    | `/tareas`     | Lista todas las tareas. Admite el filtro opcional `?completada=true` o `?completada=false` | 200, 400           |
| GET    | `/tareas/:id` | Consulta una tarea                                                                         | 200, 400, 404      |
| POST   | `/tareas`     | Crea una tarea (`completada` es `false` por defecto)                                       | 201, 400, 409      |
| PUT    | `/tareas/:id` | Reemplaza una tarea completa (`nombre` y `completada` obligatorios)                        | 200, 400, 404, 409 |
| PATCH  | `/tareas/:id` | Modifica parcialmente una tarea (`nombre` y/o `completada`)                                | 200, 400, 404, 409 |
| DELETE | `/tareas/:id` | Elimina una tarea                                                                          | 204, 400, 404      |

### Consultas de tareas completadas y pendientes

La diferenciación se resuelve con un **filtro por query string** sobre la misma colección (`GET /tareas?completada=true` para las completadas y `GET /tareas?completada=false` para las pendientes), en lugar de crear rutas separadas como `/tareas/completadas` y `/tareas/pendientes`. Se eligió esta opción porque:

- Filtrar es una operación sobre la colección, no un recurso distinto.
- Evita duplicar rutas y lógica.
- Permite agregar más filtros en el futuro sin cambiar la estructura de la API.
- Sin filtro, el endpoint devuelve todas las tareas.

### Elección de métodos HTTP

- `GET` para consultas (seguro e idempotente).
- `POST` para crear, ya que el servidor asigna el `id`. Responde `201 Created` con el encabezado `Location` apuntando a la nueva tarea.
- `PUT` para reemplazar la tarea completa. Es idempotente.
- `PATCH` para modificaciones parciales. Se incluye porque la operación más habitual sobre una tarea es cambiar su estado (marcarla como completada) sin necesidad de reenviar el nombre.
- `DELETE` para eliminar, respondiendo `204 No Content`.

### Unicidad del nombre

No pueden existir dos tareas con el mismo nombre, tanto al crear como al modificar (`POST`, `PUT` y `PATCH`). La comparación ignora mayúsculas/minúsculas y los espacios al inicio y al final, de modo que "Hacer el TP" y "hacer el tp " se consideran el mismo nombre. Al modificar, la tarea se excluye de la comparación para poder conservar su propio nombre. Ante un conflicto se responde `409 Conflict`, el código apropiado para un choque con el estado actual del recurso.

### Validación

- **Params:** `id` debe ser un entero positivo (`400` si no lo es, `404` si no existe).
- **Query:** `completada` solo admite los valores `true` o `false` (`400` en otro caso).
- **Body:**
  - `nombre`: texto no vacío de hasta 100 caracteres. Se le quitan los espacios sobrantes.
  - `completada`: debe ser un booleano real (`true` o `false`), no un texto.
  - En `POST`, `nombre` es obligatorio y `completada` es opcional (por defecto `false`).
  - En `PUT`, ambos campos son obligatorios.
  - En `PATCH`, debe enviarse al menos uno de los dos.
  - El cuerpo debe ser un objeto JSON válido.

Todos los errores de validación se devuelven juntos en una lista (`errores`), para que el cliente pueda corregirlos de una sola vez.

### Almacenamiento

Como lo indica el enunciado, los datos se conservan en un arreglo en memoria, por lo que se pierden al reiniciar el servidor. El arreglo se inicializa con algunas tareas de ejemplo para facilitar las pruebas.

### Manejo de errores

- `400 Bad Request`: datos inválidos o JSON mal formado.
- `404 Not Found`: tarea o ruta inexistente.
- `409 Conflict`: nombre repetido.
- `500 Internal Server Error`: errores inesperados.

Todas las respuestas de error usan formato JSON, igual que las respuestas exitosas.

### Organización del código

La validación (`validarId`, `validarTarea`) y las rutas están separadas en funciones pequeñas de una única responsabilidad. La función `validarTarea` recibe el modo de operación (`crear`, `reemplazar` o `parcial`) y reutiliza las mismas reglas para `POST`, `PUT` y `PATCH`, evitando código duplicado.

### Pruebas

El archivo `tareas.http` incluye casos exitosos (listar, filtrar por completadas y pendientes, consultar, crear, modificar parcialmente, reemplazar y eliminar) y casos de error (nombre repetido en las tres operaciones de escritura, campos faltantes o inválidos, JSON mal formado, id inválido, filtro inválido y recursos inexistentes).
