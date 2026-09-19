# Ejercicio 3 - API de tareas

## Descripción

Se desarrolló una API REST utilizando ExpressJS para administrar tareas y su estado de avance.

Cada tarea cuenta con un nombre y un estado que indica si fue completada o no. La información se mantiene en un arreglo interno.

No se permiten tareas con el mismo nombre.

## Modelo de datos

Cada tarea se representa mediante un objeto que contiene su nombre y un valor booleano que indica si está completada.

Ejemplo:

const tareas = [
{
nombre: "Estudiar para el parcial",
completada: false
}
];

El campo completada permite diferenciar entre tareas pendientes y completadas.

## Endpoints

### Crear una tarea

POST /tareas

Permite crear una nueva tarea indicando su nombre y su estado de completada.

No se permite crear dos tareas con el mismo nombre.

### Consultar todas las tareas

GET /tareas

Devuelve todas las tareas almacenadas en el arreglo interno.

### Consultar tareas completadas

GET /tareas/completadas

Devuelve únicamente las tareas que están completadas.

### Consultar tareas pendientes

GET /tareas/pendientes

Devuelve únicamente las tareas que están pendientes.

### Modificar una tarea

PUT /tareas/:nombre

Permite modificar el nombre y el estado de una tarea.

No se permite modificar el nombre de una tarea por uno que ya exista.

### Eliminar una tarea

DELETE /tareas/:nombre

Permite eliminar una tarea del arreglo interno.

## Decisiones de diseño

* Se utilizó un arreglo interno para almacenar las tareas, sin utilizar una base de datos.
* Cada tarea se representa mediante un objeto con un nombre y un valor booleano completada.
* Se decidió utilizar el nombre como identificador de la tarea, por lo que no se permiten nombres duplicados.
* Se utilizó un valor booleano para representar el estado de la tarea: true para completada y false para pendiente.
* Se utilizaron los métodos HTTP GET, POST, PUT y DELETE para las operaciones de consulta, creación, modificación y eliminación.
* Se crearon endpoints específicos para consultar tareas completadas y pendientes.
* Se utilizan códigos HTTP adecuados para informar errores, como 400 cuando los datos son inválidos o existe un nombre duplicado y 404 cuando la tarea no existe.

## Ejecución

Instalar las dependencias:

npm install

Iniciar el servidor:

node index.js

La API queda disponible en:

http://localhost:3000

Las pruebas de los endpoints se encuentran en el archivo tareas.http.
