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

- **Recurso:** `alumnos`. Cada alumno se modela como `{ nombre, notas: [n1, n2, n3] }`.
- **Identificador:** se usa el `nombre` como identificador en la URL
  (`/alumnos/:nombre`) en lugar de un `id` numérico autogenerado, porque el
  propio enunciado exige que el nombre sea único: ya cumple el rol de clave
  natural, así que agregar un `id` sería redundante.
- **Promedio y condición:** son datos **derivados**, se calculan en cada
  respuesta a partir de `notas` y nunca se guardan en el arreglo interno,
  tal como pide la consigna. Así se evita que queden desactualizados si se
  modifica una nota.
- **Reglas de condición:** `promedio < 6` → `reprobado`; `6 <= promedio < 8` →
  `aprobado`; `promedio >= 8` → `promocionado`.
- **Métodos HTTP:**
  - `POST /alumnos` — crea un alumno. Body: `{ nombre, notas: [n1, n2, n3] }`.
  - `GET /alumnos` — lista todos los alumnos con su promedio y condición.
  - `GET /alumnos/:nombre` — consulta un alumno puntual.
  - `PUT /alumnos/:nombre` — reemplaza notas (y opcionalmente el nombre) de un
    alumno existente.
  - `DELETE /alumnos/:nombre` — elimina un alumno.
- **Validaciones:**
  - `nombre`: string no vacío.
  - `notas`: arreglo de exactamente 3 números, cada uno entre 0 y 10.
  - Unicidad de `nombre` al crear (`POST`) y al modificar (`PUT`, si se
    cambia el nombre a uno que ya existe se rechaza con `409 Conflict`).
  - Si el alumno no existe en `GET/PUT/DELETE /alumnos/:nombre` → `404`.

## Endpoints

| Método | Ruta               | Descripción                          |
|--------|--------------------|---------------------------------------|
| POST   | /alumnos           | Crear alumno                          |
| GET    | /alumnos           | Listar alumnos (promedio + condición) |
| GET    | /alumnos/:nombre   | Consultar un alumno                   |
| PUT    | /alumnos/:nombre   | Modificar notas / nombre              |
| DELETE | /alumnos/:nombre   | Eliminar alumno                       |
