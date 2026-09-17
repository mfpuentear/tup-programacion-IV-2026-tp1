# Ejercicio 1

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y
superficies de rectángulos. La solución deberá permitir distinguir, cuando
corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Recurso:** `/rectangulos`. Un cuadrado es un rectángulo con `base === altura`,
  por eso no se crea un recurso aparte; se informa con el campo derivado `esCuadrado`.
- **Persistencia:** arreglo en memoria. Cada ítem guarda solo `id`, `base` y `altura`.
- **Datos derivados:** `perimetro`, `superficie` y `esCuadrado` se calculan al
  responder; no se almacenan.
- **Métodos HTTP:**
  - `GET /rectangulos` — listar
  - `GET /rectangulos/:id` — consultar uno
  - `POST /rectangulos` — crear (`base`, `altura`)
  - `PUT /rectangulos/:id` — reemplazar lados
  - `DELETE /rectangulos/:id` — eliminar
- **Validaciones:** `base` y `altura` deben ser números finitos mayores a 0.
  El `id` de la ruta debe ser un entero positivo. Respuestas `400` / `404` según el caso.

## Cómo probar

```bash
npm start
```

Usar el archivo `rectangulos.http` (extensión REST Client) o cualquier cliente HTTP.
