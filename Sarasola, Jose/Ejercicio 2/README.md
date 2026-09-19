# Ejercicio 2 - Información académica

## Modelo

Cada alumno se representa mediante un objeto con la siguiente estructura:

`{ nombre, notas }`

`nombre` contiene el nombre del alumno y `notas` contiene exactamente tres calificaciones.

Los alumnos se almacenan en un arreglo interno en memoria.

El promedio y la condición académica no se almacenan porque son datos derivados de las notas. Se calculan cada vez que se genera una respuesta para el cliente.

## Identificación y unicidad

La consigna establece que no pueden existir dos alumnos con el mismo nombre, por lo que se utiliza el nombre como identificador del alumno.

Para controlar duplicados se normalizan los nombres eliminando espacios externos e ignorando diferencias entre mayúsculas y minúsculas.

Por ejemplo, `Ana`, `ana` y ` ANA ` se consideran el mismo nombre.

## Recursos y métodos

### GET /alumnos

Obtiene todos los alumnos.

### GET /alumnos/:nombre

Obtiene un alumno determinado e informa sus notas, promedio y condición académica.

### POST /alumnos

Crea un alumno.

### PUT /alumnos/:nombre

Reemplaza los datos de un alumno existente.

Se utiliza PUT porque se envía nuevamente la representación completa del alumno: nombre y tres notas.

### DELETE /alumnos/:nombre

Elimina un alumno.

## Promedio

El promedio se calcula sumando las tres notas y dividiendo el resultado por tres.

## Condición académica

La condición se obtiene según el promedio:

- promedio menor a 6: `reprobado`;
- promedio desde 6 y menor a 8: `aprobado`;
- promedio de 8 o más: `promocionado`.

## Validaciones

El nombre:

- es obligatorio;
- debe ser una cadena;
- no puede estar vacío;
- debe ser único.

Las notas:

- son obligatorias;
- deben enviarse dentro de un arreglo;
- deben ser exactamente tres;
- deben ser numéricas;
- deben encontrarse entre 0 y 10.

Se adopta el rango de 0 a 10 como decisión de diseño para representar una escala académica de calificación válida.

## Códigos HTTP

- `200`: consulta o modificación correcta.
- `201`: alumno creado correctamente.
- `204`: alumno eliminado correctamente.
- `400`: información inválida.
- `404`: alumno o recurso inexistente.
- `409`: conflicto debido a un nombre duplicado.

## Persistencia

La información se conserva únicamente en memoria. Al reiniciar el servidor, el arreglo vuelve a estar vacío.

## Ejecución

Instalar dependencias:

`npm install`

Ejecutar:

`npm start`

Servidor:

`http://localhost:3002`