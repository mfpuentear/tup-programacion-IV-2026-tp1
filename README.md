## Diseño y Decisiones Técnicas

A continuación se detallan y fundamentan las decisiones de arquitectura, modelado de datos y diseño de endpoints adoptadas para la resolución de cada uno de los ejercicios del Trabajo Práctico N° 1.

---

### Ejercicio 1: API para Cálculo Geométrico de Rectángulos

* **Diseño del Endpoint:** Se optó por una ruta de lectura bajo el método `GET` (`/api/v1/rectangulos/calcular`) debido a que la operación es puramente de consulta y cálculo idempotente (no modifica ni persiste ningún estado en el servidor).
* **Uso de Query Parameters:** Se utilizan parámetros de consulta (`?base=X&altura=Y`) para el envío de los datos numéricos, respetando las convenciones REST para filtrado o envío de valores en peticiones de tipo `GET`.
* **Validación de Entradas:**
  * Se verifica la presencia obligatoria de ambos parámetros (`base` y `altura`).
  * Se valida mediante `parseFloat` que las entradas representen valores numéricos válidos (`!isNaN`).
  * Se aplica una regla de negocio para exigir que los valores sean estrictamente mayores a cero (`b > 0` y `a > 0`), retornando un código de estado `400 Bad Request` en caso de infracción.
* **Respuesta en JSON:** Devuelve un objeto donde la propiedad `esCuadrado` se determina al vuelo mediante una evaluación lógica booleana (`base === altura`), entregando los resultados de perímetro y superficie en una sola estructura clara.

---

### Ejercicio 2: API de Gestión y Condición Académica de Alumnos

* **Modelado de Datos:** La información se mantiene en memoria principal en un arreglo de objetos. Cada alumno cuenta con un `id` numérico único, un `nombre` de tipo cadena y un arreglo de 3 `notas`.
* **Cálculo al Vuelo:** Se decidió no almacenar de manera estática el `promedio` ni la `condicion` en la estructura persistida. En su lugar, se computan dinámicamente cada vez que se consulta la API a través de una función auxiliar. Esto evita discrepancias de datos y garantiza la consistencia del estado.
* **Diseño de Endpoints:**
  * `GET /api/v1/alumnos`: Recupera el listado completo procesando el estado académico de cada estudiante.
  * `GET /api/v1/alumnos/:id`: Utiliza parámetros de ruta (`params`) para la búsqueda de un recurso específico por su identificador. Retorna `404 Not Found` si el ID no existe.
  * `POST /api/v1/alumnos`: Permite dar de alta un nuevo alumno enviando el recurso en el cuerpo de la petición (`body`). Retorna `201 Created` en caso de éxito.
* **Validación y Control de Duplicados:**
  * Se valida que el arreglo de notas contenga exactamente 3 elementos y que sus valores se encuentren dentro del rango permitido (0 a 10).
  * Se implementa un control de unicidad por nombre (ignorando mayúsculas y minúsculas). Si el alumno ya existe, la API responde con un código `409 Conflict`.

---

### Ejercicio 3: API de Administración de Tareas y Estados

* **Modelado de Datos:** Las tareas se gestionan en memoria con una estructura compuesta por un `id` único, un `nombre` y un indicador booleano `completada` que representa su estado de avance.
* **Diseño de Endpoints y Métodos HTTP:**
  * `GET /api/v1/tareas`: Permite consultar la lista general de tareas.
  * `POST /api/v1/tareas`: Registra una nueva tarea. Por defecto, las tareas creadas inician en estado pendiente (`completada: false`). Retorna `201 Created`.
  * `PATCH /api/v1/tareas/:id/estado`: Se seleccionó el método `PATCH` en lugar de `PUT` debido a que la acción realiza una modificación parcial sobre un único atributo de la entidad (`completada`), sin necesidad de reenviar todo el objeto.
* **Filtrado por Query Params:**
  * El endpoint `GET` soporta la consulta opcional del parámetro `?completada=true` o `?completada=false`. Esto permite filtrar dinámicamente las tareas según su estado sin necesidad de crear rutas o endpoints adicionales.
* **Validaciones de Negocio:**
  * Se valida que el campo `nombre` no esté vacío ni contenga únicamente espacios en blanco.
  * Se verifica la unicidad del nombre de la tarea para prevenir duplicados (`409 Conflict`).
  * En la actualización con `PATCH`, se exige estrictamente que el valor del campo `completada` sea de tipo booleano (`true`/`false`), devolviendo `400 Bad Request` en caso contrario.