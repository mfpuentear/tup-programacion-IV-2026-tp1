# Ejercicio 3 - API de Administración de Tareas y Estado de Avance

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance.
Cada tarea deberá contar con un nombre y un estado que indique si fue
completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar consultas
que permitan diferenciar las tareas completadas de las pendientes.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

### 1. Modelado de la Información y Estados de Avance
- **Estructura de la Entidad `Tarea`:** Se modela una clase `Tarea` conservando en el arreglo interno:
  - `id`: Identificador numérico único correlativo.
  - `nombre`: Cadena de texto descriptiva de la tarea.
  - `completada`: Indicador booleano (`true` o `false`).
- **Propiedad Derivada `estado`:** Se añade un getter que proyecta `'completada'` si `completada === true`, o `'pendiente'` si `completada === false`.
- **Fundamentación:** El tipo booleano es la representación más precisa y eficiente para estados binarios (cumplida vs. pendiente), mientras que la propiedad derivada textual ofrece claridad e interoperabilidad.

### 2. Control Estricto de Unicidad de Nombres
- **Restricción:** No pueden existir tareas con el mismo nombre al crear o modificar registros.
- **Normalización:** La verificación se realiza sin distinción entre mayúsculas y minúsculas y omitiendo espacios en los extremos (`trim().toLowerCase()`).
- **Código HTTP `409 Conflict`:** Se emplea `409 Conflict` para señalar que la solicitud no puede procesarse debido a un conflicto con el estado actual del recurso (violación de unicidad de nombre).

### 3. Exposición de la Funcionalidad y Diferenciación de Estados
- **Recurso principal:** `/tareas`.
- **Diferenciación de tareas:** Para cumplir con el requerimiento de *"facilitar consultas que permitan diferenciar las tareas completadas de las pendientes"*, se implementa el filtrado estándar por query params:
  - `GET /tareas?completada=true` (o `?estado=completada`).
  - `GET /tareas?completada=false` (o `?estado=pendiente`).
- **Códigos de estado:**
  - `200 OK`: Consultas, modificaciones y eliminaciones exitosas.
  - `201 Created`: Tarea creada correctamente.
  - `400 Bad Request`: Datos de entrada inválidos (nombre vacío o tipo no booleano).
  - `404 Not Found`: Tarea con el ID solicitado inexistente.
  - `409 Conflict`: Denominación duplicada en creación o modificación.

### 4. Validación de Entrada
- `nombre`: Requerido, string no vacío.
- `completada`: Opcional en creación (por defecto `false`), debe ser estrictamente de tipo booleano si se envía.
- `:id`: Entero positivo mayor a 0.

---

## Ejecución y Pruebas

1. Instalar dependencias e iniciar:
   ```bash
   cd "Merlo Brac, Federico/Ejercicio 3"
   npm install
   npm start
   ```

2. Pruebas automáticas:
   ```bash
   npm test
   ```

3. Pruebas interactivas:
   Utilizar el archivo [`ejercicio3.http`](./ejercicio3.http) con la extensión REST Client de VS Code.
