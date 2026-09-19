# Ejercicio 1 - Rectángulos

## Modelo

El rectángulo se modela mediante dos dimensiones:

- `base`
- `altura`

No se almacenan rectángulos en memoria porque la funcionalidad requerida consiste únicamente en realizar consultas y cálculos a partir de las dimensiones proporcionadas.

El perímetro, la superficie y la condición de cuadrado son valores derivados.

## Recurso

Se utiliza el recurso:

`GET /rectangulos`

Las dimensiones se envían mediante query parameters:

`GET /rectangulos?base=5&altura=3`

Se eligió el método GET porque la operación únicamente consulta información calculada y no modifica el estado del servidor.

## Resultado

La respuesta informa:

- base
- altura
- perímetro
- superficie
- si constituye un cuadrado

Un rectángulo se considera cuadrado cuando su base y su altura son iguales.

## Validaciones

Tanto la base como la altura:

- son obligatorias;
- deben ser valores numéricos;
- deben ser valores finitos;
- deben ser mayores que cero.

Ante valores inválidos la API responde con código HTTP `400 Bad Request`.

Si se solicita una ruta inexistente se responde con `404 Not Found`.

## Códigos HTTP

- `200`: consulta realizada correctamente.
- `400`: dimensiones inválidas.
- `404`: recurso inexistente.

## Ejecución

Instalar dependencias:

`npm install`

Iniciar la aplicación:

`npm start`

El servidor se ejecuta en:

`http://localhost:3001`