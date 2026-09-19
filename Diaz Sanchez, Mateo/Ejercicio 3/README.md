# Ejercicio 3 - Tareas

## Descripción

Se desarrolló una API REST con Express para administrar tareas con su estado de completitud.

Cada tarea cuenta con:
- id
- nombre
- completada (booleano)

La información se guarda en un arreglo interno. También se exponen consultas para diferenciar tareas completadas y pendientes.

## Recurso elegido

Se definió el recurso:
- /tareas

Con las siguientes operaciones:
- GET /tareas: lista todas las tareas
- GET /tareas/:id: obtiene una tarea por id
- GET /tareas/completadas: lista solo tareas completadas
- GET /tareas/pendientes: lista solo tareas pendientes
- POST /tareas: crea una nueva tarea
- PUT /tareas/:id: modifica una tarea existente
- DELETE /tareas/:id: elimina una tarea

## Parámetros

### POST /tareas
Body JSON:

```json
{
  "nombre": "Comprar leche",
  "completada": false
}
```

### PUT /tareas/:id
Body JSON:

```json
{
  "completada": true
}
```

## Validaciones

Se validó que:
- el nombre no puede estar vacío
- el estado debe ser un valor booleano
- no puede existir dos tareas con el mismo nombre
- si se intenta crear o actualizar con datos inválidos, la API responde con un error 400 o 409

## Lógica de negocio

La API distingue tareas según el valor de `completada`:
- true => tarea completada
- false => tarea pendiente

Además, se exponen endpoints específicos para cada filtro:
- /tareas/completadas
- /tareas/pendientes

## Ejemplo de uso

```bash
node Tareas.js
```

Luego se pueden consultar rutas como:
- GET http://localhost:3000/tareas
- GET http://localhost:3000/tareas/completadas
- GET http://localhost:3000/tareas/pendientes
- POST http://localhost:3000/tareas
- PUT http://localhost:3000/tareas/1
- DELETE http://localhost:3000/tareas/1

## Observación

Se usó el formato `import express from "express";` y la inicialización estándar:

```js
const app = express();
const port = 3000;

app.use(express.json());
```
