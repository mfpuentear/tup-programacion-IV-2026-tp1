# Ejercicio 2

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

## Decisiones de diseño

- **Datos derivados no almacenados:** el promedio y la condición académica se calculan dentro del handler de `GET /alumnos/:nombre` a partir de las notas, y nunca se guardan en el arreglo interno, tal como exige el enunciado.

- **Condición académica en el límite entre 7 y 8:** el enunciado no define qué corresponde a un promedio entre 7 y 8 (por ejemplo, 7.5). Se interpretó que todo promedio mayor a 7 corresponde a "promocionado", dejando "aprobado" limitado al rango [6, 7].

- **Identificador del alumno:** se utiliza el `nombre` como identificador en la URL, ya que el enunciado exige que sea único, evitando así agregar un id autogenerado no solicitado.

- **Actualización parcial en `PUT`:** se permite modificar `nombre`, `notas`, o ambos en una misma solicitud, validando en cada caso que el nuevo valor cumpla las mismas reglas que en la creación (nombre de tipo texto y no duplicado, notas como arreglo de 3 números entre 0 y 10).
