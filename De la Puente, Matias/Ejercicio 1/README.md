# Ejercicio 1

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y
superficies de rectángulos. La solución deberá permitir distinguir, cuando
corresponda, los casos que también constituyen cuadrados.

## Decisiones de diseño

### Modelo de información

Se definió un recurso `rectangulo` con la siguiente estructura:
- `id`: identificador único
- `ancho`: valor numérico positivo
- `alto`: valor numérico positivo

La información base se guarda en un arreglo interno en memoria. El cálculo de
perímetro, superficie y si el rectángulo es un cuadrado se deriva en tiempo de
respuesta para evitar almacenar campos redundantes.

### Derivación de datos

Los siguientes campos no se persisten como estado propio del recurso, sino que
se calculan al consultar:
- `perimetro`
- `superficie`
- `esCuadrado`

Esta decisión respeta el principio de que los datos derivados deben calcularse a
partir de los valores primarios, evitando inconsistencias.

### Validaciones

Al crear o actualizar un rectángulo, se valida que:
- `ancho` sea un número mayor a 0
- `alto` sea un número mayor a 0
- los valores sean finitos y no nulos

### Exposición de la funcionalidad

La API ofrece operaciones básicas de lectura, creación, actualización y
eliminación para el recurso, con respuestas en formato JSON y manejo de errores
con códigos HTTP apropiados.

## Endpoints implementados

- `GET /rectangulos`
- `GET /rectangulos/:id`
- `POST /rectangulos`
- `PUT /rectangulos/:id`
- `DELETE /rectangulos/:id`

## Implementación

Se desarrolla una API REST en español con validación de valores positivos para
ancho y alto, cálculo de perímetro, superficie y detección de cuadrados, y un
archivo HTTP para probar cada método del recurso.
