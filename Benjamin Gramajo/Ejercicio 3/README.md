# Ejercicio 3 — API de Tareas

## Descripción

API desarrollada con ExpressJS para administrar tareas, cada una con un nombre y un estado de avance (completada o pendiente). Permite crear, consultar, modificar y eliminar tareas, además de filtrar por estado.

## Decisiones de diseño

### Recurso e identificador

Se define el recurso `tareas`, identificado por el nombre, igual que en el Ejercicio 2: no hay un ID numérico definido en el enunciado, y como el nombre debe ser único, funciona naturalmente como clave del recurso (`/tareas/:nombre`).

### Métodos HTTP

| Método   | Endpoint          | Uso                                            |
| -------- | ----------------- | ---------------------------------------------- |
| `POST`   | `/tareas`         | Crear una tarea nueva                          |
| `GET`    | `/tareas`         | Listar tareas (con filtro opcional por estado) |
| `GET`    | `/tareas/:nombre` | Consultar una tarea puntual                    |
| `PUT`    | `/tareas/:nombre` | Modificar nombre y/o estado de una tarea       |
| `DELETE` | `/tareas/:nombre` | Eliminar una tarea                             |

### Diferenciar completadas de pendientes

En lugar de crear sub-recursos separados (por ejemplo `/tareas/completadas`), se optó por un query param opcional sobre el mismo endpoint de listado: `GET /tareas?completada=true` o `GET /tareas?completada=false`. Sin el parámetro, se devuelven todas las tareas.

### Validaciones

- `nombre`: obligatorio, cadena de texto no vacía.
- `completada`: si se envía, debe ser un valor booleano (`true`/`false`). Es opcional al crear una tarea: si se omite, se asume `false` (una tarea nueva nace pendiente).
- Tarea inexistente: en `GET`, `PUT` o `DELETE` sobre un nombre que no existe → `404 Not Found`.
- Filtro por query param: `completada` en la URL solo acepta los strings `"true"` o `"false"`; cualquier otro valor → `400 Bad Request`.
