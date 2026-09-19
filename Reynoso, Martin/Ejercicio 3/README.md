# API REST para Gestión de Tareas

Esta es una API REST desarrollada con Node.js y Express que permite realizar un seguimiento de tareas pendientes y completadas (To-Do List).

## Características

* **Operaciones CRUD:** Permite listar, crear, modificar el contenido o estado, y eliminar tareas.
* **Filtrado por estado:** Posibilidad de obtener únicamente las tareas completadas (`completada=true`) o pendientes (`completada=false`) mediante Query Parameters.
* **Actualización parcial de estado:** Incluye un endpoint mediante método `PATCH` para alternar o cambiar rápidamente el estado de una tarea.
* **Validaciones estrictas:**
  * Control de duplicados por nombre de tarea (retorna error `409 Conflict`).
  * Validación del tipo de dato en los parámetros de búsqueda y en el cuerpo de la petición (`400 Bad Request`).

## Ejecución

Para iniciar el servidor, ejecuta:

```
node app.js
```

*El servidor se ejecutará por defecto en `http://localhost:3000`.*

## Endpoints de la API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/tareas` | Obtiene todas las tareas. Permite filtrar con `?completada=true` o `?completada=false`. |
| `GET` | `/tareas/:id` | Obtiene una tarea específica por su ID. |
| `POST` | `/tareas` | Crea una nueva tarea. Requiere `nombre` y de forma opcional `completada` (por defecto `false`). |
| `PUT` | `/tareas/:id` | Actualiza el `nombre` y/o el estado `completada` de una tarea existente. |
| `PATCH` | `/tareas/:id/completar` | Modifica únicamente el estado `completada` de una tarea (o lo invierte si no se especifica el valor). |
| `DELETE` | `/tareas/:id` | Elimina una tarea por su ID. |

## Ejemplos de Peticiones HTTP

### 1. Obtener tareas con filtro

```
GET http://localhost:3000/tareas?completada=false
```

**Respuesta (`200 OK`):**

```json
[
  {
    "id": 3,
    "nombre": "Escribir pruebas en archivo HTTP",
    "completada": false
  }
]
```

### 2. Crear una nueva tarea

```
POST http://localhost:3000/tareas
Content-Type: application/json

{
  "nombre": "Preparar presentación del proyecto"
}
```

**Respuesta (`201 Created`):**

```json
{
  "id": 4,
  "nombre": "Preparar presentación del proyecto",
  "completada": false
}
```

### 3. Actualizar estado mediante PATCH

```
PATCH http://localhost:3000/tareas/4/completar
Content-Type: application/json

{
  "completada": true
}
```

**Respuesta (`200 OK`):**

```json
{
  "id": 4,
  "nombre": "Preparar presentación del proyecto",
  "completada": true
}
```

### 4. Eliminar una tarea

```
DELETE http://localhost:3000/tareas/2
```

**Respuesta (`200 OK`):**

```json
{
  "mensaje": "Tarea 'Diseñar endpoints de la API' eliminada correctamente."
}
```