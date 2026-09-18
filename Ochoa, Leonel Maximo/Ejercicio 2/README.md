# Ejercicio 2

Desarrollar una API con ExpressJS para administrar la información académica de
los alumnos de una materia y sus calificaciones. Cada alumno deberá contar con
un nombre y tres notas, que se conservarán en un arreglo interno. No podrán
existir alumnos con el mismo nombre al crear o modificar los registros.

Al consultar las notas de un alumno, la API deberá informar su promedio y su
condición académica: reprobado para promedios menores a 6, aprobado para
promedios de 6 o 7 y promocionado para promedios de 8 o más. El promedio y la
condición son datos derivados, por lo que no deberán almacenarse en el arreglo
interno.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Recurso:** `/alumnos`.
- **Persistencia:** arreglo en memoria. Cada ítem guarda solo `id`, `nombre` y
  `notas` (arreglo de exactamente 3 valores).
- **Datos derivados:** `promedio` y `condicion` se calculan al responder; no se
  almacenan.
  - `reprobado`: promedio &lt; 6
  - `aprobado`: promedio 6 o 7 (&lt; 8)
  - `promocionado`: promedio ≥ 8
- **Unicidad:** el nombre no puede repetirse al crear ni al modificar
  (comparación sin distinguir mayúsculas/minúsculas). Conflicto → `409`.
- **Métodos HTTP:**
  - `GET /alumnos` — listar
  - `GET /alumnos/:id` — consultar uno (incluye promedio y condición)
  - `POST /alumnos` — crear (`nombre`, `notas`)
  - `PUT /alumnos/:id` — reemplazar nombre y notas
  - `DELETE /alumnos/:id` — eliminar
- **Validaciones:** nombre no vacío; exactamente 3 notas entre 0 y 10; `id`
  entero positivo.

## Cómo probar

```bash
npm start
```

Usar el archivo `alumnos.http` (extensión REST Client).
