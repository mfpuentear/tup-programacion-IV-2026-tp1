# Ejercicio 3 - Gestion de tareas

## Descripcion

En este ejercicio se desarrollo una API REST utilizando ExpressJS para administrar una lista de tareas.

Cada tarea contiene un nombre y un estado que indica si fue completada o si permanece pendiente. La informacion se mantiene en un arreglo interno durante la ejecucion de la aplicacion.

La API permite crear tareas, consultar todas las tareas y obtenerlas separadas segun su estado.

## Estructura de una tarea

Cada elemento almacenado posee la siguiente estructura:

```js
{
    nombre: "Realizar TP de Programacion IV",
    completada: false
}
```

El campo `nombre` identifica la tarea y el campo `completada` representa su estado.

Se utiliza un valor booleano para el estado porque solamente existen dos posibilidades: la tarea esta completada (`true`) o esta pendiente (`false`).

## Decisiones de diseño

Se eligio un arreglo en memoria para almacenar las tareas porque la consigna solicita conservar la informacion en una estructura interna y no requiere una base de datos.

Para evitar tareas repetidas, antes de crear una nueva se comprueba si ya existe otra con el mismo nombre. La comparacion se realiza sin diferenciar mayusculas de minusculas, por lo que nombres como "Estudiar ExpressJS" y "estudiar expressjs" se consideran iguales.

Tambien se eliminan espacios innecesarios al principio y al final del nombre antes de almacenarlo.

El campo `completada` es booleano. Si no se envia este campo al crear una tarea, se establece automaticamente en `false`, por lo que la tarea queda pendiente.

## Validaciones

La API realiza diferentes controles sobre los datos recibidos.

* El nombre es obligatorio.
* El nombre no puede estar vacio.
* No se permiten dos tareas con el mismo nombre.
* El campo `completada`, cuando se envia, debe ser `true` o `false`.
* Los datos incorrectos generan una respuesta `400 Bad Request`.
* Los nombres duplicados generan una respuesta `409 Conflict`.

Estas validaciones permiten mantener datos consistentes dentro del arreglo.

## Endpoints

### Obtener todas las tareas

```http
GET /tareas
```

Devuelve todas las tareas almacenadas.

### Crear una tarea

```http
POST /tareas
```

Recibe el nombre y, opcionalmente, el estado de la tarea.

Ejemplo:

```json
{
    "nombre": "Estudiar ExpressJS",
    "completada": true
}
```

Si no se indica el estado, la tarea se crea como pendiente.

### Obtener tareas completadas

```http
GET /tareas/completadas
```

Devuelve solamente las tareas cuyo campo `completada` tiene el valor `true`.

### Obtener tareas pendientes

```http
GET /tareas/pendientes
```

Devuelve solamente las tareas cuyo campo `completada` tiene el valor `false`.

## Codigos de respuesta

| Codigo | Uso                                |
| ------ | ---------------------------------- |
| 200    | Consulta realizada correctamente   |
| 201    | Tarea creada correctamente         |
| 400    | Datos enviados incorrectamente     |
| 409    | Ya existe una tarea con ese nombre |

## Pruebas realizadas

Las pruebas se encuentran en el archivo `tareas.http`.

Se probaron diferentes situaciones para verificar el funcionamiento de la API:

1. Creacion de tareas pendientes.
2. Creacion de tareas completadas.
3. Creacion de una tarea sin indicar el estado.
4. Consulta de todas las tareas.
5. Consulta exclusiva de tareas completadas.
6. Consulta exclusiva de tareas pendientes.
7. Intento de crear una tarea duplicada.
8. Intento de crear una tarea sin nombre.
9. Intento de utilizar un valor incorrecto en el campo `completada`.

De esta manera se verifica tanto el funcionamiento normal de la API como el comportamiento frente a datos invalidos.

## Conclusion

La API permite administrar las tareas mediante endpoints REST y diferencia correctamente las tareas completadas de las pendientes.

Las validaciones implementadas evitan nombres vacios, nombres repetidos y estados que no sean booleanos. El uso del arreglo interno permite mantener los datos durante la ejecucion de la aplicacion y mantener una implementacion sencilla acorde a los requerimientos del ejercicio.
