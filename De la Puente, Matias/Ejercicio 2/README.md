# Ejercicio 2 

API REST desarrollada con ExpressJS para gestionar las calificaciones de alumnos de una materia.

##  Decisiones de Diseño


 **Almacenamiento:** Los registros se guardan en un arreglo en memoria con formato `{ id, nombre, notas }`.
 **Datos Derivados:** El **promedio** y la **condición** (`Reprobado`, `Aprobado`, `Promocionado`) no se persisten en el arreglo, sino que se calculan al momento de responder la consulta.
 **Validación de Unicidad:** No se permite guardar o actualizar un registro si el nombre del alumno ya existe en el sistema.
 **Métodos HTTP Utilizados:**
   `GET /api/alumnos`: Lista todos los alumnos con sus notas, promedio y condición.
   `GET /api/alumnos/:id`: Obtiene el detalle de un alumno en particular.

   `POST /api/alumnos`: Registra un nuevo alumno.

   `PUT /api/alumnos/:id`: Actualiza la información de un alumno.
   
   `DELETE /api/alumnos/:id`: Elimina a un alumno por su ID.