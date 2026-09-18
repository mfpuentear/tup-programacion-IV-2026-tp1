# Ejercicio 1

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y
superficies de rectángulos. La solución deberá permitir distinguir, cuando
corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Recurso:** `rectangulos`. No hay persistencia: es un cálculo puro a partir
  de los datos que manda quien consulta, no un objeto que se guarde en el
  servidor.
- **Método HTTP:** `GET`. Al no crear, modificar ni eliminar nada, y ser una
  operación segura e idempotente (siempre da el mismo resultado para los
  mismos datos), el método correcto es `GET`, no `POST`.
- **Dónde van los datos:** como *query params* (`?base=&altura=`) y no como
  parámetros de ruta ni body, porque no identifican un recurso existente sino
  que son los valores de entrada para el cálculo. Un `GET` con body no es una
  práctica estándar soportada por todos los clientes HTTP.
- **Validación:** `base` y `altura` son obligatorios, deben ser numéricos y
  mayores a 0. Si falta alguno o no es válido, se responde `400 Bad Request`
  con un mensaje descriptivo.
- **Cuadrado:** se informa `esCuadrado: true` cuando `base === altura`, además
  del perímetro y la superficie, para no forzar a quien consume la API a
  calcularlo por su cuenta.

## Endpoint

`GET /rectangulos?base={numero}&altura={numero}`

Respuesta `200`:

```json
{
  "base": 4,
  "altura": 4,
  "perimetro": 16,
  "superficie": 16,
  "esCuadrado": true
}
```

Respuesta `400` (valores inválidos o faltantes):

```json
{ "error": "Los parámetros 'base' y 'altura' son obligatorios y deben ser números mayores a 0" }
```
