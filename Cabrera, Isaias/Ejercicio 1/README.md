# Ejercicio 1: Perímetros y Superficies

## Decisiones de Diseño y Fundamentación
1. **Método HTTP y Recurso:** Se utilizó `GET /rectangulos`. Al ser una consulta de cálculo matemático sin modificación de datos en el servidor, corresponde el método `GET`.
2. **Query Params:** Se reciben `base` y `altura` a través de `req.query`, permitiendo consultas directas en la URL.
3. **Diferenciación de Cuadrados:** Se evalúa la igualdad `base === altura`. Se devuelve `esCuadrado: true/false` y el tipo de `figura`.
4. **Validaciones manuales:** Se rechazan datos no numéricos, valores ausentes o dimensiones menores/iguales a 0 devolviendo `400 Bad Request`.