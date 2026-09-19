# Ejercicio 2: API de Gestión Académica de Alumnos

## Fundamentación de las Decisiones de Diseño

* **Modelado del Recurso (`/alumnos`):**
  Se define el recurso en plural `/alumnos` siguiendo las convenciones REST para representar la colección de alumnos de la materia.

* **Estructura Interna de Datos:**
  Cada elemento del arreglo `alumnos` conserva de forma persistente únicamente los atributos básicos: `id`, `nombre` y `notas` (arreglo de 3 números).

* **Cálculo de Datos Derivados:**
  El `promedio` y la `condición` (`Reprobado`, `Aprobado` o `Promocionado`) no se guardan en el arreglo interno para evitar redundancia e inconsistencias. Se calculan dinámicamente al momento de construir la respuesta HTTP.

* **Validación de Nombres Únicos:**
  Al crear (`POST`) o actualizar (`PUT`), se verifica que no exista otro registro con el mismo nombre (sin distinguir mayúsculas ni minúsculas). En las actualizaciones se excluye el propio registro de la validación.

* **Validación de Calificaciones:**
  Se valida que la propiedad `notas` sea estrictamente un arreglo de 3 elementos numéricos comprendidos dentro del rango de 1 a 10.

* **Manejo de Respuestas HTTP:**
  * `200 OK`: Peticiones exitosas (`GET`, `PUT`, `DELETE`).
  * `201 Created`: Creación exitosa (`POST`).
  * `400 Bad Request`: Parámetros inválidos, datos faltantes, notas fuera de rango o nombres duplicados.
  * `404 Not Found`: Recurso no encontrado.