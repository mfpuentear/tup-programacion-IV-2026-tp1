# Ejercicio 1

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y
superficies de rectángulos. La solución deberá permitir distinguir, cuando
corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Método HTTP:** se utiliza `GET` con query params (`base`, `altura`) en lugar de `POST` con body, ya que se trata de una consulta de cálculo sobre valores dados por el usuario, sin creación ni persistencia de datos.

- **Campo `esCuadrado`:** se incluye en toda respuesta, con valor `true` o `false`, en lugar de omitirlo cuando no corresponde, por consistencia en el formato de la API.

- **Validación:** se rechazan valores no numéricos, faltantes o menores/iguales a 0 para `base` y `altura`, ya que un rectángulo no puede tener lados nulos o negativos.
