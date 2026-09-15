# Ejercicio 1 - Perímetros y superficies de rectángulos

## Decisiones de diseño

- **Recurso**: se modela como `rectangulos`, aunque no hay persistencia de datos:
  es un cálculo puntual a partir de valores que envía el cliente, no una entidad
  que se guarda en el servidor.

- **Método HTTP**: se usa `GET` porque la operación es de **solo lectura** y
  **idempotente** (los mismos valores de entrada siempre producen el mismo
  resultado, sin efectos secundarios). No corresponde usar `POST` porque no se
  está creando ni persistiendo ningún recurso.

- **Envío de datos**: al no identificar un recurso guardado por un ID, los
  valores (`base` y `altura`) se envían como **query params** en lugar de en
  el body, ya que representan parámetros de una consulta:
  `GET /rectangulos?base=4&altura=6`

- **Respuesta**: se informa `base`, `altura`, `perimetro`, `superficie` y
  `esCuadrado` (booleano que indica si `base === altura`), cumpliendo con el
  requisito de distinguir el caso de cuadrado.

- **Validaciones**: `base` y `altura` deben estar presentes y ser números
  mayores a 0. Si faltan, no son numéricos, o son menores o iguales a 0, la
  API responde `400 Bad Request` con un mensaje descriptivo del error.