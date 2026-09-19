# Ejercicio 2

## Diseño

La información se modela mediante un arreglo interno llamado `alumnos`.

Cada alumno contiene:

* `id`
* `nombre`
* `notas`

Las notas se almacenan en un arreglo interno con exactamente tres valores.

El promedio y la condición académica no se almacenan porque son datos derivados de las notas.

## Métodos

* `GET /alumnos`: obtiene todos los alumnos junto con su promedio y condición.
* `GET /alumnos/:id`: obtiene un alumno específico junto con su promedio y condición.
* `POST /alumnos`: crea un nuevo alumno.
* `PUT /alumnos/:id`: modifica un alumno existente.
* `DELETE /alumnos/:id`: elimina un alumno.

## Condición académica

La condición se obtiene a partir del promedio de las tres notas:

* Promedio menor a 6: `reprobado`.
* Promedio igual a 6 o menor a 7: `aprobado`.
* Promedio igual o mayor a 8: `promocionado`.

## Validaciones

Se valida que:

* El `id` sea válido.
* El nombre esté presente y no esté vacío.
* El alumno tenga exactamente tres notas.
* Las notas sean números entre 0 y 10.
* No existan dos alumnos con el mismo nombre.
* Al modificar un alumno, no se pueda utilizar el nombre de otro alumno existente.

El nombre se compara sin distinguir entre mayúsculas y minúsculas.
