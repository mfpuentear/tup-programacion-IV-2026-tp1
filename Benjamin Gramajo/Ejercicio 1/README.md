# Ejercicio 1 — API de Rectángulos

## Descripción

API desarrollada con ExpressJS que resuelve consultas sobre el perímetro y la superficie de rectángulos, indicando además si el rectángulo consultado también constituye un cuadrado (cuando la base es igual a la altura).

## Decisiones de diseño

### Recurso

Se define el recurso rectángulos, no hay base de datos ni almacenamiento de rectángulos creados, ya que el enunciado pide resolver consultas de cálculo, no administrar un conjunto de rectángulos guardados. Por eso no se implementan operaciones de creación, modificación o borrado sobre este recurso.

### Método HTTP

Se eligió GET para `/rectangulos` porque:

- La operación es una consulta de solo lectura, sin efectos sobre el estado del servidor.
- Solicitar el mismo cálculo múltiples veces siempre da el mismo resultado.
- Endpoint que solo calcula valores a partir de sus entradas.

### Parámetros

Se utilizan query params (`base` y `altura`) .No se usa body, dado que GET no lleva un cuerpo de petición.

### Endpoint único vs. endpoints separados

Se optó por un único endpoint (`GET /rectangulos?base=&altura=`) que devuelve en la misma respuesta el perímetro, la superficie y el indicador `esCuadrado`, en lugar de separar en `/rectangulos/perimetro` y `/rectangulos/superficie`. Evitando calcular dos veces el mismo rectángulo con dos pedidos distintos.

### Validaciones

Los parámetros `base` y `altura` deben cumplir:

1. Estar presentes en la query string.
2. Ser valores numéricos válidos.
3. Ser mayores a 0 (un lado con longitud 0 o negativa no tiene sentido geométrico).

Si alguna validación falla, la API responde `400 Bad Request` con un detalle de los errores encontrados, en lugar de intentar calcular con valores inválidos.

## Endpoints

| Método | Recurso | Descripción |
| GET | `/rectangulos?base={n}&altura={n}` | Calcula perímetro, superficie e indica si es cuadrado

### Ejemplo de respuesta exitosa

```json
{
  "base": 8,
  "altura": 8,
  "perimetro": 32,
  "superficie": 64,
  "esCuadrado": true
}
```

### Ejemplo de respuesta con error

```json
{
  "errores": ["El parámetro \"altura\" es obligatorio."]
}
```
