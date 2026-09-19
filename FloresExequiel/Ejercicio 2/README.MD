# Ejercicio 2: API de alumnos y calificaciones

## Decisiones de diseño

### Modelado de la información

Cada alumno se almacena en un arreglo interno con solo tres datos:

- `id`: identificador numérico autoincremental generado por el servidor.
- `nombre`: texto no vacío.
- `notas`: arreglo de exactamente tres números.

El **promedio** y la **condición académica** son datos derivados: se calculan cada vez que se consulta un alumno a partir de sus notas y **nunca se guardan** en el arreglo. Así se evita que queden desactualizados si las notas se modifican y se mantiene una única fuente de verdad.

### Identificador del recurso

Se utiliza un `id` numérico interno en lugar del nombre para identificar a cada alumno. El nombre es un dato modificable (y debe ser único), por lo que usarlo como identificador obligaría a cambiar la URL del recurso cada vez que se edite. Con un `id` estable, `PUT /alumnos/2` siempre apunta al mismo alumno, aunque cambie su nombre.

### Recurso y endpoints

El recurso es `/alumnos` (sustantivo en plural, según las convenciones REST).

| Método | Ruta           | Descripción                                                                               | Respuestas         |
| ------ | -------------- | ----------------------------------------------------------------------------------------- | ------------------ |
| GET    | `/alumnos`     | Lista todos los alumnos con promedio y condición. Admite el filtro opcional `?condicion=` | 200, 400           |
| GET    | `/alumnos/:id` | Consulta un alumno con sus notas, promedio y condición                                    | 200, 400, 404      |
| POST   | `/alumnos`     | Crea un alumno                                                                            | 201, 400, 409      |
| PUT    | `/alumnos/:id` | Modifica un alumno (reemplazo completo)                                                   | 200, 400, 404, 409 |
| DELETE | `/alumnos/:id` | Elimina un alumno                                                                         | 204, 400, 404      |

### Elección de métodos HTTP

- `GET` para consultas (seguro e idempotente).
- `POST` para crear, ya que el servidor asigna el `id`. Responde `201 Created` con el encabezado `Location` apuntando al nuevo recurso.
- `PUT` para modificar, porque se envía la representación completa del alumno (nombre y las tres notas). Es idempotente.
- `DELETE` para eliminar, respondiendo `204 No Content`.

No se incluye `PATCH` porque el alumno tiene solo dos campos y siempre se requiere que las tres notas se envíen juntas, por lo que el reemplazo completo resulta suficiente y más simple.

### Condición académica

Se calcula a partir del promedio, redondeado a dos decimales (el mismo valor que ve el cliente, para que el promedio y la condición siempre sean consistentes):

| Promedio                          | Condición      |
| --------------------------------- | -------------- |
| menor que 6                       | `reprobado`    |
| mayor o igual que 6 y menor que 8 | `aprobado`     |
| mayor o igual que 8               | `promocionado` |

El enunciado indica "6 o 7" para aprobado. Se interpretó como el intervalo [6, 8) para que los promedios con decimales (por ejemplo 7,5) queden cubiertos y no existan promedios sin condición asignada.

### Unicidad del nombre

No pueden existir dos alumnos con el mismo nombre, tanto al crear como al modificar. La comparación ignora mayúsculas/minúsculas y espacios al inicio y al final, de modo que "Ana Pérez" y "ana pérez " se consideran el mismo nombre. Al modificar, el alumno se excluye de la comparación para poder conservar su propio nombre. Si hay un conflicto se responde `409 Conflict`, el código apropiado para un choque con el estado actual del recurso.

### Validación

- **Params:** `id` debe ser un entero positivo (`400` si no lo es, `404` si no existe).
- **Query:** `condicion` solo admite `reprobado`, `aprobado` o `promocionado` (`400` en otro caso).
- **Body:**
  - `nombre`: texto no vacío, de hasta 100 caracteres. Se le quitan los espacios sobrantes.
  - `notas`: arreglo de exactamente 3 números entre 0 y 10.
  - El cuerpo debe ser un objeto JSON válido.

Todos los errores de validación se devuelven juntos en una lista (`errores`), para que el cliente pueda corregirlos de una sola vez.

### Almacenamiento

Como lo indica el enunciado, los datos se conservan en un arreglo en memoria. Esto implica que se pierden al reiniciar el servidor. El arreglo se inicializa con algunos alumnos de ejemplo para facilitar las pruebas.

### Manejo de errores

- `400 Bad Request`: datos inválidos o JSON mal formado.
- `404 Not Found`: alumno o ruta inexistente.
- `409 Conflict`: nombre repetido.
- `500 Internal Server Error`: errores inesperados.

Todas las respuestas de error usan formato JSON, igual que las respuestas exitosas.

### Organización del código

La validación (`validarId`, `validarAlumno`), el cálculo de datos derivados (`calcularPromedio`, `calcularCondicion`) y las rutas están separados en funciones pequeñas de una única responsabilidad. La función `presentarAlumno` es la única que arma la respuesta, lo que garantiza que el promedio y la condición se calculen siempre de la misma forma.

### Pruebas

El archivo `alumnos.http` incluye casos exitosos (listar, filtrar, consultar, crear, modificar, eliminar) y casos de error (nombre repetido al crear y modificar, notas faltantes, fuera de rango o no numéricas, nombre vacío, JSON inválido, id inválido, filtro inválido y recursos inexistentes).
