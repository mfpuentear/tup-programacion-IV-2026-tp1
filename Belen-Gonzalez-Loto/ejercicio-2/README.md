# Ejercicio 2

## Descripcion del ejercicio

Se desarrollo una API con ExpressJS para administrar la informacion academica de los alumnos de una materia y sus calificaciones.

Cada alumno cuenta con un nombre y tres notas. Estos datos se conservan en un arreglo interno dentro de la aplicacion.

Al consultar la informacion de un alumno, la API informa tambien su promedio y su condicion academica. Estos dos valores son datos derivados, por lo tanto no se almacenan en el arreglo interno, sino que se calculan en el momento de responder la consulta.

## Recurso modelado

El recurso elegido es alumnos.

Se eligio este nombre porque la informacion principal que administra la API corresponde a alumnos de una materia. Cada alumno tiene sus propias calificaciones y a partir de ellas se puede obtener su promedio y condicion academica.

El recurso se maneja en plural porque representa una coleccion de alumnos.

## Almacenamiento interno

Los alumnos se guardan en un arreglo interno llamado alumnos.

Cada elemento del arreglo tiene esta estructura:

{
  "nombre": "Ana Perez",
  "notas": [7, 8, 6]
}

Solo se almacenan el nombre y las tres notas, porque son los datos propios del alumno.

No se almacenan el promedio ni la condicion academica porque son datos derivados. Esto significa que pueden obtenerse a partir de las notas cada vez que se realiza una consulta.

## Rutas definidas

Las rutas definidas son:

GET /api/alumnos

GET /api/alumnos/:nombre

POST /api/alumnos

PUT /api/alumnos/:nombre

DELETE /api/alumnos/:nombre

Se utiliza el prefijo /api para indicar que las rutas pertenecen a una API.

Se utiliza alumnos como nombre del recurso porque la API administra registros de alumnos.

Se utiliza el parametro :nombre en algunas rutas porque el nombre identifica al alumno dentro del arreglo interno.

## Justificacion de los metodos HTTP

## GET /api/alumnos

Se utiliza GET para consultar la lista completa de alumnos.

Este metodo no modifica el arreglo interno. Solamente devuelve la informacion almacenada y calcula los datos derivados de cada alumno, como promedio y condicion academica.

## GET /api/alumnos/:nombre

Se utiliza GET para consultar la informacion academica de un alumno especifico.

El nombre se envia como parametro de ruta porque se quiere obtener un recurso puntual dentro de la coleccion alumnos.

La respuesta incluye el nombre, las notas, el promedio y la condicion academica.

## POST /api/alumnos

Se utiliza POST para crear un nuevo alumno dentro del arreglo interno.

Este metodo corresponde porque se agrega un nuevo recurso a la coleccion alumnos.

Antes de crear el alumno, se valida que el nombre sea valido, que las notas sean validas y que no exista otro alumno con el mismo nombre.

## PUT /api/alumnos/:nombre

Se utiliza PUT para modificar completamente la informacion de un alumno existente.

Este metodo corresponde porque se reemplazan los datos principales del alumno: nombre y notas.

No se utiliza PATCH porque la API no permite modificar solo una parte del alumno. Para actualizarlo, se debe enviar nuevamente toda la informacion necesaria.

Tambien se valida que, al modificar el nombre, no se genere un duplicado con otro alumno existente.

## DELETE /api/alumnos/:nombre

Se utiliza DELETE para eliminar un alumno existente del arreglo interno.

Este metodo corresponde porque la operacion quita un recurso de la coleccion alumnos.

Si el alumno no existe, la API responde con un error.

## Justificacion de metodos no utilizados

No se utiliza PATCH porque no se implemento una modificacion parcial de los datos del alumno. La actualizacion se realiza con PUT enviando el nombre y las tres notas completas.

No se utiliza POST para consultar porque POST se reserva para crear nuevos alumnos. Las consultas se realizan con GET.

No se utiliza PUT para crear porque PUT se utiliza en esta API para reemplazar un alumno que ya existe.

## Parametros y cuerpo de las peticiones

## Parametro de ruta nombre

En las rutas GET, PUT y DELETE de un alumno especifico se utiliza el parametro de ruta nombre.

Ejemplo:

GET /api/alumnos/Ana%20Perez

Se utiliza el nombre como identificador porque la consigna indica que no pueden existir alumnos con el mismo nombre. Por ese motivo, el nombre permite encontrar un alumno concreto dentro del arreglo.

## Body para crear o modificar alumnos

Para crear o modificar alumnos se envia un body en formato JSON.

Ejemplo:

{
  "nombre": "Ana Perez",
  "notas": [7, 8, 6]
}

Se utiliza JSON porque es un formato comun para enviar informacion estructurada en APIs HTTP.

## Justificacion de los nombres de campos

