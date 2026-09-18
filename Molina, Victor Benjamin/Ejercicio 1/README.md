# Ejercicio 1 - Rectángulos

API desarrollada con ExpressJS para realizar consultas sobre rectángulos, permitiendo calcular su perímetro, superficie y determinar si el rectángulo también constituye un cuadrado.

## Recurso

Se definió el recurso:

`/rectangulos`

Se utiliza el método HTTP `GET` porque la operación realiza una consulta y no almacena ni modifica información.

## Parámetros

La base y la altura se reciben mediante parámetros de consulta (query):

`GET /rectangulos?base=5&altura=3`

Se eligieron parámetros query porque la base y la altura son los datos necesarios para realizar el cálculo solicitado.

## Respuesta

La API devuelve:

- Base.
- Altura.
- Perímetro.
- Superficie.
- Si la figura es un cuadrado o no.

El perímetro se calcula como:

`2 * (base + altura)`

La superficie se calcula como:

`base * altura`

Se considera que el rectángulo es también un cuadrado cuando la base y la altura tienen el mismo valor.

## Validaciones

La API verifica que:

- Se proporcionen tanto la base como la altura.
- Ambos valores sean numéricos.
- Ambos valores sean mayores a cero.

Si los datos son válidos, se devuelve el código de estado `200`.

Si los datos son inválidos, se devuelve el código de estado `400` junto con un mensaje indicando el error.

## Pruebas

El archivo `pruebas.http` contiene diferentes solicitudes para comprobar el funcionamiento de la API y sus validaciones.