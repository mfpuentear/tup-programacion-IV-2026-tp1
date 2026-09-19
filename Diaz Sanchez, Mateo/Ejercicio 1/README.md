# Ejercicio 1 - Rectángulos

## Descripción

Se desarrolló una API REST con Express para administrar rectángulos y calcular su perímetro, superficie y si corresponden a un cuadrado.

La API guarda internamente un arreglo de rectángulos con los datos básicos:
- id
- base
- altura

Los cálculos derivados se generan al responder la consulta, sin guardarlos en memoria como dato persistente.

## Recurso elegido

Se definió el recurso:
- /rectangulos

Con las siguientes operaciones:
- GET /rectangulos: lista todos los rectángulos
- GET /rectangulos/:id: obtiene un rectángulo por id
- POST /rectangulos: crea un nuevo rectángulo
- PUT /rectangulos/:id: modifica un rectángulo existente
- DELETE /rectangulos/:id: elimina un rectángulo

## Parámetros

### POST /rectangulos
Body JSON:

```json
{
  "base": 8,
  "altura": 5
}
```

### PUT /rectangulos/:id
Body JSON:

```json
{
  "base": 10,
  "altura": 4
}
```

## Validaciones

Se validó que:
- base y altura deben ser números positivos
- no se aceptan valores nulos, vacíos o menores o iguales a cero
- si se recibe un valor inválido, la API responde con un error 400

## Lógica de negocio

Para cada rectángulo se calcula:
- perímetro = 2 * (base + altura)
- superficie = base * altura
- esCuadrado = base === altura

Esto permite distinguir claramente entre rectángulos y cuadrados.

## Ejemplo de uso

```bash
node Rectangulo.js
```

Luego se pueden consultar rutas como:
- GET http://localhost:3000/rectangulos
- POST http://localhost:3000/rectangulos
- PUT http://localhost:3000/rectangulos/1
- DELETE http://localhost:3000/rectangulos/1

## Observación

Se usó el formato `import express from "express";` y la inicialización estándar:

```js
const app = express();
const port = 3000;

app.use(express.json());
```
