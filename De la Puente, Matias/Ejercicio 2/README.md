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

## Decisiones de diseño

### Modelo de información

Se modela cada alumno como un recurso con:
- `id`: identificador único
- `nombre`: nombre del alumno
- `notas`: arreglo con exactamente tres notas

La colección de alumnos se conserva en un arreglo interno en memoria. Esto es
suficiente para la consigna y mantiene la lógica del ejercicio simple y clara.

### Derivación de datos

El promedio y la condición académica no forman parte del almacenamiento:
- el promedio se calcula a partir de las tres notas
- la condición se evalúa según el promedio

Esto evita duplicidad de datos y mantiene la consistencia del modelo, ya que la
condición siempre se deduce de la realidad del alumno.

### Validaciones

Antes de guardar o actualizar un alumno, la API comprueba:
- que el nombre no esté vacío
- que no exista otro alumno con el mismo nombre ignorando mayúsculas/minúsculas
- que `notas` sea un arreglo con tres números válidos entre 0 y 10

### Exposición de la funcionalidad

La API expone una interfaz REST para consultar, crear, actualizar y eliminar
alumnos. La respuesta incluye el promedio y la condición académica en cada
consulta al recurso individual o a la colección.

## Endpoints implementados

- `GET /alumnos`
- `GET /alumnos/:id`
- `POST /alumnos`
- `PUT /alumnos/:id`
- `DELETE /alumnos/:id`

## Implementación

Se crea un servicio REST con validaciones de nombre y notas, cálculo del
promedio, clasificación académica y pruebas HTTP para listar, crear, actualizar
y eliminar estudiantes.
