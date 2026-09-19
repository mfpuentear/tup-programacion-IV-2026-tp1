# Ejercicio 1

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y superficies de rectángulos. La solución deberá permitir distinguir, cuando corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la información y exponer la funcionalidad requerida.

## Decisiones de diseño

Recurso: `/api/rectangulo`. Se utiliza un único recurso para realizar la consulta. Un cuadrado se considera un caso particular de rectángulo cuando `base === altura`, por lo que no se crea un recurso diferente; se informa mediante el campo `esCuadrado`.

Persistencia: no se utiliza persistencia ni se almacenan rectángulos. Los datos se reciben únicamente para realizar el cálculo solicitado.

Datos: la `base` y la `altura` se reciben mediante query params. Ejemplo: `/api/rectangulo?base=8&altura=5`.

Datos derivados: el `perimetro`, la `superficie` y `esCuadrado` se calculan a partir de la base y la altura y se devuelven en la respuesta.

Método HTTP: se utiliza `GET /api/rectangulo` porque la operación solamente consulta y calcula información, sin crear, modificar ni eliminar datos.

Cálculos:
- Superficie: `base * altura`
- Perímetro: `2 * (base + altura)`
- Cuadrado: `base === altura`

Validaciones: la base y la altura deben estar presentes, ser valores numéricos y ser mayores que 0. Si los datos no cumplen estas condiciones, la API responde con `400 Bad Request`.

Respuesta: la API devuelve en formato JSON la base, la altura, la superficie, el perímetro y un valor booleano que indica si el rectángulo también es un cuadrado.

## Cómo probar

Iniciar el servidor con:

`node index.js`

Luego utilizar el archivo `rectangulo.http` con la extensión REST Client o cualquier cliente HTTP.