# Ejercicio 1: Cálculo de Perímetros y Superficies de Rectángulos

## Fundamentación de las Decisiones de Diseño

* **Identificación del Recurso:**
  Se eligió la ruta `/api/rectangulos/calcular` modelando el dominio alrededor del recurso `rectangulos` y especificando la acción de cómputo.

* **Métodos HTTP Expuestos:**
  * **`GET`:** Permite realizar el cálculo mediante parámetros de búsqueda en la URL (`query params`). Se justifica su uso debido a que es una consulta pura e idempotente que no altera ningún estado en el servidor.
  * **`POST`:** Permite calcular enviando el objeto con las dimensiones en el cuerpo de la petición (`body`). Ideal para integraciones estructuradas con clientes REST.

* **Diferenciación de Cuadrados:**
  Se evalúa la condición de igualdad (`base === altura`). En la respuesta JSON se entrega la propiedad explícita `"esCuadrado": true | false` y el tipo de `"figura"` para simplificar la lógica en el frontend/cliente.

* **Validaciones de Entrada:**
  Se valida que ambos datos existan, sean de tipo numérico válido y mayores a 0. De no cumplirse, la API retorna un código de respuesta HTTP `400 Bad Request` indicando el error.