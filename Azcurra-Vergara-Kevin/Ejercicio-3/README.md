# Ejercicio 3

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance. Cada tarea cuenta con un nombre y un estado que indica si fue completada. La información se almacena en un arreglo interno.

No pueden existir tareas con el mismo nombre. La API permite consultar todas las tareas y diferenciarlas según su estado, entre completadas y pendientes.

## Decisiones de diseño

* **Recurso:** `/tareas`.
* **Persistencia:** se utiliza un arreglo en memoria para almacenar las tareas mientras la aplicación se encuentra en ejecución. Cada tarea contiene `nombre` y `completada`.
* **Estado:** se utiliza un valor booleano para representar el estado de la tarea:

  * `true` → tarea completada.
  * `false` → tarea pendiente.
* **Unicidad:** no se permiten tareas con el mismo nombre, sin distinguir entre mayúsculas y minúsculas. Si se intenta crear una tarea repetida, se devuelve un error `409`.
* **Métodos HTTP:**

  * `GET /tareas` — obtener todas las tareas.
  * `POST /tareas` — crear una nueva tarea.
  * `GET /tareas/completadas` — obtener únicamente las tareas completadas.
  * `GET /tareas/pendientes` — obtener únicamente las tareas pendientes.
* **Validaciones:** el nombre de la tarea es obligatorio y no puede estar vacío. El campo `completada` debe ser booleano. Si no se especifica, su valor por defecto es `false`.
* **Códigos de respuesta:** se utiliza `201` al crear correctamente una tarea, `400` cuando los datos enviados son incorrectos y `409` cuando ya existe una tarea con el mismo nombre.

## Cómo probar

Ejecutar el servidor con:

```bash
npm start
```

Una vez iniciado, utilizar el archivo `tareas.http` con la extensión **REST Client** para realizar las distintas peticiones a la API.

### Ejemplos de operaciones

**Crear una tarea:**

```http
POST http://localhost:3000/tareas
Content-Type: application/json

{
    "nombre": "Hacer TP1",
    "completada": false
}
```

**Obtener todas las tareas:**

```http
GET http://localhost:3000/tareas
```

**Obtener tareas completadas:**

```http
GET http://localhost:3000/tareas/completadas
```

**Obtener tareas pendientes:**

```http
GET http://localhost:3000/tareas/pendientes
```
