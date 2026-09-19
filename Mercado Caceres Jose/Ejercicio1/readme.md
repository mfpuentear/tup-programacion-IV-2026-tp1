# Ejercicio 1 - Calculadora de Rectángulos

## Descripción
Esta API expone un servicio para resolver consultas sobre perímetros y superficies de rectángulos, identificando además de forma automática si las medidas proporcionadas corresponden a un cuadrado.

## Decisiones de Diseño
* **Método HTTP (GET):** Se optó por el método GET ya que la operación es "stateless" (sin estado). No altera el estado del servidor ni crea recursos persistentes, simplemente recibe parámetros, procesa la información y devuelve un resultado matemático.
* **Envío de datos (Query Strings):** Los datos `base` y `altura` se envían a través de la URL (`?base=X&altura=Y`). Al tratarse de parámetros de consulta simples en una petición GET, el uso de query strings es el estándar adecuado de la industria.
* **Validaciones:** Se implementó una validación estricta para asegurar que ambos parámetros existan, sean valores numéricos y estrictamente mayores a cero, retornando un código de estado HTTP 400 (Bad Request) con un mensaje claro en caso de error.