# API REST para Gestión de Alumnos

Esta es una API REST desarrollada con Node.js y Express que permite gestionar el registro de alumnos, sus calificaciones y calcular de forma automática su promedio académico y su condición académica (promocionado, aprobado o reprobado).

## Características

* **Operaciones CRUD:** Soporte completo para consultar (GET), crear (POST), actualizar (PUT) y eliminar (DELETE) registros de alumnos.
* **Cálculo automático de estado:** Calcula en tiempo real el promedio y asigna la condición académica:
  * **Promocionado:** Promedio mayor o igual a 8.
  * **Aprobado:** Promedio entre 6 y 7.99.
  * **Reprobado:** Promedio menor a 6.
* **Validaciones estrictas:**
  * Las notas deben ser exactamente 3 valores numéricos entre 0 y 10.
  * Evita la duplicación de nombres de alumnos (retorna error `409 Conflict`).
  * Validación del formato de datos en peticiones POST y PUT (`400 Bad Request`).

## Ejecución

Para iniciar el servidor, ejecuta:

```
node app.js
```

*El servidor se ejecutará por defecto en `http://localhost:3000`.*

## Endpoints de la API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/alumnos` | Obtiene la lista general de alumnos con su promedio y condición. |
| `GET` | `/alumnos/:id` | Obtiene la información detallada de un alumno por su ID. |
| `POST` | `/alumnos` | Crea un nuevo alumno. Requiere `nombre` y un arreglo de 3 `notas`. |
| `PUT` | `/alumnos/:id` | Actualiza el `nombre` y/o las `notas` de un alumno existente. |
| `DELETE` | `/alumnos/:id` | Elimina un alumno del sistema por su ID. |

## Ejemplos de Peticiones HTTP

### 1. Obtener todos los alumnos

```http
GET http://localhost:3000/alumnos
```

**Respuesta (`200 OK`):**

```json
[
  {
    "id": 1,
    "nombre": "Juan Perez",
    "notas": [8, 9, 8],
    "promedio": 8.33,
    "condicion": "promocionado"
  }
]
```

### 2. Crear un nuevo alumno

```http
POST http://localhost:3000/alumnos
Content-Type: application/json

{
  "nombre": "Lucas Fernandez",
  "notas": [7, 8, 9]
}
```

**Respuesta (`201 Created`):**

```json
{
  "id": 4,
  "nombre": "Lucas Fernandez",
  "notas": [7, 8, 9],
  "promedio": 8,
  "condicion": "promocionado"
}
```

### 3. Modificar un alumno existente

```http
PUT http://localhost:3000/alumnos/3
Content-Type: application/json

{
  "nombre": "Carlos Lopez Ruiz",
  "notas": [6, 6, 6]
}
```

### 4. Eliminar un alumno

```http
DELETE http://localhost:3000/alumnos/3
```

**Respuesta (`200 OK`):**

```json
{
  "mensaje": "Alumno 'Carlos Lopez Ruiz' eliminado correctamente."
}
```