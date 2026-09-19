# Fundamentación del diseño

Para resolver el ejercicio se utilizó ExpressJS y se implementó una API REST para administrar alumnos y sus calificaciones.

La información se almacena en un arreglo interno llamado `alumnos`. Cada registro contiene un identificador, el nombre del alumno y un arreglo con exactamente tres notas. Se decidió utilizar un arreglo en memoria porque la consigna solicita conservar la información en una estructura interna y no requiere el uso de una base de datos.

Cada alumno posee un `id` numérico generado automáticamente. De esta manera se puede identificar cada registro de forma independiente aunque los nombres sean similares.

Se estableció como regla que no pueden existir dos alumnos con el mismo nombre. La comparación de nombres se realiza sin diferenciar mayúsculas y minúsculas, por lo que, por ejemplo, "Ariel Rivero" y "ariel rivero" se consideran el mismo alumno. También se eliminan espacios innecesarios al principio y al final del nombre.

Las notas deben ser exactamente tres valores numéricos comprendidos entre 0 y 10. Si se recibe una cantidad diferente de notas o algún valor fuera del rango permitido, la API responde con el código HTTP 400.

Cuando se intenta crear o modificar un alumno utilizando un nombre que ya existe, la API responde con el código HTTP 409, ya que existe un conflicto con un registro existente.

El promedio y la condición académica no se almacenan dentro del arreglo interno. Estos datos son derivados de las tres notas y se calculan solamente cuando se prepara la respuesta de la API. Esto evita almacenar información que puede obtenerse directamente a partir de los datos originales.

La condición académica se determina de acuerdo con las reglas indicadas en la consigna: los promedios menores a 6 corresponden a "reprobado", los promedios desde 6 y menores a 8 corresponden a "aprobado", y los promedios de 8 o más corresponden a "promocionado".

La API cuenta con los siguientes endpoints:

* `GET /alumnos`: permite consultar todos los alumnos.
* `GET /alumnos/:id`: permite consultar un alumno específico.
* `POST /alumnos`: permite crear un nuevo alumno.
* `PUT /alumnos/:id`: permite reemplazar los datos de un alumno existente.
* `DELETE /alumnos/:id`: permite eliminar un alumno.

También se contemplan errores relacionados con identificadores inválidos y alumnos inexistentes, utilizando los códigos HTTP 400 y 404 según corresponda.

Finalmente, se realizaron pruebas mediante un archivo `.http`, incluyendo casos normales y casos de error. Se probaron las tres condiciones académicas, la creación de nombres duplicados, notas inválidas, consultas de alumnos inexistentes, modificaciones y eliminaciones.
