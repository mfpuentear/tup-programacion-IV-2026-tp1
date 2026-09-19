# Ejercicio 2 - API de alumnos y calificaciones

## Descripción

Se desarrolló una API REST utilizando ExpressJS para administrar la información académica de los alumnos de una materia.

Cada alumno cuenta con un nombre y tres notas. El promedio y la condición académica se calculan al momento de consultar al alumno y no se almacenan en el arreglo interno.

## Modelo de datos

La información se mantiene en un arreglo interno. Cada alumno se representa mediante un objeto que contiene su nombre y sus tres notas.

Ejemplo:

const alumnos = [
{
nombre: "Juan",
notas: [7, 8, 6]
}
];

El promedio y la condición académica no se almacenan, ya que son datos derivados de las notas.

## Condición académica

La condición se determina según el promedio:

* Promedio menor a 6: reprobado
* Promedio entre 6 y 7: aprobado
* Promedio de 8 o más: promocionado

## Endpoints

### Crear un alumno

POST /alumnos

Permite crear un nuevo alumno indicando su nombre y sus tres notas.

No se permite crear dos alumnos con el mismo nombre.

### Consultar todos los alumnos

GET /alumnos

Devuelve todos los alumnos almacenados en el arreglo interno.

### Consultar un alumno

GET /alumnos/:nombre

Devuelve las notas del alumno, su promedio calculado y su condición académica.

### Modificar un alumno

PUT /alumnos/:nombre

Permite modificar el nombre y las tres notas de un alumno.

No se permite modificar el nombre de un alumno por uno que ya exista.

### Eliminar un alumno

DELETE /alumnos/:nombre

Permite eliminar un alumno del arreglo interno.

## Decisiones de diseño

* Se utilizó un arreglo interno para almacenar los alumnos, sin utilizar una base de datos.
* Cada alumno se representa mediante un objeto con un nombre y un arreglo de tres notas.
* Se decidió utilizar el nombre como identificador del alumno, por lo que no se permiten nombres duplicados.
* El promedio y la condición académica no se almacenan, ya que son datos derivados de las notas.
* Se utilizaron los métodos HTTP GET, POST, PUT y DELETE para las operaciones de consulta, creación, modificación y eliminación.
* Se utilizan códigos HTTP adecuados para informar errores, como 400 cuando los datos son inválidos o existe un nombre duplicado y 404 cuando el alumno no existe.

## Ejecución

Instalar las dependencias:

npm install

Iniciar el servidor:

node index.js

La API queda disponible en:

http://localhost:3000

Las pruebas de los endpoints se encuentran en el archivo alumnos.http.
