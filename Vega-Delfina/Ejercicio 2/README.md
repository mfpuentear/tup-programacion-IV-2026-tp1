## Ejercicio 2 - Administracion de informacion academica

Cada alumno se representa con tres campos: 'id', 'nombre' y 'notas' con un arreglo de 3 numeros. Se utiliza un 'id' autogenerado como identificador unico de cada alumno, en lugar de usar el 'nombre' como identificador en la URL, porque el nombre es un dato que se puede
modificar mediante un PUT y no es conveniente usar como referencia algo que puede cambiar.

El promedio y la condición no se almacenan porque se pueden calcular a partir de las notas. Se calculan al momento de consultar al alumno para que siempre correspondan a sus notas actuales.

Recurso y métodos HTTP:
GET  /alumnos  : Listar todos los alumnos
GET /alumnos/:id   : Ver el detalle de un alumno, con promedio y condición calculados
POST /alumnos  : Crear un nuevo alumno
PUT  /alumnos/:id  : Modificar nombre y/o notas de un alumno existente
DELETE  /alumnos/:id  : Eliminar un alumno

Validaciones y funcionamiento:
se aplico validaciones para asegurar que los datos ingresados sean correctos como numero de ID vakido y en el caso de no encontrar al alumno se devuelve un error 404, ya que la solicitud es correcta pero el alumno buscado no se encuentra

El nombre debe ser un texto y no puede estar vacio, porque todos los alumnos deben tener un nombre. Las notas deben ser exactamente tres numeros entre 0 y 10 como lo pide el enunciado.

No pueden existir dos alumnos con el mismo nombre al crear o modificar, se compara ignorando mayusculas/minusculas para evitar duplicados como "Juan Perez" y "juan perez". Al modificar, se excluye al propio alumno de esta comprobacion