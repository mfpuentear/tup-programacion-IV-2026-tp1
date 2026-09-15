# Ejercicio 2 - Alumnos y notas

## Decisiones de diseño

- **Recurso**: se modela como `alumnos`, con persistencia en memoria (un
  arreglo en el servidor). A diferencia del Ejercicio 1, acá sí hay un CRUD
  real sobre datos que se crean, consultan, modifican y borran.

- **Identificador**: se usa el **nombre del alumno** como identificador en la
  URL (`/alumnos/:nombre`) en lugar de un ID numérico, ya que la consigna
  exige que los nombres sean únicos, por lo que ya funcionan como clave.

- **Métodos HTTP**:
  - `GET /alumnos` — listar todos los alumnos.
  - `GET /alumnos/:nombre` — consultar un alumno puntual.
  - `POST /alumnos` — crear un alumno nuevo.
  - `PUT /alumnos/:nombre` — reemplazar las notas de un alumno existente.
  - `DELETE /alumnos/:nombre` — eliminar un alumno.

- **Datos derivados**: `promedio` y `condicion` (reprobado, aprobado o
  promocionado) **no se almacenan** en el arreglo interno; se calculan al
  momento de responder cada consulta, tal como pide la consigna.

- **Validaciones**:
  - El nombre debe ser un string no vacío.
  - Las notas deben ser un arreglo de exactamente 3 números entre 0 y 10.
  - No se permite crear ni dejar dos alumnos con el mismo nombre: si ya
    existe, la API responde `409 Conflict`.
  - Ante datos inválidos, la API responde `400 Bad Request`.
  - Si se consulta, modifica o borra un alumno inexistente, responde
    `404 Not Found`.