## nombre

Se utiliza el campo nombre porque representa la identificacion del alumno dentro de la materia.

El nombre debe ser unico, ya que la consigna indica que no pueden existir alumnos con el mismo nombre al crear o modificar registros.

Tambien se valida que sea texto y que tenga una longitud razonable.

## notas

Se utiliza el campo notas porque representa las calificaciones del alumno.

Se guarda como arreglo porque la consigna indica que cada alumno debe contar con tres notas. El arreglo permite conservar esas tres calificaciones juntas y recorrerlas facilmente para calcular el promedio.

## promedio

El promedio se informa en las respuestas, pero no se almacena en el arreglo interno.

Se calcula sumando las tres notas y dividiendo el resultado por tres.

promedio = suma de notas / cantidad de notas

Esto evita guardar informacion repetida que podria quedar desactualizada si cambian las notas.

## condicion

La condicion academica tambien se informa en las respuestas, pero no se almacena en el arreglo interno.

Se calcula a partir del promedio con los siguientes criterios:

- Reprobado: promedio menor a 6.
- Aprobado: promedio igual a 6 o 7.
- Promocionado: promedio igual o mayor a 8.

La condicion es un dato derivado porque depende directamente del promedio.

## Validaciones realizadas

La API valida los datos recibidos antes de crear o modificar un alumno.

## Validacion del nombre

Se valida que el nombre haya sido enviado.

Se valida que el nombre sea de tipo texto.

Se eliminan espacios innecesarios al principio y al final del nombre.

Se valida que el nombre tenga entre 2 y 50 caracteres. Se eligio este rango porque un nombre de menos de 2 caracteres no resulta representativo y un nombre de mas de 50 caracteres se considera excesivo para el contexto del ejercicio.

Se valida que no exista otro alumno con el mismo nombre. Para evitar duplicados, se compara el nombre sin distinguir mayusculas y minusculas.

Ejemplo: Ana Perez y ana perez se consideran el mismo alumno.

## Validacion de notas

Se valida que las notas hayan sido enviadas.

Se valida que notas sea un arreglo.

Se valida que el arreglo tenga exactamente tres notas, porque la consigna indica que cada alumno debe contar con tres calificaciones.

Se valida que cada nota sea numerica.

Se valida que cada nota sea finita.

Se valida que cada nota este entre 1 y 10. Se eligio este rango porque representa una escala de calificaciones comun.

No se aceptan notas negativas, cero, texto, valores vacios ni valores mayores a 10.

## Codigos de estado utilizados

## 200 OK

Se utiliza cuando una consulta, modificacion o eliminacion se realiza correctamente.

## 201 Created

Se utiliza cuando se crea un alumno correctamente mediante POST.

## 400 Bad Request

Se utiliza cuando el cliente envia datos invalidos, por ejemplo un nombre vacio, una cantidad incorrecta de notas o notas fuera del rango permitido.

## 404 Not Found

Se utiliza cuando se intenta consultar, modificar o eliminar un alumno que no existe.

## 409 Conflict

Se utiliza cuando se intenta crear o modificar un alumno usando un nombre que ya pertenece a otro alumno.

## Ejemplos de uso

## Crear alumno

POST /api/alumnos

Body:

{
  "nombre": "Ana Perez",
  "notas": [7, 8, 6]
}

Respuesta esperada:

{
  "mensaje": "Alumno creado correctamente.",
  "alumno": {
    "nombre": "Ana Perez",
    "notas": [7, 8, 6],
    "promedio": 7,
    "condicion": "aprobado"
  }
}

## Consultar todos los alumnos

GET /api/alumnos

Respuesta esperada:

{
  "cantidad": 1,
  "alumnos": [
    {
      "nombre": "Ana Perez",
      "notas": [7, 8, 6],
      "promedio": 7,
      "condicion": "aprobado"
    }
  ]
}

## Consultar un alumno

GET /api/alumnos/Ana%20Perez

Respuesta esperada:

{
  "nombre": "Ana Perez",
  "notas": [7, 8, 6],
  "promedio": 7,
  "condicion": "aprobado"
}

## Modificar alumno

PUT /api/alumnos/Ana%20Perez

Body:

{
  "nombre": "Ana Perez",
  "notas": [9, 8, 10]
}

Respuesta esperada:

{
  "mensaje": "Alumno actualizado correctamente.",
  "alumno": {
    "nombre": "Ana Perez",
    "notas": [9, 8, 10],
    "promedio": 9,
    "condicion": "promocionado"
  }
}

## Eliminar alumno

DELETE /api/alumnos/Ana%20Perez

Respuesta esperada:

{
  "mensaje": "Alumno eliminado correctamente.",
  "alumno": {
    "nombre": "Ana Perez",
    "notas": [9, 8, 10]
  }
}