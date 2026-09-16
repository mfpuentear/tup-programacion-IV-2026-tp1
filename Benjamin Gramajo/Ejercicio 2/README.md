# Ejercicio 2 — API de Alumnos y Calificaciones

## Descripción

API desarrollada con ExpressJS para administrar alumnos de una materia, cada uno con un nombre y tres notas. Permite crear, consultar, modificar y eliminar alumnos, informando en cada consulta el promedio y la condición académica calculados a partir de las notas.

## Decisiones de diseño

### Recurso e identificador

Se define el recurso alumnos. A diferencia de un ejercicio de cálculo puro, acá sí hace falta persistir información (en memoria, sin base de datos), ya que el enunciado requiere administrar un conjunto de alumnos a lo largo del tiempo.

Como el enunciado no define ningún ID numérico y exige que el nombre sea único, se usa el nombre como identificador natural del recurso en la URL: `/alumnos/:nombre`.

### Métodos HTTP

| Método   | Endpoint           | Uso                         |
| -------- | ------------------ | --------------------------- |
| `POST`   | `/alumnos`         | Crear un alumno nuevo       |
| `GET`    | `/alumnos`         | Listar todos los alumnos    |
| `GET`    | `/alumnos/:nombre` | Consultar un alumno puntual |
| `PUT`    | `/alumnos/:nombre` | Modificar nombre y/o notas  |
| `DELETE` | `/alumnos/:nombre` | Eliminar un alumno          |

Se eligió `PUT` (y no `PATCH`) porque el enunciado no distingue actualizaciones parciales: cada modificación reemplaza el nombre y las tres notas completas del alumno.

### Promedio y condición como datos derivados

El enunciado indica explícitamente que el promedio y la condición no deben almacenarse. Por eso se calculan en el momento de armar cada respuesta (en `GET`, `POST` y `PUT`), a partir del arreglo `notas`, y nunca se guardan en el objeto interno del alumno. Esto evita que quede una condición "vieja" inconsistente si más adelante se modifican las notas.

Reglas de cálculo:

- **Promedio:** suma de las tres notas dividido 3.
- **Condición:**
  - `< 6` → `reprobado`
  - `6` a `7` → `aprobado`
  - `>= 8` → `promocionado`

### Validaciones

- **`nombre`**: obligatorio, debe ser una cadena de texto no vacía.
- **`notas`**: debe ser un arreglo de exactamente 3 números, cada uno entre 0 y 10.
- **Alumno inexistente**: en `GET`, `PUT` o `DELETE` sobre un nombre que no existe, se responde `404 Not Found`.

## Ejemplo de respuesta

```json
{
  "nombre": "Ana Perez",
  "notas": [8, 9, 7],
  "promedio": 8,
  "condicion": "promocionado"
}
```
