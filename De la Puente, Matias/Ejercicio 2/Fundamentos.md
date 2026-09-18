# Fundamentos de Diseño de Ejercicio 2

## 1. Cálculo dinámico de datos derivados
El promedio y la condición académica (Reprobado, Aprobado, Promocionado) no se guardan en el arreglo interno de alumnos. En su lugar, se creó la función `calcularEstadoAcademico` que realiza la cuenta matemática en el momento exacto en que se solicita la información.
*  Para evitar inconsistencias de datos. Si guardáramos el promedio fijo y luego modificáramos una nota del alumno usando la ruta `PUT`, tendríamos que acordarnos de actualizar el promedio también. Al calcularlo "al instante", garantizamos que el resultado siempre sea exacto en base a las notas actuales.

## 2. Reutilización de código
Toda la lógica de sumar las notas, dividirlas y aplicar los condicionales (`if/else`) se separó del bloque principal y se encapsuló en su propia función.
* La API necesita calcular el estado académico en dos lugares distintos: cuando pedimos la lista de todos los alumnos (`GET /alumnos`) y cuando buscamos a uno específico (`GET /alumnos/:nombre`). Extraer esta lógica a una función externa evita repetir código, hace que el archivo sea más fácil de leer y permite que, si mañana cambia la regla de aprobación, solo tengamos que modificar el código en un solo lugar.

## 3. Búsquedas insensibles a mayúsculas (Case-insensitive)
En las rutas para buscar (`GET`), crear (`POST`) o modificar (`PUT`) alumnos, se implementó el método `.toLocaleLowerCase()` para transformar temporalmente todos los nombres a minúsculas antes de compararlos.
*  Para el lenguaje JavaScript, "Juan", "JUAN" y "juan" son tres valores totalmente diferentes. Al forzar la conversión a minúsculas internamente, evitamos que se creen registros duplicados por error de tipeo y mejoramos la experiencia del usuario, quien podrá encontrar al alumno sin importar cómo escriba su nombre en la URL.

## 4. Validaciones de información
Antes de permitir que se guarde o modifique la información de un alumno, la API realiza un filtro de los datos enviados en el `req.body`:
* Verifica que se envíe un arreglo y que contenga exactamente 3 elementos.
* Comprueba que cada elemento sea de tipo numérico (`typeof nota !== 'number'`).
* Asegura que las notas estén dentro del rango lógico escolar (entre 0 y 10).


## 5. Los verbos HTTP
Se utilizaron para realizar las diferentes peticiones, envíos o modificaciones:
* **GET:** Exclusivo para consultar y leer información de forma segura.
* **POST:** Exclusivo para insertar un alumno nuevo, respondiendo con un código `201 Created` cuando se carga el alumno con éxito.
* **PUT:** Exclusivo para actualizar o sobrescribir los datos de un alumno existente, utilizando parámetros de ruta (`/:nombreActual`) para identificar a quién se quiere modificar.