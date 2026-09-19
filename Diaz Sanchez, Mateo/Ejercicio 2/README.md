# Ejercicio 2 - Alumnos

## Descripción

Se desarrolló una API REST con Express para gestionar alumnos, sus notas y la condición académica resultante.

Cada alumno queda representado por:
- id
- nombre
- notas (tres notas numéricas)

El promedio y la condición académica se calculan en tiempo real y no se almacenan como atributos permanentes.

## Recurso elegido

Se definió el recurso:
- /alumnos

Con las siguientes operaciones:
- GET /alumnos: lista todos los alumnos
- GET /alumnos/:id: obtiene un alumno por id
- POST /alumnos: crea un nuevo alumno
- PUT /alumnos/:id: modifica un alumno existente
- DELETE /alumnos/:id: elimina un alumno

## Parámetros

### POST /alumnos
Body JSON:

```json
{
  "nombre": "Ana",
  "nota1": 8,
  "nota2": 7,
  "nota3": 9
}
```

### PUT /alumnos/:id
Body JSON:

```json
{
  "nombre": "Ana Paula",
  "nota1": 9,
  "nota2": 8,
  "nota3": 7
}
```

## Validaciones

Se validó que:
- el nombre no puede estar vacío
- cada nota debe estar entre 0 y 10
- no puede existir dos alumnos con el mismo nombre, ni al crear ni al modificar
- si llega un valor inválido, la API responde con un error 400 o 409 según el caso

## Lógica de negocio

El promedio se calcula como:
- promedio = (nota1 + nota2 + nota3) / 3

Luego se determina la condición:
- menor a 6: reprobado
- 6 o 7: aprobado
- 8 o más: promocionado

## Ejemplo de uso

```bash
node Alumnos.js
```

Luego se pueden consultar rutas como:
- GET http://localhost:3000/alumnos
- POST http://localhost:3000/alumnos
- PUT http://localhost:3000/alumnos/1
- DELETE http://localhost:3000/alumnos/1

## Observación

Se usó el formato `import express from "express";` y la inicialización estándar:

```js
const app = express();
const port = 3000;

app.use(express.json());
```
