# Ejercicio 2

## Descripcion

Se desarrollo una API con ExpressJS para administrar la informacion academica de alumnos de una materia.

Cada alumno tiene un `nombre` y tres `notas`, que se guardan en un arreglo interno. Al consultar un alumno, la API informa tambien su promedio y su condicion academica.

El promedio y la condicion no se almacenan porque son datos derivados de las notas.

## Recurso elegido

El recurso elegido es `alumnos`, porque la API administra una coleccion de alumnos y sus calificaciones.

Se usa en plural porque representa varios registros dentro del arreglo interno.

## Estructura de un alumno

Cada alumno se almacena con esta estructura:

{
    "nombre": "Ana Perez",
    "notas": [7, 8, 6]
}

Solo se guardan `nombre` y `notas`.

El `promedio` y la `condicion` se calculan al momento de responder una consulta, para evitar guardar informacion repetida o desactualizada.

## Rutas y metodos HTTP

### GET /api/alumnos

Se utiliza para consultar todos los alumnos.

No modifica el arreglo interno, solo devuelve la informacion almacenada junto con los datos calculados.

### GET /api/alumnos/:nombre

Se utiliza para consultar un alumno especifico.

El `nombre` se usa como parametro de ruta porque no pueden existir alumnos con el mismo nombre, entonces permite identificar un registro concreto.

### POST /api/alumnos

Se utiliza para crear un nuevo alumno.

Corresponde usar `POST` porque se agrega un nuevo recurso al arreglo interno.

### PUT /api/alumnos/:nombre

Se utiliza para modificar completamente un alumno existente.

Corresponde usar `PUT` porque se reemplazan sus datos principales: `nombre` y `notas`.

No se usa `PATCH` porque la API no implementa modificaciones parciales de alumnos.

### DELETE /api/alumnos/:nombre

Se utiliza para eliminar un alumno existente.

Corresponde usar `DELETE` porque se quita un recurso del arreglo interno.

## Justificacion de campos

### nombre

Se utiliza `nombre` porque identifica al alumno dentro de la materia.

Debe ser unico, ya que la consigna indica que no pueden existir alumnos con el mismo nombre al crear o modificar registros.

Tambien se valida que sea texto y que tenga entre 2 y 50 caracteres.

### notas

Se utiliza `notas` porque representa las calificaciones del alumno.

Se guarda como arreglo porque la consigna pide tres notas por alumno. El arreglo permite conservarlas juntas y recorrerlas para calcular el promedio.

### promedio

El promedio se informa en las respuestas, pero no se guarda en el arreglo interno.

Se calcula con la siguiente formula:

promedio = suma de notas / cantidad de notas

### condicion

La condicion academica se calcula a partir del promedio:

- `reprobado`: promedio menor a 6.
- `aprobado`: promedio igual a 6 o 7.
- `promocionado`: promedio igual o mayor a 8.

No se almacena porque depende directamente de las notas.

## Validaciones

La API valida que:

- `nombre` haya sido enviado.
- `nombre` sea texto.
- `nombre` tenga entre 2 y 50 caracteres.
- No exista otro alumno con el mismo nombre.
- `notas` haya sido enviado.
- `notas` sea un arreglo.
- El arreglo tenga exactamente tres notas.
- Cada nota sea numerica.
- Cada nota sea finita.
- Cada nota este entre 1 y 10.

Para evitar duplicados, los nombres se comparan sin distinguir mayusculas y minusculas.

## Codigos de estado

- `200 OK`: consulta, modificacion o eliminacion correcta.
- `201 Created`: alumno creado correctamente.
- `400 Bad Request`: datos invalidos enviados por el cliente.
- `404 Not Found`: alumno no encontrado.
- `409 Conflict`: ya existe un alumno con ese nombre.

## Ejemplos

Crear alumno:

POST /api/alumnos

{
    "nombre": "Ana Perez",
    "notas": [7, 8, 6]
}

Consultar un alumno:

GET /api/alumnos/Ana%20Perez

Respuesta:

{
    "nombre": "Ana Perez",
    "notas": [7, 8, 6],
    "promedio": 7,
    "condicion": "aprobado"
}

Modificar alumno:

PUT /api/alumnos/Ana%20Perez

{
    "nombre": "Ana Perez",
    "notas": [9, 8, 10]
}

Eliminar alumno:

DELETE /api/alumnos/Ana%20Perez

## Archivo de pruebas

Se agrega el archivo `peticiones.http` para probar la API con REST Client.

Incluye pruebas para crear alumnos, consultar todos, consultar por nombre, evitar duplicados, validar notas, modificar, eliminar y consultar alumnos inexistentes.