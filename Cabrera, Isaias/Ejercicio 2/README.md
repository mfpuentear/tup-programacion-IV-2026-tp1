# Ejercicio 2: Administración Académica de Alumnos

## Decisiones de Diseño y Modelado
1. **Persistencia en Memoria:** El arreglo interno almacena estrictamente `{ nombre: string, notas: number[] }`. El promedio y la condición (`reprobado`, `aprobado`, `promocionado`) son datos derivados calculados en tiempo de ejecución al construir la respuesta.
2. **Identificador de Recurso:** Se utiliza el nombre del estudiante como clave unívoca mediante parámetros de ruta (`/alumnos/:nombre`), utilizando comparaciones en minúsculas y normalización con `.trim()` para evitar problemas con espacios accidentales.
3. **Validaciones Manuales:** Se controlan tipos numéricos, exactamente 3 notas dentro del rango 1 a 10 y colisión de nombres (respondiendo `409 Conflict`).