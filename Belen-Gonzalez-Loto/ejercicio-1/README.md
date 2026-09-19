# Ejercicio 1

## Descripcion

Se desarrollo una API con ExpressJS para resolver consultas sobre rectangulos.

La API permite calcular la superficie y el perimetro a partir de dos medidas: `base` y `altura`. Tambien permite identificar si esas medidas corresponden a un cuadrado.

## Recurso elegido

El recurso elegido es `rectangulos`, porque el problema trabaja con figuras rectangulares y con calculos asociados a ellas.

No se crea un recurso separado para cuadrados porque un cuadrado es un caso particular de rectangulo. Por eso, la API informa si el rectangulo consultado tambien cumple la condicion de cuadrado.

## Ruta y metodo HTTP

### GET /api/rectangulos/calculo

Se utiliza `GET` porque la operacion es una consulta. El servidor recibe dos valores, realiza un calculo y devuelve una respuesta.

No se utiliza `POST` porque no se crea ningun rectangulo en el servidor.

No se utiliza `PUT` ni `PATCH` porque no se modifica informacion existente.

No se utiliza `DELETE` porque no hay ningun recurso almacenado para eliminar.

Se utiliza `calculo` en la ruta porque la API no consulta un rectangulo guardado, sino que realiza una operacion matematica con los valores recibidos.

## Parametros

Los datos se reciben mediante query params:

- `base`
- `altura`

Se eligieron estos nombres porque representan las dos medidas necesarias para calcular la superficie y el perimetro de un rectangulo.

Ejemplo:

GET /api/rectangulos/calculo?base=10&altura=5

## Validaciones

La API valida que:

- `base` haya sido enviada.
- `altura` haya sido enviada.
- Ambos valores sean numeros validos.
- Ambos valores sean finitos.
- Ambos valores sean mayores a cero.
- Ningun valor supere `100000`.

Se eligio el limite `100000` para mantener las consultas dentro de un rango razonable para el contexto del ejercicio.

## Calculos realizados

La superficie se calcula multiplicando la base por la altura:

superficie = base * altura

El perimetro se calcula sumando base y altura, y multiplicando el resultado por dos:

perimetro = 2 * (base + altura)

La figura se considera cuadrado cuando ambas medidas son iguales:

esCuadrado = base === altura

## Respuesta exitosa

Ejemplo:

GET /api/rectangulos/calculo?base=10&altura=5

Respuesta:

{
  "figura": "rectangulo",
  "medidas": {
    "base": 10,
    "altura": 5
  },
  "resultados": {
    "superficie": 50,
    "perimetro": 30
  },
  "esCuadrado": false
}

## Archivo de pruebas

Se agrega el archivo `peticiones.http` para probar la API con REST Client.

Incluye pruebas para un rectangulo comun, un cuadrado, parametros faltantes, valores negativos, cero, valores no numericos y valores mayores al limite permitido.