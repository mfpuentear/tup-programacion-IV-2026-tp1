# API para Cálculo de Rectángulos

Este proyecto es una API REST desarrollada con Node.js y Express que permite calcular las propiedades geométricas de un rectángulo (perímetro, superficie y si es un cuadrado) a través de sus dimensiones pasadas por parámetros de consulta (query parameters).

## Características

* **Validaciones sólidas:** Verifica que los parámetros `ancho` y `alto` estén presentes, sean numéricos y mayores a cero (`> 0`).
* **Lógica desacoplada:** La función `calcularRectangulo` procesa los datos de manera independiente para un código más modular y mantenible.
* **Manejo de errores:** Captura excepciones y retorna respuestas en formato JSON con código de estado HTTP adecuado (`200 OK` o `400 Bad Request`).

## Ejecución

Para iniciar el servidor, ejecuta:

```
node app.js
```

*El servidor se ejecutará por defecto en `http://localhost:3000`.*

## Uso de la API

### Endpoint

`GET /api/rectangulos/calcular`

### Parámetros de consulta (Query Params)

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `ancho` | `Number` | Sí | Ancho del rectángulo (mayor a 0) |
| `alto` | `Number` | Sí | Alto del rectángulo (mayor a 0) |

## Ejemplos de Peticiones HTTP

### 1. Rectángulo estándar

```
GET http://localhost:3000/api/rectangulos/calcular?ancho=10&alto=5 HTTP/1.1
```

**Respuesta:**

```json
{
  "exito": true,
  "datos": {
    "dimensiones": { "ancho": 10, "alto": 5 },
    "perimetro": 30,
    "superficie": 50,
    "esCuadrado": false
  }
}
```

### 2. Cuadrado

```
GET http://localhost:3000/api/rectangulos/calcular?ancho=6&alto=6 HTTP/1.1
```

**Respuesta:** `"esCuadrado": true`

### 3. Error: Parámetro inválido o faltante

```
GET http://localhost:3000/api/rectangulos/calcular?ancho=-2&alto=5 HTTP/1.1
```

**Respuesta (`400 Bad Request`):**

```json
{
  "exito": false,
  "error": "Los parámetros \"ancho\" y \"alto\" son obligatorios y deben ser números mayores a 0."
}
```