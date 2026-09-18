## Decisiones de Diseño - Ejercicio 2

### 1. Modelado de Datos y Datos Derivados
Se diseñó la estructura de alumno manteniendo en el arreglo interno únicamente los atributos indispensables: "nombre" y "notas" 
*Fundamento: El promedio y la condición son calculados en base a las notas. Al no almacenarlos de forma persistente en la memoria, se evita la redundancia de datos e inconsistencias (por ejemplo, evitar que el promedio quede desactualizado si se modifican las notas). Estos datos se calculan únicamente al generar las respuestas HTTP.

### 2. Uso de Verbos HTTP RESTful
* `GET /alumnos`: Para consultar la lista general o un alumno individual por parámetro de ruta.
* `POST /alumnos`: Para dar de alta nuevos alumnos enviando la información en el `body`.
* `PUT /alumnos/:nombre`: Para modificar los datos de un alumno existente.
* `DELETE /alumnos/:nombre`: Para dar de baja a un estudiante.

### 3. Validación de Unicidad
Se implementó una validación sobre el atributo "nombre" tanto en el método "POST" como en el "PUT". Antes de guardar o actualizar, se convierte el texto a minúsculas para comparar con los registros existentes, impidiendo el registro de duplicados independientemente de las mayúsculas/minúsculas.

### 4. Manejo de Errores
Se retorna el código de estado "400 Bad Request" cuando la información enviada en el body es incompleta, no contiene exactamente 3 notas, las notas no están entre 0 y 10, o el nombre ya se encuentra registrado. Se responde con "404 Not Found" cuando el alumno consultado no existe en el registro.