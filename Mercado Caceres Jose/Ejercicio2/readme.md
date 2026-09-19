# Ejercicio 2 - Gestión Académica de Alumnos

## Descripción
API REST para administrar la información académica de los alumnos y sus calificaciones. Permite realizar el CRUD completo y calcula dinámicamente el promedio y la condición académica.

## Decisiones de Diseño
* **Identificador de Recurso:** Dado que no se cuenta con un ID autoincremental en el arreglo interno y la regla de negocio establece que no pueden existir nombres duplicados, se utiliza el `nombre` del alumno como identificador único en las rutas (ej. `/alumnos/:nombre`).
* **Cálculo "Al Vuelo" de datos derivados:** El promedio y la condición (aprobado, reprobado, promocionado) no se almacenan en el arreglo interno. Se calculan en tiempo de ejecución al invocar el método GET. Esta decisión previene inconsistencias de datos (por ejemplo, evitar que se modifique una nota pero quede almacenado el promedio anterior).
* **Verbos HTTP Semánticos:** Se respetan los estándares REST utilizando POST para crear nuevos registros, GET para consultar el estado, PUT para modificar las notas, y DELETE para eliminar al alumno del registro.