# Ejercicio 2 - API de Gestión Académica de Alumnos

Desarrollar una API con ExpressJS para administrar la información académica de
los alumnos de una materia y sus calificaciones. Cada alumno deberá contar con
un nombre y tres notas, que se conservarán en un arreglo interno. No podrán
existir alumnos con el mismo nombre al crear o modificar los registros.

Al consultar las notas de un alumno, la API deberá informar su promedio y su
condición académica: reprobado para promedios menores a 6, aprobado para
promedios de 6 o 7 y promocionado para promedios de 8 o más. El promedio y la
condición son datos derivados, por lo que no deberán almacenarse en el arreglo
interno.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

### 1. Modelado de la Información y Datos Derivados
- **Arreglo interno sin datos derivados:** Se modela la clase `Alumno` conservando en memoria únicamente `id`, `nombre` y `notas` (exactamente 3 números).
- **Cálculo dinámico de Promedio y Condición:** En estricto cumplimiento de la consigna (*"El promedio y la condición son datos derivados, por lo que no deberán almacenarse en el arreglo interno"*), ambos valores se calculan al vuelo mediante getters:
  - $\text{Promedio} = \frac{\text{nota}_1 + \text{nota}_2 + \text{nota}_3}{3}$ (redondeado a 2 decimales).
  - **Condición Académica:**
    - `reprobado`: Promedio menor a 6.
    - `aprobado`: Promedio de 6 o 7 ($6 \le \text{promedio} < 8$).
    - `promocionado`: Promedio de 8 o más ($\text{promedio} \ge 8$).
- **Fundamentación:** Guardar datos derivados en memoria genera redundancia y abre la posibilidad a desincronizaciones si se modifican las notas vía `PUT`. El cálculo dinámico garantiza la integridad del estado.

### 2. Control de Unicidad de Nombres
- **Restricción:** No pueden existir dos alumnos con el mismo nombre al crear o modificar.
- **Normalización:** La comparación es insensible a mayúsculas/minúsculas y espacios en blanco (`trim().toLowerCase()`).
- **Código HTTP `409 Conflict`:** Se seleccionó `409 Conflict` porque es el código estándar REST para colisiones con el estado actual del recurso (violación de clave única).

### 3. Exposición de la Funcionalidad y Diseño REST
- **Recurso principal:** `/alumnos`.
- **Consulta de notas y condición:** `GET /alumnos/:id/notas` responde directamente al requerimiento de consultar las calificaciones informando el promedio y la condición académica.
- **Filtrado por condición:** `GET /alumnos?condicion=reprobado|aprobado|promocionado`.
- **Códigos de estado:** `200 OK`, `201 Created`, `400 Bad Request` ante entradas inválidas, `404 Not Found` ante registros inexistentes y `409 Conflict` ante duplicidad de nombre.

### 4. Validación de Entrada
- `nombre`: Requerido, string no vacío.
- `notas`: Exactamente 3 notas numéricas en rango 0 a 10.
- `:id`: Entero positivo mayor a 0.

---

## Ejecución y Pruebas

1. Instalar dependencias e iniciar:
   ```bash
   cd "Merlo Brac, Federico/Ejercicio 2"
   npm install
   npm start
   ```

2. Pruebas automáticas:
   ```bash
   npm test
   ```

3. Pruebas interactivas:
   Utilizar el archivo [`ejercicio2.http`](./ejercicio2.http) con REST Client de VS Code.
