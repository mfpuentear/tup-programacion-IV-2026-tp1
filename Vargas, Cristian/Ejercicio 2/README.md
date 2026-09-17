# Ejercicio 2 - Administración Académica de Alumnos y Calificaciones

## Enunciado

Desarrollar una API con ExpressJS para administrar la información académica de los alumnos de una materia y sus calificaciones. Cada alumno deberá contar con un nombre y tres notas, que se conservarán en un arreglo interno. No podrán existir alumnos con el mismo nombre al crear o modificar los registros.

Al consultar las notas de un alumno, la API deberá informar su promedio y su condición académica: reprobado para promedios menores a 6, aprobado para promedios de 6 o 7 y promocionado para promedios de 8 o más. El promedio y la condición son datos derivados, por lo que no deberán almacenarse en el arreglo interno.

Definir y fundamentar las decisiones de diseño necesarias para modelar la información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

1. **Modelado del Recurso (`/alumnos`)**:
   - Siguiendo los principios REST, el recurso se nombra en plural (`/alumnos`). Cada recurso individual representa a un alumno y puede ser identificado unívocamente por su nombre mediante el parámetro de ruta `/alumnos/:nombre`.

2. **Estructura del Arreglo Interno y Datos Derivados**:
   - Tal como indica el enunciado, el promedio y la condición académica son **datos derivados**, por lo que **no deben persistirse** en la estructura en memoria.
   - El arreglo almacena objetos con la forma mínima necesaria:
     ```json
     {
       "nombre": "Martin Gómez",
       "notas": [4, 5, 5]
     }
     ```
   - Al responder a una consulta (`GET`), creación (`POST`) o modificación (`PUT`), una función auxiliar calcula dinámicamente:
     - `promedio`: suma de las 3 notas dividida por 3 (redondeada a 2 decimales).
     - `condicion`:
       - `reprobado`: promedio menor a 6 (`< 6`).
       - `aprobado`: promedio de 6 o 7 (`>= 6 && < 8`).
       - `promocionado`: promedio de 8 o más (`>= 8`).
   - Esta separación garantiza la **integridad de los datos**: si las notas cambian, el promedio y la condición siempre reflejan el estado actual sin riesgo de inconsistencias.

3. **Operaciones y Métodos HTTP**:
   - `GET /alumnos`: Retorna el listado completo de alumnos con sus notas, promedio y condición calculados.
   - `GET /alumnos/:nombre`: Obtiene la información académica de un alumno puntual.
   - `POST /alumnos`: Crea un nuevo registro de alumno a partir del cuerpo de la petición (`req.body`).
   - `PUT /alumnos/:nombre`: Permite modificar las notas (o el nombre) del alumno indicado.
   - `DELETE /alumnos/:nombre`: Elimina el registro del alumno de la lista interna.

4. **Regla de Unicidad de Nombre**:
   - No pueden existir dos alumnos con el mismo nombre.
   - Tanto al crear (`POST`) como al modificar (`PUT`), se verifica que el nombre no coincida con ningún otro alumno registrado (comparación no sensible a mayúsculas/minúsculas).
   - En caso de duplicación, se responde con código `409 Conflict`.

5. **Validaciones de Entrada**:
   - El `nombre` debe ser una cadena no vacía.
   - El campo `notas` debe ser un arreglo de exactamente 3 números, cada uno comprendido en el rango escolar válido de `0` a `10`.
   - Si no cumple las validaciones, se responde con código `400 Bad Request`.

6. **Códigos de Estado HTTP Utilizados**:
   - `200 OK`: Consulta, modificación o eliminación exitosa.
   - `201 Created`: Creación exitosa de un alumno.
   - `400 Bad Request`: Datos de entrada inválidos o faltantes.
   - `404 Not Found`: Alumno no encontrado.
   - `409 Conflict`: Intento de registrar o modificar con un nombre ya existente.

---

## Ejecución y Pruebas

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor:
   ```bash
   npm start
   ```
3. Ejecutar las pruebas detalladas en `ejercicio2.http`.
