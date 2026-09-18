# Ejercicio 2 - Alumnos y calificaciones

API desarrollada con ExpressJS para administrar la información académica de los alumnos de una materia y sus calificaciones.

## Recurso

Se definió el recurso:

`/alumnos`

Cada alumno se representa mediante un nombre y un arreglo que contiene exactamente tres notas.

Ejemplo:

{
    "nombre": "Victor",
    "notas": [8, 9, 7]
}

Los alumnos se almacenan en un arreglo interno mientras el servidor se encuentra en ejecución.

## Métodos HTTP

Se definieron los siguientes métodos:

- `POST /alumnos`: crea un nuevo alumno.
- `GET /alumnos`: consulta todos los alumnos.
- `GET /alumnos/:nombre`: consulta un alumno determinado.
- `PUT /alumnos/:nombre`: modifica los datos de un alumno.
- `DELETE /alumnos/:nombre`: elimina un alumno.

El nombre se utiliza como identificador del alumno, por lo que no se permiten alumnos con nombres repetidos.

## Validaciones

Al crear o modificar un alumno se verifica que:

- El nombre exista y sea una cadena de texto válida.
- Se proporcionen exactamente tres notas.
- Cada nota sea un número entre 0 y 10.
- No exista otro alumno con el mismo nombre.

La comparación de nombres no distingue entre mayúsculas y minúsculas para evitar duplicados como `Victor` y `VICTOR`.

Cuando se intenta consultar, modificar o eliminar un alumno inexistente, la API devuelve el código de estado `404`.

Los datos inválidos devuelven el código de estado `400`.

La creación correcta de un alumno devuelve `201`.

## Promedio y condición académica

El promedio se calcula al momento de realizar la consulta utilizando las tres notas del alumno.

La condición académica se determina de la siguiente manera:

- Promedio menor a 6: `reprobado`.
- Promedio desde 6 y menor a 8: `aprobado`.
- Promedio igual o mayor a 8: `promocionado`.

El promedio y la condición académica son datos derivados, por lo que no se almacenan en el arreglo interno.

## Pruebas

El archivo `pruebas.http` contiene solicitudes para comprobar la creación, consulta, modificación y eliminación de alumnos, además de diferentes casos de datos inválidos.