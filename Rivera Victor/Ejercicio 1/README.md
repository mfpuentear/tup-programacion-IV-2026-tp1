# Ejercicio 1 - API de Rectángulos

## Descripción

Este ejercicio consiste en desarrollar una API utilizando Express.js para realizar consultas sobre rectángulos.

La API permite obtener información sobre un rectángulo a partir de su base y altura, calculando:

* Perímetro.
* Superficie.
* Si el rectángulo también constituye un cuadrado.

## Tecnologías utilizadas

* Node.js
* Express.js
* JavaScript

## Instalación

Para instalar las dependencias del proyecto, ejecutar:

npm install

## Ejecución

Para iniciar el servidor:

node index.js

El servidor queda disponible en:

http://localhost:3000

## Endpoint

GET /rectangulo

El endpoint recibe dos parámetros mediante la URL:

* base: base del rectángulo.
* altura: altura del rectángulo.

## Solicitudes realizadas

### 1. Consulta de un rectángulo

Solicitud:

http://localhost:3000/rectangulo?base=5&altura=3

Respuesta:

{
"base": 5,
"altura": 3,
"perimetro": 16,
"superficie": 15,
"esCuadrado": false
}

En este caso, como la base y la altura son diferentes, se trata de un rectángulo que no es cuadrado.

### 2. Consulta de un cuadrado

Solicitud:

http://localhost:3000/rectangulo?base=5&altura=5

Respuesta:

{
"base": 5,
"altura": 5,
"perimetro": 20,
"superficie": 25,
"esCuadrado": true
}

En este caso, como la base y la altura son iguales, la API identifica que también se trata de un cuadrado.

### 3. Consulta con datos inválidos

La API también valida que la base y la altura sean números mayores que cero.

Por ejemplo, si se envían valores inválidos:

http://localhost:3000/rectangulo?base=abc&altura=-2

Respuesta:

{
"error": "La base y la altura deben ser números mayores que 0"
}

## Cálculos realizados

* Perímetro: 2 × (base + altura)
* Superficie: base × altura
* Es cuadrado: true cuando la base y la altura son iguales.

## Decisiones de diseño

Se decidió representar al rectángulo mediante los valores de base y altura, ya que son los datos necesarios para obtener el resto de la información solicitada.

Los cálculos del perímetro y la superficie se realizan dentro del endpoint /rectangulo.

Además, se agregó la propiedad esCuadrado, que permite distinguir aquellos casos en los que la base y la altura tienen el mismo valor.

La comunicación con la API se realiza mediante una petición HTTP GET, utilizando parámetros de consulta (query parameters) para proporcionar las dimensiones del rectángulo.
